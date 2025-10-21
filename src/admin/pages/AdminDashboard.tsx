import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, Package, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAdminAuth();

  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Orders',
      value: '1,429',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Products',
      value: '156',
      change: '+3.1%',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Revenue',
      value: '₹1,24,350',
      change: '+15.3%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.fullName}! Here's what's happening with your store.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Your admin panel is now ready. Here are some features you can explore:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>User Management - View and manage customer accounts</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Order Management - Track and update order statuses</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Product Management - Add, edit, and manage inventory</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Analytics - View sales trends and performance metrics</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
