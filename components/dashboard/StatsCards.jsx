import { 
  Send, 
  Users, 
  TrendingUp, 
  Star 
} from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Requests Sent',
      value: stats.totalRequests,
      subtitle: `${stats.sentThisMonth} this month`,
      icon: Send,
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      subtitle: 'In your database',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Monthly Usage',
      value: `${stats.sentThisMonth}/${stats.limit}`,
      subtitle: `${stats.plan.toUpperCase()} plan`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Plan',
      value: stats.plan.toUpperCase(),
      subtitle: stats.plan === 'free' 
        ? 'Upgrade for more' 
        : 'Active subscription',
      icon: Star,
      gradient: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${card.bg} mb-3`}>
              <Icon size={20} className={card.iconColor} />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {card.value}
            </p>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              {card.title}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}