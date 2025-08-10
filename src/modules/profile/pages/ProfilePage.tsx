import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Person,
  ShoppingBag,
  Assignment,
  Payment,
  Edit,
  Visibility,
  MoreVert,
  Phone,
  Email,
  LocationOn,
  Verified,
  CardMembership,
} from '@mui/icons-material';
import { useAuthStore } from '../../../core/state/auth.store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/config/app.config';
import { useContactPass } from '../../payments/useContactPass';
import { formatPrice } from '../../../core/config/pricing';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const { hasActivePass, getDaysRemaining, purchaseContactPass, loading: passLoading, price: passPrice } = useContactPass();

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
        <Alert severity="error">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  // Mock data for user's listings and requirements
  const userListings = [
    {
      id: '1',
      title: 'iPhone 13 Pro - Excellent Condition',
      price: 65000,
      status: 'active',
      views: 156,
      createdAt: new Date(Date.now() - 86400000),
      category: 'Electronics',
    },
    {
      id: '2',
      title: 'MacBook Pro 2021',
      price: 120000,
      status: 'sold',
      views: 89,
      createdAt: new Date(Date.now() - 172800000),
      category: 'Electronics',
    },
  ];

  const userRequirements = [
    {
      id: '1',
      title: 'Looking for Honda City',
      budget: { min: 800000, max: 1000000 },
      status: 'active',
      responses: 12,
      createdAt: new Date(Date.now() - 259200000),
      category: 'Vehicles',
    },
  ];

  const paymentHistory = [
    {
      id: '1',
      type: 'Listing Fee',
      amount: 99,
      status: 'completed',
      date: new Date(Date.now() - 86400000),
      listingTitle: 'iPhone 13 Pro',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'sold': return 'info';
      case 'expired': return 'warning';
      case 'draft': return 'default';
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      {/* Profile Header */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 120, height: 120, fontSize: '3rem' }}
            >
              {user.name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 2 }}>
                {user.name}
              </Typography>
              {user.isVerified && (
                <Verified color="success" sx={{ fontSize: '2rem' }} />
              )}
              <Box sx={{ ml: 'auto' }}>
                <IconButton onClick={handleMenuClick}>
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Edit sx={{ mr: 1 }} /> Edit Profile
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Phone sx={{ mr: 1 }} /> Update Phone
                  </MenuItem>
                </Menu>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <Email fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body1">{user.email}</Typography>
              </Box>
              {user.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                  <Phone fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body1">{user.phone}</Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`Role: ${user.role}`} color="primary" />
              <Chip
                label={user.isVerified ? 'Email Verified' : 'Email Not Verified'}
                color={user.isVerified ? 'success' : 'warning'}
              />
              <Chip
                label={user.phone ? 'Phone Verified' : 'Phone Not Verified'}
                color={user.phone ? 'success' : 'warning'}
              />
              <Chip
                label={hasActivePass ? `Contact Pass Active (${getDaysRemaining()}d)` : 'No Contact Pass'}
                color={hasActivePass ? 'success' : 'default'}
                icon={<CardMembership />}
              />
              <Chip
                label={`Member since ${formatDate(user.createdAt)}`}
                variant="outlined"
              />
            </Box>
            
            {/* Verification CTAs */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {!user.isVerified && (
                <Button
                  variant="outlined"
                  size="small"
                  color="warning"
                >
                  Verify Email
                </Button>
              )}
              {!user.phone && (
                <Button
                  variant="outlined"
                  size="small"
                  color="warning"
                  onClick={() => navigate(ROUTES.VERIFY)}
                >
                  Verify Phone
                </Button>
              )}
              {!hasActivePass && (
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={purchaseContactPass}
                  disabled={passLoading}
                >
                  {passLoading ? 'Processing...' : `Get Contact Pass - ${formatPrice(passPrice)}`}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CardMembership color={hasActivePass ? 'success' : 'disabled'} sx={{ fontSize: '3rem', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Contact Pass
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hasActivePass ? `${getDaysRemaining()} days left` : 'Not active'}
              </Typography>
              {hasActivePass && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(getDaysRemaining() / 15) * 100} 
                    color="success"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShoppingBag color="primary" sx={{ fontSize: '3rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userListings.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Listings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment color="secondary" sx={{ fontSize: '3rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userRequirements.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requirements
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Visibility color="success" sx={{ fontSize: '3rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {userListings.reduce((acc, listing) => acc + listing.views, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Views
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Payment color="warning" sx={{ fontSize: '3rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ₹{paymentHistory.reduce((acc, payment) => acc + payment.amount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab
              icon={<ShoppingBag />}
              label="My Listings"
              iconPosition="start"
            />
            <Tab
              icon={<Assignment />}
              label="My Requirements"
              iconPosition="start"
            />
            <Tab
              icon={<Payment />}
              label="Payment History"
              iconPosition="start"
            />
            <Tab
              icon={<Person />}
              label="Account Settings"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* My Listings Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              My Listings ({userListings.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<ShoppingBag />}
              onClick={() => navigate(ROUTES.CREATE_LISTING)}
            >
              Create New Listing
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {listing.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{listing.category}</TableCell>
                    <TableCell>{formatPrice(listing.price)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={listing.status}
                        color={getStatusColor(listing.status) as any}
                      />
                    </TableCell>
                    <TableCell>{listing.views}</TableCell>
                    <TableCell>{formatDate(listing.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => navigate(`${ROUTES.LISTINGS}/${listing.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {userListings.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <ShoppingBag sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No listings yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start selling by creating your first listing
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(ROUTES.CREATE_LISTING)}
              >
                Create Listing
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* My Requirements Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              My Requirements ({userRequirements.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Assignment />}
              onClick={() => navigate(ROUTES.CREATE_REQUIREMENT)}
            >
              Post New Requirement
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Budget</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Responses</TableCell>
                  <TableCell>Posted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userRequirements.map((requirement) => (
                  <TableRow key={requirement.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {requirement.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{requirement.category}</TableCell>
                    <TableCell>
                      {formatPrice(requirement.budget.min)} - {formatPrice(requirement.budget.max)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={requirement.status}
                        color={getStatusColor(requirement.status) as any}
                      />
                    </TableCell>
                    <TableCell>{requirement.responses}</TableCell>
                    <TableCell>{formatDate(requirement.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => navigate(`${ROUTES.REQUIREMENTS}/${requirement.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Payment History Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Payment History
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell>{payment.listingTitle}</TableCell>
                    <TableCell>{formatPrice(payment.amount)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={payment.status}
                        color={getStatusColor(payment.status) as any}
                      />
                    </TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {paymentHistory.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Payment sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No payment history
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your payment transactions will appear here
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Account Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Account Settings
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Pass
                  </Typography>
                  {hasActivePass ? (
                    <Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Your Contact Pass is active for {getDaysRemaining()} more days.
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(getDaysRemaining() / 15) * 100} 
                        color="success"
                        sx={{ mb: 2 }}
                      />
                      <Button 
                        variant="outlined" 
                        onClick={purchaseContactPass}
                        disabled={passLoading}
                      >
                        {passLoading ? 'Processing...' : `Renew - ${formatPrice(passPrice)}`}
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Get unlimited access to contact sellers for 15 days.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={purchaseContactPass}
                        disabled={passLoading}
                      >
                        {passLoading ? 'Processing...' : `Get Contact Pass - ${formatPrice(passPrice)}`}
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1">{user.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{user.email}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{user.phone || 'Not provided'}</Typography>
                    </Box>
                    <Button variant="outlined" startIcon={<Edit />}>
                      Edit Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Status
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Verification Status</Typography>
                      <Chip
                        label={user.isVerified ? 'Verified' : 'Pending Verification'}
                        color={user.isVerified ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Account Type</Typography>
                      <Chip label={user.role} color="primary" size="small" />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Member Since</Typography>
                      <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
                    </Box>
                    {!user.isVerified && (
                      <Button
                        variant="contained"
                        onClick={() => navigate(ROUTES.VERIFY)}
                      >
                        Verify Account
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfilePage;