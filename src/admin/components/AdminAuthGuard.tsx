import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
}

export default function AdminAuthGuard({
  children,
  requiredPermission,
  requiredPermissions,
}: AdminAuthGuardProps) {
  const { isAuthenticated, isLoading, hasPermission, hasAnyPermission, user } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  return <>{children}</>;
}
