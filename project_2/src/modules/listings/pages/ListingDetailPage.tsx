import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
  Snackbar,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  Share,
  Favorite,
  FavoriteBorder,
  Visibility,
  CalendarToday,
  Category,
  QuestionAnswer,
  People,
  Payment,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getListingsAdapter } from '../../../adapters/registry';
import { ROUTES } from '../../../core/config/app.config';
import { useContactPass } from '../../payments/useContactPass';
import { useListingPayments } from '../hooks/useListingPayments';
import { formatPrice } from '../../../core/config/pricing';
import { sanitizeMessage } from '../../chat/sanitize';

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
      id={`listing-tabpanel-${index}`}
      aria-labelledby={`listing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);
  const [contactDialog, setContactDialog] = React.useState(false);
  const [addonDialog, setAddonDialog] = React.useState(false);
  const [newQuestion, setNewQuestion] = React.useState('');
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListingsAdapter().getListing(id!),
    enabled: !!id,
  });
  
  const { hasActivePass, purchaseContactPass, loading: passLoading, price: passPrice, getDaysRemaining } = useContactPass();
  const { purchaseViewContactsAddon, canViewContacts, loading: addonLoading, addonPrice } = useListingPayments();

  // Mock data for questions and interested users
  const mockQuestions = [
    {
      id: '1',
      user: 'Raj Kumar',
      question: 'Is the phone still under warranty?',
      answer: 'Yes, it has 6 months warranty remaining.',
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      user: 'Priya Singh',
      question: 'Can you share more photos of the back?',
      answer: null,
      timestamp: new Date(Date.now() - 3600000),
    },
  ];
  
  const mockInterestedUsers = [
    {
      id: '1',
      name: 'Amit Patel',
      phone: '+919876543210',
      email: 'amit@example.com',
      message: 'Very interested in this phone. Can we meet tomorrow?',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '2',
      name: 'Sneha Gupta',
      phone: '+919876543211',
      email: 'sneha@example.com',
      message: 'Is the price negotiable?',
      timestamp: new Date(Date.now() - 14400000),
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'sold': return 'error';
      case 'expired': return 'warning';
      case 'pending_payment': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Available';
      case 'sold': return 'Sold';
      case 'expired': return 'Expired';
      case 'pending_payment': return 'Pending Payment';
      case 'draft': return 'Draft';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const handleContactSeller = () => {
    if (!hasActivePass) {
      setContactDialog(true);
    } else {
      // Open chat or show contact details
      setSnackbar({
        open: true,
        message: 'Contact details revealed! You can now reach the seller.',
        severity: 'success',
      });
    }
  };

  const handlePurchaseContactPass = async () => {
    const success = await purchaseContactPass();
    if (success) {
      setContactDialog(false);
      setSnackbar({
        open: true,
        message: `Contact Pass activated! Valid for ${getDaysRemaining()} days.`,
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Payment failed. Please try again.',
        severity: 'error',
      });
    }
  };

  const handlePurchaseAddon = async () => {
    if (!id) return;
    const success = await purchaseViewContactsAddon(id);
    if (success) {
      setAddonDialog(false);
      setSnackbar({
        open: true,
        message: 'Contact details unlocked for interested users!',
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Payment failed. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleSubmitQuestion = () => {
    const { sanitized, hasRedactions } = sanitizeMessage(newQuestion);
    
    if (hasRedactions) {
      setSnackbar({
        open: true,
        message: 'Contact details are hidden. Get a Contact Pass to reach sellers.',
        severity: 'info',
      });
    }
    
    // Submit sanitized question
    console.log('Submitting question:', sanitized);
    setNewQuestion('');
    setSnackbar({
      open: true,
      message: 'Question submitted successfully!',
      severity: 'success',
    });
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading listing. Please try again.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 1 }} />
            <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2 }} />
            <Skeleton variant="text" height={100} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box textAlign="center" py={8}>
          <Typography variant="h5" gutterBottom>
            Listing not found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The listing you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.LISTINGS)}
          >
            Browse All Listings
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Image */}
          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardMedia
              component="img"
              sx={{ 
                height: { xs: 250, sm: 300, md: 400 },
                objectFit: 'cover',
              }}
              image={listing.images[0] || 'https://images.pexels.com/photos/593174/pexels-photo-593174.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt={listing.title}
            />
          </Card>

          {/* Title and Status */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', flexGrow: 1, mr: 2 }}>
                {listing.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={getStatusText(listing.status)}
                  color={getStatusColor(listing.status) as any}
                  variant="filled"
                />
                <Chip
                  label={listing.category}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>

            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
              {formatPrice(listing.price)}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Visibility fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{listing.views} views</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Favorite fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{listing.favorites} favorites</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">Posted {formatDate(listing.createdAt)}</Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Tabs */}
          <Paper elevation={2} sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={(_, value) => setTabValue(value)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<Category />} label="Overview" iconPosition="start" />
                <Tab icon={<QuestionAnswer />} label="Questions & Replies" iconPosition="start" />
                <Tab icon={<People />} label="Interested" iconPosition="start" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {/* Description */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {listing.description}
                </Typography>
              </Box>

              {/* Details */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {listing.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Subcategory
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {listing.subcategory}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Posted Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formatDate(listing.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formatDate(listing.updatedAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Location */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Location
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {listing.location.address}, {listing.location.city}, {listing.location.state} - {listing.location.pincode}
                  </Typography>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Questions & Replies
              </Typography>
              
              {/* Ask Question */}
              <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ask a question about this listing..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSubmitQuestion}
                  disabled={!newQuestion.trim()}
                >
                  Ask Question
                </Button>
              </Box>

              {/* Questions List */}
              <List>
                {mockQuestions.map((q) => (
                  <ListItem key={q.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {q.user}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(q.timestamp)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Q: {q.question}
                    </Typography>
                    {q.answer && (
                      <Typography variant="body2" color="primary" sx={{ fontStyle: 'italic' }}>
                        A: {q.answer}
                      </Typography>
                    )}
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Interested Users ({mockInterestedUsers.length})
                </Typography>
                {!canViewContacts(id!) && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Payment />}
                    onClick={() => setAddonDialog(true)}
                  >
                    Unlock Contacts - {formatPrice(addonPrice)}
                  </Button>
                )}
              </Box>

              <List>
                {mockInterestedUsers.map((user) => (
                  <ListItem key={user.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(user.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          {canViewContacts(id!) ? (
                            <>
                              <Typography variant="body2" color="text.secondary">
                                Phone: {user.phone}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Email: {user.email}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography variant="body2" color="text.secondary">
                                Phone: (hidden)
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Email: (hidden)
                              </Typography>
                            </>
                          )}
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {sanitizeMessage(user.message, canViewContacts(id!)).sanitized}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Seller Info */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Seller Information
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ mr: 2, width: 56, height: 56 }}>
                {listing.sellerName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  {listing.sellerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified Seller
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flex: 'column', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={hasActivePass ? <Phone /> : <Payment />}
                onClick={handleContactSeller}
                sx={{ py: 1.5 }}
              >
                {hasActivePass ? 'Contact Seller' : `Contact Pass - ${formatPrice(passPrice)}`}
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<Email />}
                sx={{ py: 1.5 }}
              >
                Send Message
              </Button>
            </Box>

            {hasActivePass ? (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Phone: {listing.sellerPhone}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Phone: (hidden - get Contact Pass)
              </Typography>
            )}
          </Paper>

          {/* Actions */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Actions
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FavoriteBorder />}
                sx={{ flexGrow: 1 }}
              >
                Save
              </Button>
              
              <IconButton
                onClick={handleShare}
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <Share />
              </IconButton>
            </Box>
          </Paper>

          {/* Safety Tips */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: 'info.light' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Safety Tips
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Meet in a public place for transactions
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Inspect the item before making payment
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Don't share personal financial information
              </Typography>
              <Typography component="li" variant="body2">
                Trust your instincts
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Contact Pass Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contact Pass - {formatPrice(passPrice)} for 15 days</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Get unlimited access to contact sellers for 15 days.
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Contact unlimited sellers
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              View phone numbers and email addresses
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Direct messaging capability
            </Typography>
            <Typography component="li" variant="body2">
              Valid for 15 days from purchase
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handlePurchaseContactPass}
            disabled={passLoading}
          >
            {passLoading ? 'Processing...' : `Pay ${formatPrice(passPrice)}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Contacts Addon Dialog */}
      <Dialog open={addonDialog} onClose={() => setAddonDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Unlock Contact Details - {formatPrice(addonPrice)}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            See contact details of users interested in this listing.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            One-time payment for this listing only. You'll be able to see phone numbers and email addresses of interested buyers.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddonDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handlePurchaseAddon}
            disabled={addonLoading}
          >
            {addonLoading ? 'Processing...' : `Pay ${formatPrice(addonPrice)}`}
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

export default ListingDetailPage;