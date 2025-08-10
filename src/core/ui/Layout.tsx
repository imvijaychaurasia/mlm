import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel,
  Chip,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  ShoppingBag,
  ListAlt,
  Person,
  Login,
  PersonAdd,
  AdminPanelSettings,
  Settings,
  Logout,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../state/auth.store';
import { useIntegrationsStore } from '../state/integrations.store';
import { getAuthAdapter } from '../../adapters/registry';
import { ROUTES } from '../config/app.config';
import { isMockMode } from '../config/env';

interface LayoutProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const drawerWidth = 240;

export const Layout: React.FC<LayoutProps> = ({ isDarkMode, setIsDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isAuthenticated, setUser, setToken, logout } = useAuthStore();
  const { config } = useIntegrationsStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  
  const isAdmin = user?.role === 'admin' || 
                  (isMockMode() && user?.email === 'admin@meramarket.com') ||
                  config.mockAdmin;

  useEffect(() => {
    // Load current user on app start
    const loadUser = async () => {
      try {
        const authAdapter = getAuthAdapter();
        const currentUser = await authAdapter.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setToken('mock_token'); // In real app, get from localStorage
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
  }, [setUser, setToken]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const authAdapter = getAuthAdapter();
      await authAdapter.logout();
      logout();
      handleMenuClose();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: ROUTES.HOME },
    { text: 'Listings', icon: <ShoppingBag />, path: ROUTES.LISTINGS },
    { text: 'Requirements', icon: <ListAlt />, path: ROUTES.REQUIREMENTS },
  ];

  if (isAuthenticated) {
    menuItems.push({ text: 'Profile', icon: <Person />, path: ROUTES.PROFILE });
    if (isAdmin) {
      menuItems.push({ text: 'Admin', icon: <AdminPanelSettings />, path: ROUTES.ADMIN });
    }
  }

  const isActive = (path: string) => location.pathname === path;

  const drawerWidth = 240;
  
  // Update bottom nav value based on current route
  useEffect(() => {
    switch (location.pathname) {
      case ROUTES.HOME:
        setBottomNavValue(0);
        break;
      case ROUTES.LISTINGS:
        setBottomNavValue(1);
        break;
      case ROUTES.REQUIREMENTS:
        setBottomNavValue(2);
        break;
      case ROUTES.PROFILE:
        setBottomNavValue(3);
        break;
      default:
        setBottomNavValue(0);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mock Mode Indicator */}
      {isMockMode() && (
        <Chip
          label="Mock Mode"
          color="warning"
          size="small"
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999,
          }}
        />
      )}

      <AppBar 
        position="fixed"
        elevation={2}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: theme.spacing(2) }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/assets/mlm-logo.png"
              alt="Mera Local Market"
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                borderRadius: '10px',
                boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
              }}
              onClick={() => navigate(ROUTES.HOME)}
            />
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
            onClick={() => navigate(ROUTES.HOME)}
          >
            {isMobile ? 'MLM' : 'Mera Local Market'}
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  variant={isActive(item.path) ? 'outlined' : 'text'}
                  sx={{
                    borderColor: isActive(item.path) ? 'rgba(255,255,255,0.5)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: theme.spacing(2), display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                  icon={<LightMode />}
                  checkedIcon={<DarkMode />}
                />
              }
              label=""
            />
            
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
                  <Avatar 
                    src={user?.avatar} 
                    alt={user?.name}
                    sx={{ width: 36, height: 36 }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => { navigate(ROUTES.PROFILE); handleMenuClose(); }}>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    Profile
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem onClick={() => { navigate(ROUTES.INTEGRATIONS); handleMenuClose(); }}>
                      <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                      Integrations
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: theme.spacing(1) }}>
                <Button 
                  color="inherit" 
                  startIcon={<Login />}
                  onClick={() => navigate(ROUTES.LOGIN)}
                  variant={isActive(ROUTES.LOGIN) ? 'outlined' : 'text'}
                >
                  Login
                </Button>
                <Button 
                  color="inherit"
                  startIcon={<PersonAdd />}
                  onClick={() => navigate(ROUTES.SIGNUP)}
                  variant={isActive(ROUTES.SIGNUP) ? 'outlined' : 'text'}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setDrawerOpen(false);
                }}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: 'initial',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                selected={isActive(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${drawerWidth}px`, xs: 0 },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          mt: 8, // Account for AppBar height
          pb: { xs: 7, md: 0 }, // Add padding for bottom nav on mobile
        }}
      >
        <Outlet />
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: theme.zIndex.appBar 
          }} 
          elevation={3}
        >
          <BottomNavigation
            value={bottomNavValue}
            onChange={(event, newValue) => {
              setBottomNavValue(newValue);
              const routes = [ROUTES.HOME, ROUTES.LISTINGS, ROUTES.REQUIREMENTS, ROUTES.PROFILE];
              navigate(routes[newValue]);
            }}
            showLabels
          >
            <BottomNavigationAction label="Home" icon={<Home />} />
            <BottomNavigationAction label="Listings" icon={<ShoppingBag />} />
            <BottomNavigationAction label="Requirements" icon={<ListAlt />} />
            <BottomNavigationAction label="Profile" icon={<Person />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};