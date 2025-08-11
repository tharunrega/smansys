'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Settings, Shield, Bell, Palette, Database, Users } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your application preferences and system settings</p>
          </div>
        </motion.div>

        {/* Settings Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Account Settings */}
          <div className="metric-card cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Account</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Manage your account settings, profile information, and preferences
            </p>
          </div>

          {/* Security Settings */}
          <div className="metric-card cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Configure security settings, passwords, and authentication methods
            </p>
          </div>

          {/* Notifications */}
          <div className="metric-card cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Customize notification preferences and alert settings
            </p>
          </div>

          {/* Appearance */}
          <div className="metric-card cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Customize themes, colors, and visual preferences
            </p>
          </div>

          {/* Data Management */}
          <div className="metric-card cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Database className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Data</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Manage data export, import, and backup settings
            </p>
          </div>

          {/* System Settings */}
          <div className="metric-card cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">System</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Configure system-wide settings and preferences
            </p>
          </div>
        </motion.div>

        {/* Content Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-8 text-center"
        >
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Management</h3>
          <p className="text-gray-500 mb-6">
            This page will contain the complete settings interface for managing application preferences, user permissions, and system configuration.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">Settings Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">Pending Changes</div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
} 