import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Avatar,
  Rating,
  Stack,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
} from '@mui/material';
import {
  Search,
  LocationOn,
  TrendingUp,
  Security,
  Speed,
  Support,
  ShoppingBag,
  Assignment,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/config/app.config';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);
  const [category, setCategory] = React.useState('');
  const [radius, setRadius] = React.useState(5);

  const featuredListings = [
    {
      id: '1',
      title: 'iPhone 13 Pro Max',
      price: '₹65,000',
      location: 'Delhi',
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Electronics'
    },
    {
      id: '2',
      title: 'Honda City 2020',
      price: '₹8,50,000',
      location: 'Mumbai',
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Vehicles'
    },
    {
      id: '3',
      title: '2BHK Apartment',
      price: '₹45,00,000',
      location: 'Bangalore',
      image: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Real Estate'
    }
  ];

  const categories = [
    { name: 'Electronics', icon: '📱', count: '1.2k+' },
    { name: 'Vehicles', icon: '🚗', count: '850+' },
    { name: 'Real Estate', icon: '🏠', count: '650+' },
    { name: 'Fashion', icon: '👕', count: '920+' },
    { name: 'Home & Garden', icon: '🏡', count: '450+' },
    { name: 'Services', icon: '🔧', count: '380+' },
  ];

  const testimonials = [
    {
      name: 'Raj Kumar',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 5,
      comment: 'Sold my bike within 3 days! Great platform with genuine buyers.',
    },
    {
      name: 'Priya Sharma',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 5,
      comment: 'Found my dream apartment at the right price. Highly recommended!',
    },
    {
      name: 'Amit Patel',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4,
      comment: 'Easy to use platform with verified listings. Trustworthy!',
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0A2E6D 0%, #F9B233 100%)',
          py: 6,
          color: 'white',
          mb: 4,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 1,
          },
        }}
      >
        <Box textAlign="center" mb={4} sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
            }}
          >
            Your Local Marketplace
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{
              opacity: 0.9,
              mb: 3,
              fontSize: '1.125rem',
            }}
          >
            Buy, sell, and discover everything you need in your neighborhood
          </Typography>
        </Box>

        {/* Search Form */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            maxWidth: 800,
            mx: 'auto',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Stack spacing={3}>
            <TextField
              fullWidth
              placeholder="What are you looking for?"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Radius: {radius} km
                  </Typography>
                  <Slider
                    value={radius}
                    onChange={(_, value) => setRadius(value as number)}
                    min={1}
                    max={50}
                    marks={[
                      { value: 1, label: '1km' },
                      { value: 25, label: '25km' },
                      { value: 50, label: '50km' },
                    ]}
                  />
                </Box>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate(ROUTES.LISTINGS)}
              sx={{
                py: 1.5,
              }}
            >
              Search
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Tabs for Listings/Requirements */}
      <Paper elevation={1} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          centered
        >
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
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBag />}
            onClick={() => navigate(ROUTES.LISTINGS)}
          >
            Browse Listings
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Assignment />}
            onClick={() => navigate(ROUTES.REQUIREMENTS)}
          >
            Post Requirement
          </Button>
        </Stack>
      </Box>

      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 4, fontWeight: 'bold' }}
        >
          Browse by Category
        </Typography>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={category.name}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(`${ROUTES.LISTINGS}?category=${category.name.toLowerCase()}`)}
              >
                <Box sx={{ fontSize: '2.5rem', mb: 2 }}>{category.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {category.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {category.count} items
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Listings */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 4, fontWeight: 'bold' }}
        >
          Featured Listings
        </Typography>
        <Grid container spacing={4}>
          {featuredListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  },
                }}
                onClick={() => navigate(`${ROUTES.LISTINGS}/${listing.id}`)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={listing.image}
                  alt={listing.title}
                  sx={{ 
                    objectFit: 'cover',
                    aspectRatio: '16/9',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        flexGrow: 1,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {listing.title}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={listing.category} 
                      color="primary" 
                      variant="outlined"
                      sx={{ ml: 1, flexShrink: 0 }}
                    />
                  </Box>
                  <Typography 
                    variant="h5" 
                    color="primary" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '1.375rem',
                      mb: 1,
                    }}
                  >
                    {listing.price}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                      {listing.location}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button size="small" color="primary" sx={{ fontWeight: 500 }}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(ROUTES.LISTINGS)}
          >
            View All Listings
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 4, fontWeight: 'bold' }}
        >
          Why Choose Mera Local Market?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Box textAlign="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Security fontSize="large" sx={{ color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Secure & Trusted
              </Typography>
              <Typography variant="body1" color="text.secondary">
                All listings are verified and users are authenticated for your safety and peace of mind.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box textAlign="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'secondary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Speed fontSize="large" sx={{ color: 'secondary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quick & Easy
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Post your ads in minutes and start getting responses from interested buyers immediately.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box textAlign="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Support fontSize="large" sx={{ color: 'success.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Local Support
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Connect with buyers and sellers in your local area with dedicated customer support.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 4, fontWeight: 'bold' }}
        >
          What Our Users Say
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent sx={{ pb: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{ mr: 2, width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {testimonial.name}
                      </Typography>
                      <Rating value={testimonial.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.comment}"
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'primary.main',
                  }}
                >
                  <Star fontSize="large" />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* CTA Section */}
      <Paper
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #3f51b5 0%, #ff5722 100%)',
          p: 6,
          color: 'white',
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          Ready to Start?
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 4, opacity: 0.9 }}
        >
          Join thousands of users who trust Mera Local Market for their buying and selling needs.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
            onClick={() => navigate(ROUTES.CREATE_LISTING)}
          >
            Post Your First Listing
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
            onClick={() => navigate(ROUTES.SIGNUP)}
          >
            Join Now - It's Free
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default HomePage;