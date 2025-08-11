'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, MoreHorizontal, Clock, User } from 'lucide-react';
import { formatRelativeTime, getRoleColorClasses, getRoleDisplayName } from '@/lib/utils';

interface RecentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

interface RecentUsersProps {
  users: RecentUser[];
  loading?: boolean;
}



export default function RecentUsers({ users, loading = false }: RecentUsersProps) {
  if (loading) {
    return (
      <div className="metric-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="metric-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No recent users found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="metric-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.firstName.charAt(0)}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </h4>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColorClasses(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="truncate">{user.email}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                                          <span>{formatRelativeTime(user.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Last Login */}
            {user.lastLogin && (
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-gray-500 mb-1">Last Login</div>
                                  <div className="text-xs text-gray-700">
                    {formatRelativeTime(user.lastLogin)}
                  </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full btn-secondary text-sm">
          <Users className="w-4 h-4 mr-2" />
          View All Users
        </button>
      </div>
    </motion.div>
  );
} 