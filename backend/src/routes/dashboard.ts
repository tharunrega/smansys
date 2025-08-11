import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import User from '../models/User';
import { requireAuth, requireManagerOrAdmin } from '../middleware/auth';

// Query parameter schemas
const dashboardQuerySchema = z.object({
  dateRange: z.enum(['7days', '30days', '90days', 'custom']).optional().default('30days'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  role: z.enum(['admin', 'manager', 'user', 'all']).optional().default('all'),
  search: z.string().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default(10),
});

export default async function dashboardRoutes(fastify: FastifyInstance) {
  // Get dashboard overview data
  fastify.get('/', {
    preHandler: [requireAuth],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = dashboardQuerySchema.parse(request.query);
      const { dateRange, startDate, endDate, role, search } = query;

      // Calculate date range
      let start: Date, end: Date;
      const now = new Date();
      
      switch (dateRange) {
        case '7days':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          end = now;
          break;
        case '30days':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          end = now;
          break;
        case '90days':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          end = now;
          break;
        case 'custom':
          start = startDate ? new Date(startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          end = endDate ? new Date(endDate) : now;
          break;
        default:
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          end = now;
      }

      // Build filter query
      const filterQuery: any = {
        createdAt: { $gte: start, $lte: end },
        isActive: true,
      };

      if (role && role !== 'all') {
        filterQuery.role = role;
      }

      if (search) {
        filterQuery.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      // Get user counts by role
      const roleCounts = await User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]);

      // Get total users in date range
      const totalUsers = await User.countDocuments(filterQuery);

      // Get new users in date range
      const newUsers = await User.countDocuments({
        createdAt: { $gte: start, $lte: end },
        isActive: true,
      });

      // Get active users (logged in within last 7 days)
      const activeUsers = await User.countDocuments({
        lastLogin: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
        isActive: true,
      });

      // Get users by creation date for trend chart
      const userTrend = await User.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      ]);

      // Format trend data
      const trendData = userTrend.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        count: item.count,
      }));

      // Get recent users
      const recentUsers = await User.find(filterQuery)
        .select('firstName lastName email role avatar createdAt lastLogin')
        .sort({ createdAt: -1 })
        .limit(5);

      reply.send({
        overview: {
          totalUsers: await User.countDocuments({ isActive: true }),
          newUsers,
          activeUsers,
          roleDistribution: roleCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {} as Record<string, number>),
        },
        trends: {
          period: { start, end },
          userGrowth: trendData,
        },
        recentUsers,
        filters: {
          dateRange,
          role,
          search,
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
        message: 'Failed to get dashboard data',
      });
    }
  });

  // Get detailed user analytics (admin/manager only)
  fastify.get('/analytics', {
    preHandler: [requireManagerOrAdmin],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = dashboardQuerySchema.parse(request.query);
      const { dateRange, startDate, endDate, role, search, page, limit } = query;

      // Calculate date range
      let start: Date, end: Date;
      const now = new Date();
      
      switch (dateRange) {
        case '7days':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          end = now;
          break;
        case '30days':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          end = now;
          break;
        case '90days':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          end = now;
          break;
        case 'custom':
          start = startDate ? new Date(startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          end = endDate ? new Date(endDate) : now;
          break;
        default:
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          end = now;
      }

      // Build filter query
      const filterQuery: any = {
        createdAt: { $gte: start, $lte: end },
        isActive: true,
      };

      if (role && role !== 'all') {
        filterQuery.role = role;
      }

      if (search) {
        filterQuery.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      // Get paginated users
      const skip = (page - 1) * limit;
      const users = await User.find(filterQuery)
        .select('firstName lastName email role avatar createdAt lastLogin isActive')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments(filterQuery);

      // Get role-based statistics
      const roleStats = await User.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            avgCreatedAt: { $avg: { $toDate: '$createdAt' } },
            lastLoginCount: {
              $sum: {
                $cond: [
                  { $gte: ['$lastLogin', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0,
                ],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      reply.send({
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        statistics: {
          period: { start, end },
          roleStats,
          filters: {
            dateRange,
            role,
            search,
          },
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
        message: 'Failed to get analytics data',
      });
    }
  });
} 