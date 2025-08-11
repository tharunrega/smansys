import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import mongoose from 'mongoose';
import { requireAuth, requireManagerOrAdmin } from '../middleware/auth';

// Define Student schema
const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  accommodationType: {
    type: String,
    enum: ['Day Scholler', 'Hosteller'],
    default: 'Day Scholler',
  },
  transportNeeded: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: true,
  },
  location: String,
  district: String,
  pincode: String,
  state: String,
  contactNumber: String,
  email: String,
  parentDetails: {
    fatherName: String,
    fatherContact: String,
    fatherOccupation: String,
    motherName: String,
    motherContact: String,
    annualIncome: Number,
  },
  academicDetails: {
    rank: String,
    points: {
      type: Number,
      default: 0,
    },
  },
  avatar: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model('Student', studentSchema);

// Validation schemas
const studentQuerySchema = z.object({
  search: z.string().optional(),
  class: z.string().optional(),
  section: z.string().optional(),
  accommodationType: z.enum(['Day Scholler', 'Hosteller']).optional(),
  transportNeeded: z.boolean().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
});

const createStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  rollNumber: z.string().min(1, 'Roll number is required'),
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dateOfBirth: z.string().transform(val => new Date(val)),
  accommodationType: z.enum(['Day Scholler', 'Hosteller']).default('Day Scholler'),
  transportNeeded: z.boolean().default(false),
  address: z.string().min(1, 'Address is required'),
  location: z.string().optional(),
  district: z.string().optional(),
  pincode: z.string().optional(),
  state: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().email().optional(),
  parentDetails: z.object({
    fatherName: z.string().optional(),
    fatherContact: z.string().optional(),
    fatherOccupation: z.string().optional(),
    motherName: z.string().optional(),
    motherContact: z.string().optional(),
    annualIncome: z.number().optional(),
  }).optional(),
  avatar: z.string().optional(),
});

export default async function studentRoutes(fastify: FastifyInstance) {
  // Get all students with filtering and pagination
  fastify.get('/', {
    preHandler: [requireAuth, requireManagerOrAdmin],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = studentQuerySchema.parse(request.query);
      const { search, class: className, section, accommodationType, transportNeeded, page, limit } = query;
      
      // Build filter
      const filter: any = {};
      
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
        ];
      }
      
      if (className) {
        filter.class = className;
      }
      
      if (section) {
        filter.section = section;
      }
      
      if (accommodationType) {
        filter.accommodationType = accommodationType;
      }
      
      if (transportNeeded !== undefined) {
        filter.transportNeeded = transportNeeded;
      }
      
      // Get total count
      const totalCount = await Student.countDocuments(filter);
      
      // Get students with pagination
      const students = await Student.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-__v');
      
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);
      
      return reply.send({
        data: students,
        meta: {
          page,
          limit,
          totalCount,
          totalPages,
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
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch students',
      });
    }
  });
  
  // Create a new student
  fastify.post('/', {
    preHandler: [requireAuth, requireManagerOrAdmin],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const studentData = createStudentSchema.parse(request.body);
      
      // Check if roll number already exists
      const existingStudent = await Student.findOne({ rollNumber: studentData.rollNumber });
      if (existingStudent) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: 'A student with this roll number already exists',
        });
      }
      
      // Create student
      const student = new Student(studentData);
      await student.save();
      
      return reply.status(201).send({
        message: 'Student created successfully',
        data: student,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: error.errors,
        });
      }
      
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to create student',
      });
    }
  });
  
  // Get a student by ID
  fastify.get('/:id', {
    preHandler: [requireAuth, requireManagerOrAdmin],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      
      const student = await Student.findById(id).select('-__v');
      if (!student) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Student not found',
        });
      }
      
      return reply.send({
        data: student,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch student',
      });
    }
  });
  
  // Update a student
  fastify.put('/:id', {
    preHandler: [requireAuth, requireManagerOrAdmin],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const studentData = createStudentSchema.parse(request.body);
      
      // Check if student exists
      const student = await Student.findById(id);
      if (!student) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Student not found',
        });
      }
      
      // Check if roll number is being changed and already exists
      if (studentData.rollNumber !== student.rollNumber) {
        const existingStudent = await Student.findOne({ rollNumber: studentData.rollNumber });
        if (existingStudent) {
          return reply.status(400).send({
            error: 'Validation Error',
            message: 'A student with this roll number already exists',
          });
        }
      }
      
      // Update student
      const updatedStudent = await Student.findByIdAndUpdate(id, {
        ...studentData,
        updatedAt: new Date(),
      }, { new: true }).select('-__v');
      
      return reply.send({
        message: 'Student updated successfully',
        data: updatedStudent,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: error.errors,
        });
      }
      
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to update student',
      });
    }
  });
  
  // Delete a student
  fastify.delete('/:id', {
    preHandler: [requireAuth, requireManagerOrAdmin],
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      
      // Check if student exists
      const student = await Student.findById(id);
      if (!student) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Student not found',
        });
      }
      
      // Delete student
      await Student.findByIdAndDelete(id);
      
      return reply.send({
        message: 'Student deleted successfully',
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to delete student',
      });
    }
  });
}
