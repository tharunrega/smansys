import { FastifyRequest, FastifyReply } from 'fastify';
import { FastifyJWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    };
    user: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    };
  }
}

// Middleware to verify JWT token
export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

// Middleware to require specific role
export const requireRole = (allowedRoles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      
      if (!allowedRoles.includes(request.user.role)) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        });
      }
    } catch (err) {
      reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }
  };
};

// Middleware to require any of the specified roles
export const requireAnyRole = (allowedRoles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      
      if (!allowedRoles.includes(request.user.role)) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: `Access denied. Required one of: ${allowedRoles.join(', ')}`,
        });
      }
    } catch (err) {
      reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }
  };
};

// Middleware to require admin role
export const requireAdmin = requireRole(['admin']);

// Middleware to require manager or admin role
export const requireManagerOrAdmin = requireAnyRole(['admin', 'manager']);

// Middleware to require any authenticated user
export const requireAuth = authenticate; 