import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';
import {
  Dashboard,
  People,
  ShoppingBag,
  Assignment,
  Payment,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Visibility,
  Block,
  Check,
  Close,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/config/app.config';
import { ConfirmDialog } from '../../../core/ui/components/ConfirmDialog';

import { useLocation } from 'react-router-dom';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({});
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
    destructive?: boolean;
    showReasonField?: boolean;
  }>({ open: false, title: '', message: '', action: () => {} });
  const [reason, setReason] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Set initial tab based on route
  React.useEffect(() => {
    switch (location.pathname) {
      case '/admin/users':
        setTabValue(1);
        break;
      case '/admin/listings':
        setTabValue(2);
        break;
      case '/admin/requirements':
        setTabValue(3);
        break;
      default:
        setTabValue(0);
    }
  }, [location.pathname]);

  // Mock data
  const stats = {
    totalUsers: 1248,
    totalListings: 856,
    totalRequirements: 342,
    totalRevenue: 84726,
    activeUsers: 156,
    pendingApprovals: 12,
  };

  const recentUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      joinDate: new Date(Date.now() - 86400000),
      listings: 3,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'active',
      joinDate: new Date(Date.now() - 172800000),
      listings: 1,
    },
  ];

  const pendingListings = [
    {
      id: '1',
      title: 'iPhone 14 Pro Max',
      seller: 'Raj Kumar',
      category: 'Electronics',
      price: 85000,
      status: 'pending_approval',
      submittedAt: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      title: 'Honda City 2022',
      seller: 'Priya Sharma',
      category: 'Vehicles',
      price: 1200000,
      status: 'pending_approval',
      submittedAt: new Date(Date.now() - 7200000),
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (id: string) => (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor({ ...menuAnchor, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => () => {
    setMenuAnchor({ ...menuAnchor, [id]: null });
  };

  const handleModerationAction = (
    itemId: string,
    itemTitle: string,
    action: 'approve' | 'reject' | 'suspend' | 'delete',
    itemType: 'listing' | 'requirement' | 'user'
  ) => {
    const actionText = action.charAt(0).toUpperCase() + action.slice(1);
    const showReason = action === 'reject' || action === 'suspend' || action === 'delete';
    
    setConfirmDialog({
      open: true,
      title: `${actionText} ${itemType}`,
      message: `Are you sure you want to ${action} "${itemTitle}"?`,
      action: () => performModerationAction(itemId, action, itemType),
      destructive: action === 'delete' || action === 'suspend',
      showReasonField: showReason,
    });
    setReason('');
  };

  const performModerationAction = async (
    itemId: string,
    action: string,
    itemType: string
  ) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state optimistically
      if (itemType === 'listing') {
        // Update pendingListings status
        // In real app, this would update the listings state
      }
      
      setSnackbar({
        open: true,
        message: `${itemType} ${action}d successfully${reason ? ` (${reason})` : ''}`,
        severity: 'success',
      });
      
      setConfirmDialog({ ...confirmDialog, open: false });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to ${action} ${itemType}`,
        severity: 'error',
      });
    }
  };

  const handleBulkAction = async (action: string, selectedItems: string[]) => {
    try {
      // Mock bulk operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: `${selectedItems.length} items ${action}d successfully`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to ${action} selected items`,
        severity: 'error',
      });
    }
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending_approval': return 'warning';
      case 'suspended': return 'error';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const userColumns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={getStatusColor(params.value) as any}
        />
      ),
    },
    {
      field: 'joinDate',
      headerName: 'Joined',
      width: 150,
      valueFormatter: (params) => formatDate(params.value),
    },
    { field: 'listings', headerName: 'Listings', width: 100, type: 'number' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton size="small" onClick={handleMenuClick(params.row.id)}>
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your marketplace platform
          </Typography>
        </div>
        <Button
          variant="contained"
          onClick={() => navigate(ROUTES.INTEGRATIONS)}
        >
          Integrations
        </Button>
      </Box>

      {/* Alert for pending items */}
      {stats.pendingApprovals > 0 && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {stats.pendingApprovals} items pending approval
          </Typography>
          <Typography variant="body2">
            Review listings and requirements waiting for moderation.
          </Typography>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People color="primary" sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  +12%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShoppingBag color="secondary" sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalListings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Listings
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  +8%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment color="info" sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalRequirements.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requirements
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  +15%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Payment color="warning" sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {formatPrice(stats.totalRevenue).replace('₹', '₹')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenue
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  +22%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Visibility color="success" sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.activeUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Last 24h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2} lg={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Dashboard color="error" sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.pendingApprovals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approvals
              </Typography>
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                Needs Attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab
              icon={<Dashboard />}
              label="Overview"
              iconPosition="start"
            />
            <Tab
              icon={<People />}
              label="Users"
              iconPosition="start"
            />
            <Tab
              icon={<ShoppingBag />}
              label="Listings"
              iconPosition="start"
            />
            <Tab
              icon={<Assignment />}
              label="Requirements"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Recent Users */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Users
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={user.status}
                            color={getStatusColor(user.status) as any}
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.joinDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Pending Listings */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Pending Listings
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Seller</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {listing.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {listing.category}
                          </Typography>
                        </TableCell>
                        <TableCell>{listing.seller}</TableCell>
                        <TableCell>{formatPrice(listing.price)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" color="success">
                              <Check />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Close />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            User Management
          </Typography>
          
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={recentUsers}
              columns={userColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>

          {/* User action menus */}
          {recentUsers.map((user) => (
            <Menu
              key={`menu-${user.id}`}
              anchorEl={menuAnchor[user.id]}
              open={Boolean(menuAnchor[user.id])}
              onClose={handleMenuClose(user.id)}
            >
              <MenuItem onClick={handleMenuClose(user.id)}>
                <Visibility sx={{ mr: 1 }} /> View Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose(user.id)}>
                <Block sx={{ mr: 1 }} /> Suspend User
              </MenuItem>
            </Menu>
          ))}
        </TabPanel>

        {/* Listings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Listings Moderation
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Seller</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {listing.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{listing.seller}</TableCell>
                    <TableCell>{listing.category}</TableCell>
                    <TableCell>{formatPrice(listing.price)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={listing.status.replace('_', ' ')}
                        color={getStatusColor(listing.status) as any}
                      />
                    </TableCell>
                    <TableCell>{formatDate(listing.submittedAt)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          color="success" 
                          startIcon={<Check />}
                          onClick={() => handleModerationAction(
                            listing.id,
                            listing.title,
                            'approve',
                            'listing'
                          )}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<Close />}
                          onClick={() => handleModerationAction(
                            listing.id,
                            listing.title,
                            'reject',
                            'listing'
                          )}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Requirements Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Requirements Management
          </Typography>
          
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Assignment sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No requirements pending moderation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All requirements are automatically approved
            </Typography>
          </Box>
        </TabPanel>
      </Paper>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        destructive={confirmDialog.destructive}
        showReasonField={confirmDialog.showReasonField}
        reason={reason}
        onReasonChange={setReason}
        reasonLabel="Reason for action"
      />

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

export default AdminDashboard;