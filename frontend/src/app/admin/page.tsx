'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  MapPin, 
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
}

const mockMetrics: MetricCard[] = [
  {
    title: 'Total Revenue',
    value: 'Rp 45,231,890',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'New Customers',
    value: '2,350',
    change: '+180.1%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Active Booth',
    value: '12',
    change: '+19%',
    trend: 'up',
    icon: MapPin,
  },
  {
    title: 'Growth Rate',
    value: '573.1%',
    change: '+201',
    trend: 'up',
    icon: TrendingUp,
  },
];

const timeFilters = [
  { label: 'Last 3 months', value: '3months' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 7 days', value: '7days' },
];

export default function AdminDashboard() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('30days');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(today.toLocaleDateString('id-ID', options));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hello, Osmin! 😊</h1>
          <p className="text-gray-600 mt-1">{currentDate}</p>
        </div>
        
        {/* Time Filter */}
        <div className="flex mt-4 sm:mt-0 bg-gray-100 rounded-lg p-1">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedTimeFilter(filter.value)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${selectedTimeFilter === filter.value
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className={`
                  flex items-center text-sm font-medium
                  ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}
                `}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Visitors Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Visitors</h3>
              <p className="text-sm text-gray-600">Monthly visitor analytics</p>
            </div>
            <div className="flex items-center text-sm text-green-600 font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +12.5%
            </div>
          </div>
          
          {/* Placeholder Chart */}
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-600 font-medium">Visitor Trend Chart</p>
              <p className="text-sm text-gray-500 mt-1">Chart visualization will be here</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
          
          <div className="space-y-4">
            {[
              { action: 'New booth added', location: 'Mall Kota Kasablanka', time: '2 hours ago', type: 'success' },
              { action: 'Payment completed', location: 'Booth #001', time: '4 hours ago', type: 'info' },
              { action: 'Frame updated', location: 'Wedding Collection', time: '6 hours ago', type: 'warning' },
              { action: 'User registered', location: 'Mobile App', time: '8 hours ago', type: 'success' },
              { action: 'Maintenance scheduled', location: 'Booth #003', time: '1 day ago', type: 'error' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className={`
                  w-3 h-3 rounded-full
                  ${activity.type === 'success' ? 'bg-green-500' : ''}
                  ${activity.type === 'info' ? 'bg-blue-500' : ''}
                  ${activity.type === 'warning' ? 'bg-yellow-500' : ''}
                  ${activity.type === 'error' ? 'bg-red-500' : ''}
                `} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">98.5%</div>
            <div className="text-sm text-gray-600 mt-1">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">4.8/5</div>
            <div className="text-sm text-gray-600 mt-1">Customer Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">15.2k</div>
            <div className="text-sm text-gray-600 mt-1">Photos Taken</div>
          </div>
        </div>
      </div>
    </div>
  );
}