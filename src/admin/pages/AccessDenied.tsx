import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Access Denied</CardTitle>
          <CardDescription className="text-center">
            You don't have permission to access this resource
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            If you believe this is an error, please contact your administrator.
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate('/admin/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
