import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Chip } from '@mui/material';
import { Layout } from '../ui/Layout';
import { AdminLayout } from '../ui/AdminLayout';
import { RequireAuth } from '../../modules/auth/RequireAuth';
import { RequireAdmin } from '../../modules/auth/RequireAdmin';
import { ROUTES } from '../config/app.config';
import { isMockMode } from '../config/env';

interface AppRouterProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

// Lazy load components
const Home = React.lazy(() => import('../../modules/home/pages/HomePage'));
const Login = React.lazy(() => import('../../modules/auth/pages/LoginPage'));
const Signup = React.lazy(() => import('../../modules/auth/pages/SignupPage'));
const Verify = React.lazy(() => import('../../modules/auth/pages/VerifyPage'));
const Listings = React.lazy(() => import('../../modules/listings/pages/ListingsPage'));
const ListingDetail = React.lazy(() => import('../../modules/listings/pages/ListingDetailPage'));
const CreateListing = React.lazy(() => import('../../modules/listings/pages/CreateListingPage'));
const Requirements = React.lazy(() => import('../../modules/requirements/pages/RequirementsPage'));
const Profile = React.lazy(() => import('../../modules/profile/pages/ProfilePage'));
const Admin = React.lazy(() => import('../../modules/admin/pages/AdminDashboard'));
const Integrations = React.lazy(() => import('../../modules/integrations/pages/IntegrationsPage'));
const NotFound = React.lazy(() => import('../../pages/NotFound'));

const LoadingFallback = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="400px"
  >
    <CircularProgress />
  </Box>
);

export const AppRouter: React.FC<AppRouterProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Admin Routes - Must come first */}
          <Route element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route path={ROUTES.ADMIN} element={<Admin />} />
              <Route path="/admin/users" element={<Admin />} />
              <Route path="/admin/listings" element={<Admin />} />
              <Route path="/admin/requirements" element={<Admin />} />
              <Route path={ROUTES.INTEGRATIONS} element={<Integrations />} />
            </Route>
          </Route>
          
          {/* Main App Routes */}
          <Route element={<Layout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}>
            {/* Auth Routes */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.VERIFY} element={<Verify />} />
            
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LISTINGS} element={<Listings />} />
            <Route path={ROUTES.LISTING_DETAIL} element={<ListingDetail />} />
            <Route path={ROUTES.REQUIREMENTS} element={<Requirements />} />
            
            {/* Protected Routes */}
            <Route element={<RequireAuth requireEmailVerified requirePhoneVerified />}>
              <Route path={ROUTES.CREATE_LISTING} element={<CreateListing />} />
              <Route path={ROUTES.CREATE_REQUIREMENT} element={<Requirements />} />
            </Route>
            
            <Route element={<RequireAuth />}>
              <Route path={ROUTES.PROFILE} element={<Profile />} />
            </Route>
            
            {/* Catch-all routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
};