import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import User from '../models/User';
import { requireAuth } from '../middleware/auth';

// Validation schemas
const registerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'manager', 'user']).optional().default('user'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(fastify: FastifyInstance) {
  // Register new user
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      console.log('Registration request received:', request.body);
      const { firstName, lastName, email, password, role } = registerSchema.parse(request.body);

      console.log('Data validated, checking if user exists...');
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return reply.status(400).send({
          error: 'User already exists',
          message: 'A user with this email already exists',
        });
      }

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      console.log('Creating new user:', { firstName, lastName, email, role });
      try {
        await user.save();
        console.log('User saved successfully');
      } catch (saveError) {
        console.error('Error saving user:', saveError);
        throw saveError;
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      reply.status(201).send({
        message: 'User registered successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return reply.status(400).send({
          error: 'Validation Error',
          details: error.errors,
        });
      }
      
      if (error.code === 11000) {
        console.error('Duplicate key error:', error);
        return reply.status(400).send({
          error: 'User already exists',
          message: 'A user with this email already exists',
        });
      }
      
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to register user',
        details: process.env.NODE_ENV === 'production' ? undefined : String(error),
      });
    }
  });

  // Login user
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return reply.status(401).send({
          error: 'Account disabled',
          message: 'Your account has been disabled. Please contact support.',
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      reply.send({
        message: 'Login successful',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: error.errors,
        });
      }
      
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to login',
      });
    }
  });

  // Get current user info
  fastify.get('/me', {
    preHandler: [requireAuth],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await User.findById(request.user.id);
      if (!user) {
        return reply.status(404).send({
          error: 'User not found',
          message: 'User not found',
        });
      }

      reply.send({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          phone: user.phone,
          address: user.address,
          location: user.location,
          district: user.district,
          pincode: user.pincode,
          state: user.state,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to get user info',
      });
    }
  });

  // Logout (client-side token removal)
  fastify.post('/logout', {
    preHandler: [requireAuth],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({
      message: 'Logout successful',
    });
  });
} 