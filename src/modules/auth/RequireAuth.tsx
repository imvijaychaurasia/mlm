import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useAuthStore } from '../../core/state/auth.store';
import { ROUTES } from '../../core/config/app.config';

interface RequireAuthProps {
  requireEmailVerified?: boolean;
  requirePhoneVerified?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  requireEmailVerified = false,
  requirePhoneVerified = false,
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requireEmailVerified && !user?.isVerified) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Email Verification Required
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please verify your email address to access this feature.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Alert>
      </Box>
    );
  }

  if (requirePhoneVerified && !user?.phone) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Phone Verification Required
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please verify your phone number to post listings or requirements.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.hash = ROUTES.VERIFY}
          >
            Verify Phone
          </Button>
        </Alert>
      </Box>
    );
  }

  return <Outlet />;
};