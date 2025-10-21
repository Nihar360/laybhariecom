import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Mail,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  permission?: string;
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    permission: 'users:read',
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    permission: 'orders:read',
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    permission: 'products:read',
  },
  {
    title: 'Coupons',
    href: '/admin/coupons',
    icon: Tag,
    permission: 'coupons:read',
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: 'analytics:read',
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
    permission: 'notifications:read',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminLayout() {
  const { user, logout, hasPermission } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredNavigation = navigation.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-lg font-bold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Spice House</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-primary-foreground' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center w-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{user ? getInitials(user.fullName) : 'AD'}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-950">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-lg font-bold">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">Spice House</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon className={`mr-3 h-5 w-5`} />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {navigation.find((item) => item.href === location.pathname)?.title || 'Admin Panel'}
              </h2>
            </div>

            <div className="ml-4 flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">New order received</p>
                      <p className="text-xs text-muted-foreground">Order #12345 - 5 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Low stock alert</p>
                      <p className="text-xs text-muted-foreground">Turmeric Powder - 10 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user ? getInitials(user.fullName) : 'AD'}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block text-sm">{user?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
