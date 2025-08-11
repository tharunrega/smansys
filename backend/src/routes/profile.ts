import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import User from '../models/User';
import { requireAuth } from '../middleware/auth';

// Validation schemas
const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().regex(/^[0-9+\-\s()]+$/).optional(),
  address: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  pincode: z.string().regex(/^[0-9]{6}$/).optional(),
  state: z.string().max(100).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export default async function profileRoutes(fastify: FastifyInstance) {
  // Get user profile
  fastify.get('/', {
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
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to get profile',
      });
    }
  });

  // Update user profile
  fastify.put('/', {
    preHandler: [requireAuth],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const updateData = updateProfileSchema.parse(request.body);
      
      // Remove undefined fields
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

      if (Object.keys(cleanUpdateData).length === 0) {
        return reply.status(400).send({
          error: 'No data to update',
          message: 'Please provide at least one field to update',
        });
      }

      const user = await User.findByIdAndUpdate(
        request.user.id,
        { $set: cleanUpdateData },
        { new: true, runValidators: true }
      );

      if (!user) {
        return reply.status(404).send({
          error: 'User not found',
          message: 'User not found',
        });
      }

      reply.send({
        message: 'Profile updated successfully',
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
          updatedAt: user.updatedAt,
        },
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
        message: 'Failed to update profile',
      });
    }
  });

  // Change password
  fastify.put('/password', {
    preHandler: [requireAuth],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(request.body);

      // Get user with password
      const user = await User.findById(request.user.id).select('+password');
      if (!user) {
        return reply.status(404).send({
          error: 'User not found',
          message: 'User not found',
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return reply.status(400).send({
          error: 'Invalid password',
          message: 'Current password is incorrect',
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      reply.send({
        message: 'Password changed successfully',
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
        message: 'Failed to change password',
      });
    }
  });

  // Upload avatar
  fastify.post('/avatar', {
    preHandler: [requireAuth],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({
          error: 'No file uploaded',
          message: 'Please upload an image file',
        });
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(data.mimetype)) {
        return reply.status(400).send({
          error: 'Invalid file type',
          message: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)',
        });
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (data.file.bytesRead > maxSize) {
        return reply.status(400).send({
          error: 'File too large',
          message: 'File size must be less than 5MB',
        });
      }

      // Generate a unique filename
      const timestamp = Date.now();
      const fileExtension = data.filename.split('.').pop();
      const uniqueFilename = `${request.user.id}-${timestamp}.${fileExtension}`;
      
      // In a real application, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
      // For this implementation, we'll use a deterministic avatar from DiceBear,
      // but in production you'd want to store the actual uploaded file
      
      // Store file buffer if needed
      const chunks = [];
      for await (const chunk of data.file) {
        chunks.push(chunk);
      }
      // const buffer = Buffer.concat(chunks);
      // await fs.promises.writeFile(`./uploads/${uniqueFilename}`, buffer);
      
      // Create avatar URL - in production, this would be the URL to the uploaded file
      // For now, we're using a placeholder service that generates consistent avatars
      const userSeed = `${request.user.firstName}-${request.user.lastName}-${timestamp}`;
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userSeed)}`;
      
      // Update user avatar
      const user = await User.findByIdAndUpdate(
        request.user.id,
        { avatar: avatarUrl },
        { new: true }
      );

      if (!user) {
        return reply.status(404).send({
          error: 'User not found',
          message: 'User not found',
        });
      }

      reply.send({
        message: 'Avatar uploaded successfully',
        avatar: user.avatar,
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to upload avatar',
      });
    }
  });

  // Delete avatar
  fastify.delete('/avatar', {
    preHandler: [requireAuth],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await User.findByIdAndUpdate(
        request.user.id,
        { avatar: '' },
        { new: true }
      );

      if (!user) {
        return reply.status(404).send({
          error: 'User not found',
          message: 'User not found',
        });
      }

      reply.send({
        message: 'Avatar removed successfully',
        avatar: user.avatar,
      });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to remove avatar',
      });
    }
  });
} 