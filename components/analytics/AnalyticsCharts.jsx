'use client';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// npm install recharts

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];

export default function AnalyticsCharts({ 
  requestsByDay, 
  statusBreakdown 
}) {

  const lineData = requestsByDay.map(item => ({
    date: item._id.slice(5), // Show MM-DD only
    requests: item.count
  }));

  const pieData = statusBreakdown.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Line Chart - Requests over time */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Review Requests (Last 30 Days)
        </h2>
        
        {lineData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400">
            No data yet. Send your first review request!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart - Status breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Status Breakdown
        </h2>
        
        {pieData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm text-center">
            Send review requests to see breakdown
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Legend 
                formatter={(value) => (
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {value}
                  </span>
                )}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}