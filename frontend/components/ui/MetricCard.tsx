'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period?: string;
  };
  className?: string;
  onClick?: () => void;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  bgColor = 'bg-blue-50',
  trend,
  className = '',
  onClick,
}: MetricCardProps) {
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { y: -5, scale: 1.02 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`metric-card cursor-pointer transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {Icon && (
              <div className={`p-2 rounded-lg ${bgColor}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-sm">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                  {trend.value}%
                </span>
                {trend.period && (
                  <span className="text-gray-500 text-xs ml-1">
                    {trend.period}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {value}
          </h3>
          
          <p className="text-sm text-gray-600 font-medium">
            {title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Specialized metric card variants
export function AttendanceCard({ attendance, className = '' }: { attendance: number; className?: string }) {
  return (
    <MetricCard
      title="Attendance"
      value={`${attendance}%`}
      icon={Users}
      iconColor="text-blue-600"
      bgColor="bg-blue-50"
      className={className}
    />
  );
}

export function TaskCard({ completed, total, className = '' }: { completed: number; total: number; className?: string }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <MetricCard
      title="Task Completed"
      value={`${completed}+`}
      icon={CheckCircle}
      iconColor="text-purple-600"
      bgColor="bg-purple-50"
      trend={{ value: percentage, isPositive: percentage > 50 }}
      className={className}
    />
  );
}

export function ProgressCard({ progress, className = '' }: { progress: number; className?: string }) {
  return (
    <MetricCard
      title="Task in Progress"
      value={`${progress}%`}
      icon={Loader}
      iconColor="text-yellow-600"
      bgColor="bg-yellow-50"
      className={className}
    />
  );
}

export function RewardCard({ points, className = '' }: { points: number; className?: string }) {
  return (
    <MetricCard
      title="Reward Points"
      value={points.toString()}
      icon={Award}
      iconColor="text-pink-600"
      bgColor="bg-pink-50"
      className={className}
    />
  );
}

// Import icons for specialized cards
import { Users, CheckCircle, Loader, Award } from 'lucide-react'; 