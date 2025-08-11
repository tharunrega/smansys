'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import MetricCard from '@/components/ui/MetricCard';
import { EarningsChart, UserGrowthChart, FeesCollectionChart } from '@/components/charts/TrendChart';
import FilterBar from '@/components/ui/FilterBar';
import RecentUsers from '@/components/ui/RecentUsers';
import { useAuthStore } from '@/lib/store';
import { dashboardAPI } from '@/lib/api';
import {
  Users,
  GraduationCap,
  UserCheck,
  Bell,
  BookOpen,
  Play,
  FileText,
  MoreHorizontal,
  Calendar,
  Clock,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';

interface DashboardData {
  overview: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    roleDistribution: Record<string, number>;
  };
  trends: {
    period: { start: string; end: string };
    userGrowth: Array<{ date: string; count: number }>;
  };
  recentUsers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string;
    createdAt: string;
    lastLogin?: string;
  }>;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: '30days' as '7days' | '30days' | '90days' | 'custom',
    role: 'all' as 'admin' | 'manager' | 'user' | 'all',
    search: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getOverview(filters);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome, {user.firstName} {user.lastName}!
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Welcome back! We're here to support you on your learning journey. Dive into your classes and keep progressing towards your goals.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={itemVariants}>
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => {
              const defaultFilters = {
                dateRange: '30days' as const,
                role: 'all' as const,
                search: '',
                startDate: undefined,
                endDate: undefined,
              };
              setFilters(defaultFilters);
            }}
          />
        </motion.div>

        {/* Summary Metrics - Role-based Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Common metrics for all roles */}
          <motion.div variants={itemVariants}>
            <MetricCard
              title="Students"
              value={dashboardData?.overview.totalUsers || 0}
              icon={Users}
              iconColor="text-yellow-600"
              bgColor="bg-yellow-50"
            />
          </motion.div>
          
          {/* Admin & Manager Only: Teachers count */}
          {(user.role === 'admin' || user.role === 'manager') && (
            <motion.div variants={itemVariants}>
              <MetricCard
                title="Teachers"
                value={dashboardData?.overview.roleDistribution.manager || 0}
                icon={GraduationCap}
                iconColor="text-purple-600"
                bgColor="bg-purple-50"
              />
            </motion.div>
          )}
          
          {/* Admin Only: Employee count */}
          {user.role === 'admin' && (
            <motion.div variants={itemVariants}>
              <MetricCard
                title="Employee"
                value={dashboardData?.overview.roleDistribution.admin || 0}
                icon={UserCheck}
                iconColor="text-yellow-600"
                bgColor="bg-yellow-50"
              />
            </motion.div>
          )}
          
          {/* User Only: Progress */}
          {user.role === 'user' && (
            <motion.div variants={itemVariants}>
              <MetricCard
                title="Course Progress"
                value="68%"
                icon={BookOpen}
                iconColor="text-blue-600"
                bgColor="bg-blue-50"
              />
            </motion.div>
          )}
          
          {/* Common for all roles */}
          <motion.div variants={itemVariants}>
            <MetricCard
              title="Active Users"
              value={dashboardData?.overview.activeUsers || 0}
              icon={Users}
              iconColor="text-green-600"
              bgColor="bg-green-50"
            />
          </motion.div>
          
          {/* Manager Only: Attendance */}
          {user.role === 'manager' && (
            <motion.div variants={itemVariants}>
              <MetricCard
                title="Attendance Rate"
                value="92%"
                icon={UserCheck}
                iconColor="text-indigo-600"
                bgColor="bg-indigo-50"
                trend={{ value: 3.2, isPositive: true, period: "vs last month" }}
              />
            </motion.div>
          )}
          
          {/* User Only: Assignments */}
          {user.role === 'user' && (
            <motion.div variants={itemVariants}>
              <MetricCard
                title="Pending Assignments"
                value="3"
                icon={FileText}
                iconColor="text-orange-600"
                bgColor="bg-orange-50"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Students Distribution */}
            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray="53, 100"
                        strokeDashoffset="0"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">53%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">3,178 (boys)</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="47, 100"
                        strokeDashoffset="53"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">47%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">2,731 (Girls)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notice Board */}
            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Notice Board</h3>
                <div className="flex items-center gap-2">
                  <a href="#" className="text-sm text-smansys-secondary hover:underline">view all</a>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Sports Day Announcement</h4>
                    <p className="text-sm text-gray-600">
                      The school's Annual Sports Day will be held on May 12, 2024. Mark your calendars!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Bell className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Summer Break Start Date</h4>
                    <p className="text-sm text-gray-600">
                      Summer break begins on May 25, 2024. Have a wonderful holiday!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </motion.div>

            {/* Financial Overview */}
            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
                <div className="flex items-center gap-2">
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>2023-2024</option>
                  </select>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>Annual</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-4 bg-blue-200 rounded"></div>
                    <span className="text-xs text-blue-600">↑12%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">₹29,545,000</div>
                  <div className="text-sm text-gray-600">Total Income</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-4 bg-purple-200 rounded"></div>
                    <span className="text-xs text-purple-600">↑0.5%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">₹19,291,266</div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Users */}
            <motion.div variants={itemVariants}>
              <RecentUsers
                users={dashboardData?.recentUsers || []}
                loading={loading}
              />
            </motion.div>

            {/* Calendar */}
            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">September 2021</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-xs">
                {['SAN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                  <div key={day} className="text-center py-2 text-gray-500 font-medium">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i + 1;
                  const isCurrentDay = day === 19;
                  return (
                    <div
                      key={day}
                      className={`text-center py-2 text-sm ${
                        isCurrentDay
                          ? 'bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              
              <button className="w-full mt-4 btn-secondary">
                Manage Calendar
              </button>
            </motion.div>

            {/* Daily Schedule */}
            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Daily Schedule</h3>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">Monday</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {[
                  'Tamil', 'English', 'Break', 'Math', 'Science', 
                  'Lunch', 'Social', 'CS', 'Break', 'Tamil', 'English'
                ].map((subject, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg text-sm ${
                      subject === 'Break' || subject === 'Lunch'
                        ? 'text-gray-500 bg-gray-50'
                        : 'text-gray-700 bg-white border border-gray-200'
                    }`}
                  >
                    {subject}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Messages */}
            <motion.div
              variants={itemVariants}
              className="metric-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Jane Cooper', message: "Don't forget the lab rep....", time: '12:34 pm' },
                  { name: 'Kristin Watson', message: 'Do we have maths test....', time: '12:34 pm' },
                  { name: 'Jenny Wilson', message: 'Wud?', time: '12:34 pm' },
                  { name: 'Brooklyn Sim', message: 'Did Sachin gave any ki...', time: '12:34 pm' },
                  { name: 'Darrell Steward', message: 'Can we go for a movie..', time: '12:34 pm' },
                ].map((msg, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {msg.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {msg.name}
                        </span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <EarningsChart />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <UserGrowthChart data={dashboardData?.trends.userGrowth} />
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
} 