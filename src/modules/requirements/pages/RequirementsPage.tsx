import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  Pagination,
  InputAdornment,
  Fab,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Add,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../core/state/auth.store';
import { ROUTES } from '../../../core/config/app.config';

// Mock data for requirements
const mockRequirements = [
  {
    id: '1',
    title: 'Need iPhone 12 or 13 in good condition',
    description: 'Looking for a used iPhone 12 or 13 in excellent condition. Must have original box and accessories. Battery health should be above 85%.',
    category: 'Electronics',
    subcategory: 'Mobile Phones',
    budget: { min: 40000, max: 55000 },
    location: { city: 'Delhi', state: 'Delhi' },
    userName: 'Rajesh Kumar',
    userPhone: '+919876543210',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000),
    expiresAt: new Date(Date.now() + 86400000 * 30),
    responses: 8,
  },
  {
    id: '2',
    title: 'Looking for Royal Enfield Classic 350',
    description: 'Want to buy a Royal Enfield Classic 350, preferably 2019 or newer. Should be well maintained with all documents clear.',
    category: 'Vehicles',
    subcategory: 'Motorcycles',
    budget: { min: 120000, max: 140000 },
    location: { city: 'Mumbai', state: 'Maharashtra' },
    userName: 'Priya Singh',
    userPhone: '+919876543211',
    status: 'active',
    createdAt: new Date(Date.now() - 172800000),
    expiresAt: new Date(Date.now() + 86400000 * 25),
    responses: 12,
  },
  {
    id: '3',
    title: '2BHK apartment for rent in Bangalore',
    description: 'Looking for a 2BHK apartment in Koramangala or nearby areas. Prefer furnished or semi-furnished. Good connectivity to tech parks required.',
    category: 'Real Estate',
    subcategory: 'Apartments',
    budget: { min: 20000, max: 35000 },
    location: { city: 'Bangalore', state: 'Karnataka' },
    userName: 'Amit Patel',
    userPhone: '+919876543212',
    status: 'active',
    createdAt: new Date(Date.now() - 259200000),
    expiresAt: new Date(Date.now() + 86400000 * 20),
    responses: 15,
  },
];

const RequirementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'fulfilled': return 'info';
      case 'expired': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Requirements
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Post what you need or respond to others' requirements
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="vehicles">Vehicles</MenuItem>
                <MenuItem value="real-estate">Real Estate</MenuItem>
                <MenuItem value="fashion">Fashion</MenuItem>
                <MenuItem value="home-garden">Home & Garden</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Add />}
              onClick={() => navigate(ROUTES.CREATE_REQUIREMENT)}
              disabled={!isAuthenticated}
            >
              Post Requirement
            </Button>
          </Grid>
        </Grid>

        {/* Active Filters */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {searchQuery && (
            <Chip
              label={`Search: "${searchQuery}"`}
              onDelete={() => setSearchQuery('')}
              color="primary"
              variant="outlined"
            />
          )}
          {category && (
            <Chip
              label={`Category: ${category}`}
              onDelete={() => setCategory('')}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Paper>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          How it works:
        </Typography>
        <Typography variant="body2">
          1. Post your requirement for free • 2. Get responses from interested sellers • 3. Connect and negotiate directly • 4. Complete your purchase safely
        </Typography>
      </Alert>

      {/* Requirements Grid */}
      <Grid container spacing={3}>
        {mockRequirements.map((requirement) => (
          <Grid item xs={12} sm={6} md={4} key={requirement.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
                },
              }}
              onClick={() => navigate(`${ROUTES.REQUIREMENTS}/${requirement.id}`)}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      flexGrow: 1, 
                      mr: 1,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {requirement.title}
                  </Typography>
                  <Chip
                    size="small"
                    label={requirement.status}
                    color={getStatusColor(requirement.status) as any}
                    sx={{ flexShrink: 0 }}
                  />
                </Box>

                <Typography 
                  variant="h5" 
                  color="primary" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    mb: 1,
                  }}
                >
                  {formatPrice(requirement.budget.min)} - {formatPrice(requirement.budget.max)}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    mb: 2,
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                  }}
                >
                  {requirement.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip size="small" label={requirement.category} variant="outlined" />
                  <Chip size="small" label={requirement.subcategory} variant="outlined" color="secondary" />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 2 }}>
                  <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography 
                    variant="body2" 
                    noWrap
                    sx={{ fontSize: '0.9rem' }}
                  >
                    {requirement.location.city}, {requirement.location.state}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {formatTimeAgo(requirement.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                      }}
                    >
                      {requirement.responses} responses
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: '0.85rem' }}
                  >
                    Posted by: <strong>{requirement.userName}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Pagination
          count={5}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          size="large"
        />
      </Box>

      {/* Floating Action Button */}
      {isAuthenticated && (
        <Fab
          color="secondary"
          aria-label="post requirement"
          sx={{ position: 'fixed', bottom: 24, left: 24 }}
          onClick={() => navigate(ROUTES.CREATE_REQUIREMENT)}
        >
          <Add />
        </Fab>
      )}

      {/* Not authenticated message */}
      {!isAuthenticated && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            p: 2,
            bgcolor: 'warning.light',
            maxWidth: 300,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Want to post a requirement?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Sign in to post your requirements for free
          </Typography>
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Sign In
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default RequirementsPage;