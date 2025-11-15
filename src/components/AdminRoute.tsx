import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminApi } from '@/services/api/adminApi';
import { useAuth } from '@/lib/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Wait for auth to finish loading
      if (loading) {
        return;
      }

      // If no user is logged in, deny access
      if (!user) {
        setIsAuthorized(false);
        return;
      }

      try {
        await adminApi.checkAdminAccess();
        setIsAuthorized(true);
      } catch (error) {
        console.error('Admin access denied:', error);
        setIsAuthorized(false);
      }
    };

    checkAdminAccess();
  }, [user, loading]);

  if (isAuthorized === null) {
    // Loading state - you can replace this with a proper loading component
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verifying admin access...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
