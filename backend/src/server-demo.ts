import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register plugins
fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001').split(',');
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed'), false);
  },
  credentials: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'fallback-secret',
  sign: {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});

fastify.register(multipart);

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// In-memory users database for demo
const users = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: '$2a$12$yHGD.vrEZVaZCbJLKds29.kvVJwAKkTDnExhT56qNuFEQQa.ImXDO', // 'password'
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin@example.com',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    firstName: 'Manager',
    lastName: 'User',
    email: 'manager@example.com',
    password: '$2a$12$yHGD.vrEZVaZCbJLKds29.kvVJwAKkTDnExhT56qNuFEQQa.ImXDO', // 'password'
    role: 'manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager@example.com',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    firstName: 'Regular',
    lastName: 'User',
    email: 'user@example.com',
    password: '$2a$12$yHGD.vrEZVaZCbJLKds29.kvVJwAKkTDnExhT56qNuFEQQa.ImXDO', // 'password'
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }
];

// Mock database functions
const bcrypt = require('bcryptjs');

// Auth routes
fastify.post('/api/auth/register', async (request, reply) => {
  try {
    const { firstName, lastName, email, password, role = 'user' } = request.body as any;
    
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'All fields are required',
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return reply.status(400).send({
        error: 'User already exists',
        message: 'A user with this email already exists',
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = fastify.jwt.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });
    
    console.log('User registered:', { firstName, lastName, email, role });
    
    return reply.status(201).send({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Failed to register user',
    });
  }
});

// Login route
fastify.post('/api/auth/login', async (request, reply) => {
  try {
    const { email, password } = request.body as any;
    
    // Validate input
    if (!email || !password) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Email and password are required',
      });
    }
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return reply.status(401).send({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    
    // Generate JWT token
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    
    console.log('User logged in:', { email });
    
    return reply.send({
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Failed to login',
    });
  }
});

// Profile routes
fastify.get('/api/profile', async (request, reply) => {
  try {
    const auth = request.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authentication token is required',
      });
    }
    
    const token = auth.split(' ')[1];
    const decoded = fastify.jwt.verify(token) as any;
    
    const user = users.find(user => user.id === decoded.id);
    if (!user) {
      return reply.status(404).send({
        error: 'User not found',
        message: 'User not found',
      });
    }
    
    return reply.send({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Failed to get profile',
    });
  }
});

// Dashboard routes - simple mock data
fastify.get('/api/dashboard', async (request, reply) => {
  try {
    const mockData = {
      overview: {
        totalUsers: 5909,
        newUsers: 120,
        activeUsers: 4532,
        roleDistribution: {
          admin: 100,
          manager: 60,
          user: 5749,
        },
      },
      trends: {
        period: { start: '2025-07-12T00:00:00Z', end: '2025-08-12T00:00:00Z' },
        userGrowth: [
          { date: '2025-07-12', count: 5789 },
          { date: '2025-07-19', count: 5820 },
          { date: '2025-07-26', count: 5850 },
          { date: '2025-08-02', count: 5880 },
          { date: '2025-08-09', count: 5909 },
        ],
      },
      recentUsers: [
        {
          id: '101',
          firstName: 'Jane',
          lastName: 'Cooper',
          email: 'jane@example.com',
          role: 'user',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane@example.com',
          createdAt: '2025-08-10T12:30:00Z',
        },
        {
          id: '102',
          firstName: 'Kristin',
          lastName: 'Watson',
          email: 'kristin@example.com',
          role: 'user',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kristin@example.com',
          createdAt: '2025-08-09T10:15:00Z',
        },
        {
          id: '103',
          firstName: 'Jenny',
          lastName: 'Wilson',
          email: 'jenny@example.com',
          role: 'manager',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jenny@example.com',
          createdAt: '2025-08-08T14:45:00Z',
        },
      ],
    };
    
    return reply.send(mockData);
  } catch (error) {
    console.error('Dashboard error:', error);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Failed to get dashboard data',
    });
  }
});

// Start the server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '5001');
    
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`✅ Server running on port ${port}`);
    console.log(`🚀 Dashboard API ready at http://localhost:${port}`);
    
    // Log demo accounts
    console.log('\n📝 Demo Accounts:');
    console.log('- Admin:   admin@example.com / password');
    console.log('- Manager: manager@example.com / password');
    console.log('- User:    user@example.com / password');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
