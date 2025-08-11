import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import profileRoutes from './routes/profile';
import studentRoutes from './routes/students';

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
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'fallback-secret',
  sign: {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});

fastify.register(multipart);

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(dashboardRoutes, { prefix: '/api/dashboard' });
fastify.register(profileRoutes, { prefix: '/api/profile' });
fastify.register(studentRoutes, { prefix: '/api/students' });

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation Error',
      details: error.validation,
    });
  }
  
  reply.status(error.statusCode || 500).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
  });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '5000');
    
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    await fastify.listen({ port, host: '0.0.0.0' });
    
    fastify.log.info(`🚀 Server running on port ${port}`);
    fastify.log.info(`📊 Dashboard API ready at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 