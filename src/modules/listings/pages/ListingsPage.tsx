import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Paper,
  Pagination,
  InputAdornment,
  Fab,
  Skeleton,
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Visibility,
  Favorite,
  Add,
  Sort,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getListingsAdapter } from '../../../adapters/registry';
import { Listing } from '../../../core/ports/listings.port';
import { ROUTES } from '../../../core/config/app.config';
import { useAuthStore } from '../../../core/state/auth.store';

const ListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [subcategory, setSubcategory] = useState(searchParams.get('subcategory') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getListingsAdapter().getCategories(),
  });

  // Fetch listings
  const { data: listingsData, isLoading, error } = useQuery({
    queryKey: ['listings', { searchQuery, category, subcategory, minPrice, maxPrice, sortBy, page }],
    queryFn: () => getListingsAdapter().getListings(
      {
        query: searchQuery || undefined,
        category: category || undefined,
        subcategory: subcategory || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      },
      page,
      12
    ),
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    if (page > 1) params.set('page', page.toString());
    
    setSearchParams(params);
  }, [searchQuery, category, subcategory, minPrice, maxPrice, sortBy, page, setSearchParams]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSubcategory(''); // Reset subcategory when category changes
    setPage(1);
  };

  const selectedCategory = categories.find(cat => cat.id === category);
  const subcategories = selectedCategory?.subcategories || [];

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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
        <Typography color="error" textAlign="center">
          Error loading listings. Please try again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Browse Listings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover amazing deals from your local community
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search listings..."
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
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {subcategories.length > 0 && (
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={subcategory}
                  label="Subcategory"
                  onChange={(e) => setSubcategory(e.target.value)}
                >
                  <MenuItem value="">All Subcategories</MenuItem>
                  {subcategories.map((subcat) => (
                    <MenuItem key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              fullWidth
              label="Min Price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              fullWidth
              label="Max Price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort</InputLabel>
              <Select
                value={sortBy}
                label="Sort"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort sx={{ mr: 1, color: 'action.active' }} />}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
              </Select>
            </FormControl>
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
              label={`Category: ${categories.find(c => c.id === category)?.name}`}
              onDelete={() => handleCategoryChange('')}
              color="primary"
              variant="outlined"
            />
          )}
          {subcategory && (
            <Chip
              label={`Subcategory: ${subcategories.find(s => s.id === subcategory)?.name}`}
              onDelete={() => setSubcategory('')}
              color="primary"
              variant="outlined"
            />
          )}
          {minPrice && (
            <Chip
              label={`Min: ₹${minPrice}`}
              onDelete={() => setMinPrice('')}
              color="primary"
              variant="outlined"
            />
          )}
          {maxPrice && (
            <Chip
              label={`Max: ₹${maxPrice}`}
              onDelete={() => setMaxPrice('')}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Paper>

      {/* Results Summary */}
      {!isLoading && listingsData && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {listingsData.total} listings found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Page {page}
          </Typography>
        </Box>
      )}

      {/* Listings Grid */}
      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} lg={2.4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={160} />
                  <CardContent>
                    <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : listingsData?.listings.map((listing: Listing) => (
              <Grid item xs={12} sm={6} md={3} lg={2.4} key={listing.id}>
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
                  onClick={() => navigate(`${ROUTES.LISTINGS}/${listing.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={listing.images[0] || 'https://images.pexels.com/photos/593174/pexels-photo-593174.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={listing.title}
                    sx={{ 
                      objectFit: 'cover',
                      aspectRatio: '16/10',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          flexGrow: 1, 
                          mr: 1,
                          fontSize: '0.95rem',
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
                        sx={{ flexShrink: 0 }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      color="primary" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        mb: 1,
                      }}
                    >
                      {formatPrice(listing.price)}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                        mb: 2,
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {listing.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                      <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography 
                        variant="body2" 
                        noWrap
                        sx={{ fontSize: '0.8rem' }}
                      >
                        {listing.location.city}, {listing.location.state}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        {formatTimeAgo(listing.createdAt)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <Visibility fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                            {listing.views}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <Favorite fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                            {listing.favorites}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 1.5, pt: 0 }}>
                    <Button size="small" color="primary" sx={{ fontSize: '0.75rem' }}>
                      View Details
                    </Button>
                    <Button size="small" color="secondary" sx={{ fontSize: '0.75rem' }}>
                      Contact Seller
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* No Results */}
      {!isLoading && listingsData?.listings.length === 0 && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h6" gutterBottom>
            No listings found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria or browse all categories
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSearchQuery('');
              setCategory('');
              setSubcategory('');
              setMinPrice('');
              setMaxPrice('');
              setPage(1);
            }}
          >
            Clear All Filters
          </Button>
        </Box>
      )}

      {/* Pagination */}
      {!isLoading && listingsData && Math.ceil(listingsData.total / 12) > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={Math.ceil(listingsData.total / 12)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Floating Action Button */}
      {isAuthenticated && (
        <Fab
          color="primary"
          aria-label="create listing"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => navigate(ROUTES.CREATE_LISTING)}
        >
          <Add />
        </Fab>
      )}
    </Container>
  );
};

export default ListingsPage;