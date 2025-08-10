import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Alert, Box, Typography } from '@mui/material';
import { useAuthStore } from '../../core/state/auth.store';
import { useIntegrationsStore } from '../../core/state/integrations.store';
import { ROUTES } from '../../core/config/app.config';
import { isMockMode } from '../../core/config/env';

export const RequireAdmin: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const { config } = useIntegrationsStore();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check admin status from user role or mock admin toggle
  const isAdmin = user?.role === 'admin' || 
                  (isMockMode() && user?.email === 'admin@meramarket.com') ||
                  config.mockAdmin;

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body2">
            You don't have permission to access the admin panel.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return <Outlet />;
};