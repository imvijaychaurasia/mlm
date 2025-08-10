import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  CloudSync,
  Payment,
  Security,
  Notifications,
  Storage,
  Analytics,
  Check,
  Settings,
  Warning,
  Info,
  CheckCircle,
  Error as ErrorIcon,
  LocationOn,
  MyLocation,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/config/app.config';
import { getSelectedProvider, setSelectedProvider, AdapterType } from '../../../adapters/registry';
import { validateEnvironment, isMockMode, ProviderValidation } from '../../../core/config/env';
import { useIntegrationsStore } from '../../../core/state/integrations.store';
import { useGeoLocation } from '../../../core/hooks/useGeoLocation';

interface Integration {
  id: string;
  name: string;
  category: 'auth' | 'payments' | 'notifications' | 'storage' | 'analytics' | 'geo';
  provider: string;
  status: 'active' | 'inactive' | 'configured' | 'error';
  description: string;
  features: string[];
  isActive: boolean;
  isMock: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`integration-tabpanel-${index}`}
      aria-labelledby={`integration-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [configDialog, setConfigDialog] = useState<{ open: boolean; integration?: Integration }>({
    open: false,
  });
  const [envValidation, setEnvValidation] = useState(validateEnvironment());
  const [razorpayDialog, setRazorpayDialog] = useState(false);
  const [firebaseDialog, setFirebaseDialog] = useState(false);
  const [geoTestDialog, setGeoTestDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const { config, updateFirebaseConfig, updateRazorpayConfig, updateGeoProvider, toggleMockAdmin, loadConfig } = useIntegrationsStore();
  const { location, loading: geoLoading, error: geoError, getCurrentLocation, getGeohash, getQueryBounds } = useGeoLocation();

  const [razorpayForm, setRazorpayForm] = useState({
    keyId: '',
    webhookUrl: '',
    returnUrl: '',
  });

  const [firebaseForm, setFirebaseForm] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  useEffect(() => {
    loadConfig();
    setEnvValidation(validateEnvironment());
  }, [loadConfig]);

  useEffect(() => {
    setRazorpayForm({
      keyId: config.razorpay.keyId || envValidation.config.razorpay.keyId || '',
      webhookUrl: config.razorpay.webhookUrl,
      returnUrl: config.razorpay.returnUrl,
    });

    setFirebaseForm({
      apiKey: config.firebase.apiKey || envValidation.config.firebase.apiKey || '',
      authDomain: config.firebase.authDomain || envValidation.config.firebase.authDomain || '',
      projectId: config.firebase.projectId || envValidation.config.firebase.projectId || '',
      storageBucket: config.firebase.storageBucket || envValidation.config.firebase.storageBucket || '',
      messagingSenderId: config.firebase.messagingSenderId || envValidation.config.firebase.messagingSenderId || '',
      appId: config.firebase.appId || envValidation.config.firebase.appId || '',
    });
  }, [config, envValidation]);

  // Mock integrations data
  const integrations: Integration[] = [
    {
      id: 'auth-mock',
      name: 'Mock Authentication',
      category: 'auth',
      provider: 'Mock',
      status: 'active',
      description: 'Mock authentication service for development and testing',
      features: ['Email/Password Login', 'Google OAuth Simulation', 'Phone OTP Verification', 'User Management'],
      isActive: getSelectedProvider('auth') === 'mock',
      isMock: true,
    },
    {
      id: 'auth-firebase',
      name: 'Firebase Authentication',
      category: 'auth',
      provider: 'Firebase',
      status: getSelectedProvider('auth') === 'firebase' ? 'active' : 'inactive',
      description: 'Secure authentication with Firebase Auth',
      features: ['Email/Password Login', 'Google OAuth', 'Phone OTP', 'Multi-factor Authentication'],
      isActive: getSelectedProvider('auth') === 'firebase',
      isMock: false,
    },
    {
      id: 'payments-mock',
      name: 'Mock Payment Gateway',
      category: 'payments',
      provider: 'Mock',
      status: 'active',
      description: 'Simulated payment processing for development',
      features: ['Payment Simulation', 'Refund Processing', 'Transaction History', 'Webhook Testing'],
      isActive: getSelectedProvider('payments') === 'mock',
      isMock: true,
    },
    {
      id: 'payments-razorpay',
      name: 'Razorpay',
      category: 'payments',
      provider: 'Razorpay',
      status: getSelectedProvider('payments') === 'razorpay' ? 'active' : 'inactive',
      description: 'Complete payment solution for Indian businesses',
      features: ['Cards', 'UPI', 'Net Banking', 'Wallets', 'EMI', 'International Payments'],
      isActive: getSelectedProvider('payments') === 'razorpay',
      isMock: false,
    },
    {
      id: 'geo-mock',
      name: 'Mock Geo Location',
      category: 'geo',
      provider: 'Mock',
      status: 'active',
      description: 'Simulated geolocation services',
      features: ['Location Simulation', 'Distance Calculation', 'Geohash Generation', 'Bounds Queries'],
      isActive: config.geo.provider === 'mock',
      isMock: true,
    },
    {
      id: 'geo-geofire',
      name: 'Geofire (Firestore)',
      category: 'geo',
      provider: 'Geofire',
      status: config.geo.provider === 'geofire' ? 'active' : 'inactive',
      description: 'Real-time geolocation queries with Firestore',
      features: ['Real-time Location Queries', 'Geohash Indexing', 'Radius Searches', 'Location Updates'],
      isActive: config.geo.provider === 'geofire',
      isMock: false,
    },
    {
      id: 'notifications-mock',
      name: 'Mock Notifications',
      category: 'notifications',
      provider: 'Mock',
      status: 'active',
      description: 'Simulated notification service',
      features: ['SMS Simulation', 'Email Simulation', 'Push Notifications', 'Event Tracking'],
      isActive: true,
      isMock: true,
    },
    {
      id: 'storage-mock',
      name: 'Mock Storage',
      category: 'storage',
      provider: 'Mock',
      status: 'active',
      description: 'Simulated file storage service',
      features: ['Image Upload Simulation', 'File Management', 'CDN Simulation'],
      isActive: true,
      isMock: true,
    },
    {
      id: 'analytics-mock',
      name: 'Mock Analytics',
      category: 'analytics',
      provider: 'Mock',
      status: 'active',
      description: 'Simulated analytics and tracking',
      features: ['User Tracking', 'Event Analytics', 'Performance Metrics', 'Custom Reports'],
      isActive: true,
      isMock: true,
    },
  ];

  const categories = [
    { id: 'all', label: 'All', icon: <CloudSync /> },
    { id: 'auth', label: 'Authentication', icon: <Security /> },
    { id: 'payments', label: 'Payments', icon: <Payment /> },
    { id: 'geo', label: 'Geo Location', icon: <LocationOn /> },
    { id: 'notifications', label: 'Notifications', icon: <Notifications /> },
    { id: 'storage', label: 'Storage', icon: <Storage /> },
    { id: 'analytics', label: 'Analytics', icon: <Analytics /> },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleIntegration = (integration: Integration) => {
    setConfigDialog({ open: true, integration });
  };

  const handleProviderChange = (category: AdapterType, provider: string) => {
    setSelectedProvider(category, provider);
    setEnvValidation(validateEnvironment());
    setSnackbar({
      open: true,
      message: `${category} provider switched to ${provider}`,
      severity: 'success',
    });
  };

  const handleGeoProviderChange = (provider: 'none' | 'mock' | 'geofire' | 'google') => {
    updateGeoProvider(provider);
    setEnvValidation(validateEnvironment());
    setSnackbar({
      open: true,
      message: `Geo provider switched to ${provider}`,
      severity: 'success',
    });
  };

  const handleRazorpayConfig = () => {
    setRazorpayDialog(true);
  };

  const handleFirebaseConfig = () => {
    setFirebaseDialog(true);
  };

  const handleSaveRazorpayConfig = () => {
    updateRazorpayConfig(razorpayForm);
    setRazorpayDialog(false);
    setEnvValidation(validateEnvironment());
    setSnackbar({
      open: true,
      message: 'Razorpay configuration saved',
      severity: 'success',
    });
  };

  const handleSaveFirebaseConfig = () => {
    updateFirebaseConfig(firebaseForm);
    setFirebaseDialog(false);
    setEnvValidation(validateEnvironment());
    setSnackbar({
      open: true,
      message: 'Firebase configuration saved',
      severity: 'success',
    });
  };

  const handleGeoTest = async () => {
    try {
      await getCurrentLocation();
      setGeoTestDialog(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Geolocation failed: ${error}`,
        severity: 'error',
      });
    }
  };

  const handleCloseDialog = () => {
    setConfigDialog({ open: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'configured': return 'info';
      case 'error': return 'error';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return <Security />;
      case 'payments': return <Payment />;
      case 'geo': return <LocationOn />;
      case 'notifications': return <Notifications />;
      case 'storage': return <Storage />;
      case 'analytics': return <Analytics />;
      default: return <CloudSync />;
    }
  };

  const getProviderValidation = (providerName: string): ProviderValidation | undefined => {
    return envValidation.providers.find(p => p.name === providerName);
  };

  const getMissingKeysForProvider = (category: AdapterType): string[] => {
    const selectedProvider = getSelectedProvider(category);
    if (selectedProvider === 'mock') return [];
    
    const validation = getProviderValidation(
      category === 'auth' ? 'Firebase' : 
      category === 'payments' ? 'Razorpay' : 
      category === 'data' ? 'Firebase' : 
      category === 'storage' ? 'Firebase' : ''
    );
    
    return validation?.keys.filter(k => !k.present).map(k => k.key) || [];
  };

  const getFilteredIntegrations = () => {
    if (tabValue === 0) return integrations;
    const categoryId = categories[tabValue].id;
    return integrations.filter(integration => integration.category === categoryId);
  };

  const getMissingProviders = (): string[] => {
    const missing: string[] = [];
    
    (['auth', 'payments', 'data', 'storage'] as AdapterType[]).forEach(category => {
      const selected = getSelectedProvider(category);
      const missingKeys = getMissingKeysForProvider(category);
      if (selected !== 'mock' && missingKeys.length > 0) {
        const providerName = category === 'auth' ? 'Firebase Auth' :
                            category === 'payments' ? 'Razorpay' :
                            category === 'data' ? 'Firestore' :
                            category === 'storage' ? 'Firebase Storage' : category;
        missing.push(providerName);
      }
    });
    
    return missing;
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Integrations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your service providers and API integrations
          </Typography>
        </div>
        <Button
          variant="outlined"
          onClick={() => navigate(ROUTES.ADMIN)}
        >
          Back to Admin
        </Button>
      </Box>

      {/* Info Alert */}

      {/* Missing Environment Variables Warning */}
      {getMissingProviders().length > 0 && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Mock Mode enforced: missing env vars for {getMissingProviders().join(', ')}
          </Typography>
          <Typography variant="body2">
            Some providers have missing environment variables and are falling back to Mock mode.
          </Typography>
        </Alert>
      )}

      {/* Environment Status */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Environment Status
        </Typography>
        <Grid container spacing={3}>
          {envValidation.providers.map((provider) => (
            <Grid item xs={12} sm={6} md={4} key={provider.name}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {provider.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={provider.isValid ? 'Complete' : 'Incomplete'}
                      color={provider.isValid ? 'success' : 'error'}
                    />
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Environment Variable</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {provider.keys.map((keyInfo) => (
                          <TableRow key={keyInfo.key}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {keyInfo.key}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {keyInfo.present ? (
                                <CheckCircle color="success" fontSize="small" />
                              ) : (
                                <ErrorIcon color="error" fontSize="small" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Provider Selection */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Active Providers
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Authentication</InputLabel>
              <Select
                value={getSelectedProvider('auth')}
                label="Authentication"
                onChange={(e) => handleProviderChange('auth', e.target.value)}
              >
                <MenuItem value="mock">Mock</MenuItem>
                <MenuItem value="firebase" disabled={!envValidation.config.firebase.apiKey}>
                  Firebase {!envValidation.config.firebase.apiKey && '(Config Missing)'}
                </MenuItem>
              </Select>
            </FormControl>
            {getMissingKeysForProvider('auth').length > 0 && getSelectedProvider('auth') !== 'mock' && (
              <Chip size="small" label="Using Mock (missing env)" color="warning" sx={{ mt: 1 }} />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Data Storage</InputLabel>
              <Select
                value={getSelectedProvider('data')}
                label="Data Storage"
                onChange={(e) => handleProviderChange('data', e.target.value)}
              >
                <MenuItem value="mock">Mock</MenuItem>
                <MenuItem value="firestore" disabled={!envValidation.config.firebase.projectId}>
                  Firestore {!envValidation.config.firebase.projectId && '(Config Missing)'}
                </MenuItem>
              </Select>
            </FormControl>
            {getMissingKeysForProvider('data').length > 0 && getSelectedProvider('data') !== 'mock' && (
              <Chip size="small" label="Using Mock (missing env)" color="warning" sx={{ mt: 1 }} />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Payments</InputLabel>
              <Select
                value={getSelectedProvider('payments')}
                label="Payments"
                onChange={(e) => handleProviderChange('payments', e.target.value)}
              >
                <MenuItem value="mock">Mock</MenuItem>
                <MenuItem value="razorpay" disabled={!envValidation.config.razorpay.keyId && !config.razorpay.keyId}>
                  Razorpay {!envValidation.config.razorpay.keyId && !config.razorpay.keyId && '(Config Missing)'}
                </MenuItem>
              </Select>
            </FormControl>
            {getMissingKeysForProvider('payments').length > 0 && getSelectedProvider('payments') !== 'mock' && (
              <Chip size="small" label="Using Mock (missing env)" color="warning" sx={{ mt: 1 }} />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Geo Location</InputLabel>
              <Select
                value={config.geo.provider}
                label="Geo Location"
                onChange={(e) => handleGeoProviderChange(e.target.value as any)}
              >
                <MenuItem value="mock">Mock</MenuItem>
                <MenuItem value="geofire" disabled={!envValidation.config.firebase.projectId}>
                  Geofire {!envValidation.config.firebase.projectId && '(Firestore Required)'}
                </MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
            </FormControl>
            {config.geo.provider === 'geofire' && !envValidation.config.firebase.projectId && (
              <Chip size="small" label="Using Mock (missing env)" color="warning" sx={{ mt: 1 }} />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>File Storage</InputLabel>
              <Select
                value={getSelectedProvider('storage')}
                label="File Storage"
                onChange={(e) => handleProviderChange('storage', e.target.value)}
              >
                <MenuItem value="mock">Mock</MenuItem>
                <MenuItem value="firebase" disabled={!envValidation.config.firebase.storageBucket}>
                  Firebase Storage {!envValidation.config.firebase.storageBucket && '(Config Missing)'}
                </MenuItem>
              </Select>
            </FormControl>
            {getMissingKeysForProvider('storage').length > 0 && getSelectedProvider('storage') !== 'mock' && (
              <Chip size="small" label="Using Mock (missing env)" color="warning" sx={{ mt: 1 }} />
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Geo Test Widget */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Geo Location Test
          </Typography>
          <Button
            variant="contained"
            startIcon={geoLoading ? <CircularProgress size={16} /> : <MyLocation />}
            onClick={handleGeoTest}
            disabled={geoLoading}
          >
            {geoLoading ? 'Detecting...' : 'Detect Location'}
          </Button>
        </Box>
        {location && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label={`Lat: ${location.lat.toFixed(6)}`} variant="outlined" />
            <Chip label={`Lng: ${location.lng.toFixed(6)}`} variant="outlined" />
            <Chip label={`Geohash: ${getGeohash(location)}`} variant="outlined" />
            <Chip label={`5km bounds: ${getQueryBounds(location, 5).bounds.length} ranges`} variant="outlined" />
          </Box>
        )}
        {geoError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {geoError}
          </Alert>
        )}
      </Paper>

      {/* Tabs */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            aria-label="integration categories"
          >
            {categories.map((category, index) => (
              <Tab
                key={category.id}
                icon={category.icon}
                label={category.label}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={tabValue}>
          <Grid container spacing={3}>
            {getFilteredIntegrations().map((integration) => (
              <Grid item xs={12} sm={6} md={4} key={integration.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: integration.isActive ? 2 : 1,
                    borderColor: integration.isActive ? 'success.main' : 'divider',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getCategoryIcon(integration.category)}
                      <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', flexGrow: 1 }}>
                        {integration.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          size="small"
                          label={integration.status}
                          color={getStatusColor(integration.status) as any}
                        />
                        {integration.isMock && (
                          <Chip size="small" label="Mock" color="warning" variant="outlined" />
                        )}
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {integration.description}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Features:
                    </Typography>
                    <List dense>
                      {integration.features.slice(0, 4).map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Check color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ variant: 'body2' }} 
                          />
                        </ListItem>
                      ))}
                      {integration.features.length > 4 && (
                        <ListItem sx={{ py: 0.5, pl: 0 }}>
                          <ListItemText 
                            primary={`+${integration.features.length - 4} more features`}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>

                  <Divider />
                  
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={integration.isActive}
                          onChange={() => handleToggleIntegration(integration)}
                          color="success"
                        />
                      }
                      label={integration.isActive ? 'Active' : 'Inactive'}
                    />
                    <Button
                      size="small"
                      startIcon={<Settings />}
                      onClick={() => {
                        if (integration.category === 'payments' && integration.provider === 'Razorpay') {
                          handleRazorpayConfig();
                        } else if (integration.category === 'auth' && integration.provider === 'Firebase') {
                          handleFirebaseConfig();
                        } else {
                          setConfigDialog({ open: true, integration });
                        }
                      }}
                    >
                      Configure
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Mock Admin Toggle */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Demo Controls
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={config.mockAdmin}
              onChange={toggleMockAdmin}
              color="warning"
            />
          }
          label="Enable Mock Admin Access (Demo Only)"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Toggle admin access for the current user in demo mode
        </Typography>
      </Paper>

      {/* Firebase Configuration Dialog */}
      <Dialog 
        open={firebaseDialog} 
        onClose={() => setFirebaseDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Configure Firebase</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Demo Configuration
            </Typography>
            <Typography variant="body2">
              These values are stored locally for demo purposes. In production, use environment variables.
            </Typography>
          </Alert>

          <TextField
            fullWidth
            label="API Key"
            value={firebaseForm.apiKey}
            onChange={(e) => setFirebaseForm({ ...firebaseForm, apiKey: e.target.value })}
            margin="normal"
            helperText="Your Firebase Web API Key"
          />
          
          <TextField
            fullWidth
            label="Auth Domain"
            value={firebaseForm.authDomain}
            onChange={(e) => setFirebaseForm({ ...firebaseForm, authDomain: e.target.value })}
            margin="normal"
            placeholder="your-project.firebaseapp.com"
            helperText="Firebase Auth Domain"
          />

          <TextField
            fullWidth
            label="Project ID"
            value={firebaseForm.projectId}
            onChange={(e) => setFirebaseForm({ ...firebaseForm, projectId: e.target.value })}
            margin="normal"
            helperText="Firebase Project ID"
          />

          <TextField
            fullWidth
            label="Storage Bucket"
            value={firebaseForm.storageBucket}
            onChange={(e) => setFirebaseForm({ ...firebaseForm, storageBucket: e.target.value })}
            margin="normal"
            placeholder="your-project.appspot.com"
            helperText="Firebase Storage Bucket"
          />

          <TextField
            fullWidth
            label="Messaging Sender ID"
            value={firebaseForm.messagingSenderId}
            onChange={(e) => setFirebaseForm({ ...firebaseForm, messagingSenderId: e.target.value })}
            margin="normal"
            helperText="Firebase Cloud Messaging Sender ID"
          />

          <TextField
            fullWidth
            label="App ID"
            value={firebaseForm.appId}
            onChange={(e) => setFirebaseForm({ ...firebaseForm, appId: e.target.value })}
            margin="normal"
            helperText="Firebase App ID"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFirebaseDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleSaveFirebaseConfig}
          >
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Razorpay Configuration Dialog */}
      <Dialog 
        open={razorpayDialog} 
        onClose={() => setRazorpayDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Configure Razorpay</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Safe Client Configuration
            </Typography>
            <Typography variant="body2">
              Only client-safe values are stored here. Secret keys must be configured on your backend server.
            </Typography>
          </Alert>

          <TextField
            fullWidth
            label="API Key (key_id)"
            value={razorpayForm.keyId}
            onChange={(e) => setRazorpayForm({ ...razorpayForm, keyId: e.target.value })}
            margin="normal"
            helperText="Your Razorpay Key ID (safe to store client-side)"
          />
          
          <TextField
            fullWidth
            label="Secret Key"
            value="••••••••••••••••"
            margin="normal"
            disabled
            helperText="Server-side only; configure in backend environment variables"
          />

          <TextField
            fullWidth
            label="Webhook URL (Optional)"
            value={razorpayForm.webhookUrl}
            onChange={(e) => setRazorpayForm({ ...razorpayForm, webhookUrl: e.target.value })}
            margin="normal"
            placeholder="https://yourapp.com/api/webhooks/razorpay"
            helperText="URL where payment notifications will be sent"
          />

          <TextField
            fullWidth
            label="Return URL (Optional)"
            value={razorpayForm.returnUrl}
            onChange={(e) => setRazorpayForm({ ...razorpayForm, returnUrl: e.target.value })}
            margin="normal"
            placeholder="https://yourapp.com/payment-success"
            helperText="URL where users will be redirected after payment (demo mode only)"
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              <Warning sx={{ fontSize: 16, mr: 0.5 }} />
              Security Note:
            </Typography>
            <Typography variant="body2">
              Never store secret keys in client-side code. This demo only stores the Key ID for checkout initialization.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRazorpayDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleSaveRazorpayConfig}
          >
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Geo Test Dialog */}
      <Dialog 
        open={geoTestDialog} 
        onClose={() => setGeoTestDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Geo Location Test Results</DialogTitle>
        <DialogContent>
          {location && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Current Location
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Latitude</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {location.lat.toFixed(6)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Longitude</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {location.lng.toFixed(6)}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Geohash & Bounds
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Geohash</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {getGeohash(location)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">5km Query Bounds</Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto', mt: 1 }}>
                  {getQueryBounds(location, 5).bounds.map((bound, index) => (
                    <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace' }}>
                      [{bound[0]}, {bound[1]}]
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGeoTestDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog 
        open={configDialog.open} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {configDialog.integration?.isMock ? 'Switch Provider' : 'Configure Integration'}
        </DialogTitle>
        <DialogContent>
          {configDialog.integration?.isMock ? (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Mock Provider Active
                </Typography>
                <Typography variant="body2">
                  You can switch to a real provider by configuring the API credentials below. 
                  For now, the mock provider is handling all {configDialog.integration.category} operations.
                </Typography>
              </Alert>

              <Typography variant="h6" gutterBottom>
                Available Providers for {configDialog.integration.category}:
              </Typography>

              <Grid container spacing={2}>
                {integrations
                  .filter(i => i.category === configDialog.integration?.category)
                  .map(provider => (
                    <Grid item xs={12} key={provider.id}>
                      <Card 
                        sx={{ 
                          border: provider.isActive ? 2 : 1,
                          borderColor: provider.isActive ? 'success.main' : 'divider'
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                              {provider.name}
                            </Typography>
                            {provider.isActive && (
                              <Chip size="small" label="Active" color="success" />
                            )}
                            {provider.isMock && (
                              <Chip size="small" label="Mock" color="warning" variant="outlined" />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {provider.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ) : (
            <Box>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Production Configuration
                </Typography>
                <Typography variant="body2">
                  To activate {configDialog.integration?.name}, you'll need to provide API credentials. 
                  This demo doesn't store real credentials.
                </Typography>
              </Alert>

              <TextField
                fullWidth
                label="API Key"
                placeholder="Enter your API key"
                margin="normal"
                type="password"
                helperText="Your API key will be securely stored and encrypted"
              />
              
              <TextField
                fullWidth
                label="Secret Key"
                placeholder="Enter your secret key"
                margin="normal"
                type="password"
                helperText="Required for secure API communication"
              />

              {configDialog.integration?.category === 'payments' && (
                <>
                  <TextField
                    fullWidth
                    label="Webhook URL"
                    placeholder="https://yourapp.com/webhook"
                    margin="normal"
                    helperText="URL where payment notifications will be sent"
                  />
                  <TextField
                    fullWidth
                    label="Return URL"
                    placeholder="https://yourapp.com/payment-success"
                    margin="normal"
                    helperText="URL where users will be redirected after payment"
                  />
                </>
              )}

              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  <Info sx={{ fontSize: 16, mr: 0.5 }} />
                  Next Steps:
                </Typography>
                <Typography variant="body2">
                  1. Test the integration in sandbox mode<br/>
                  2. Verify webhook endpoints<br/>
                  3. Update environment variables<br/>
                  4. Deploy and monitor
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={handleCloseDialog}
          >
            {configDialog.integration?.isMock ? 'Keep Mock Provider' : 'Save Configuration'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default IntegrationsPage;