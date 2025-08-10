import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Card,
  CardContent,
  FormHelperText,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from '@mui/material';
import { PhotoCamera, CurrencyRupee, Delete, Add } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getListingsAdapter } from '../../../adapters/registry';
import { CreateListingData } from '../../../core/ports/listings.port';
import { ROUTES } from '../../../core/config/app.config';
import { LISTING_PRICE_INR, formatPrice } from '../../../core/config/pricing';

const schema = yup.object().shape({
  title: yup.string().min(10, 'Title must be at least 10 characters').max(100, 'Title must be less than 100 characters').required('Title is required'),
  description: yup.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters').required('Description is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  category: yup.string().required('Category is required'),
  subcategory: yup.string().required('Subcategory is required'),
  sellerPhone: yup.string().matches(/^\+?\d{10,15}$/, 'Invalid phone number').required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string().matches(/^\d{6}$/, 'Invalid pincode').required('Pincode is required'),
});

const MAX_IMAGES = 5;

type FormData = {
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  sellerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const steps = ['Basic Information', 'Details & Pricing', 'Location & Contact', 'Review'];

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getListingsAdapter().getCategories(),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: '',
      subcategory: '',
      sellerPhone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const selectedCategory = watch('category');
  const subcategories = categories.find(cat => cat.id === selectedCategory)?.subcategories || [];

  const createListingMutation = useMutation({
    mutationFn: (data: CreateListingData) => getListingsAdapter().createListing(data),
    onSuccess: (listing) => {
      navigate(`${ROUTES.LISTINGS}/${listing.id}`);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create listing');
    },
  });

  const onSubmit = async (data: FormData) => {
    const createData: CreateListingData = {
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      subcategory: data.subcategory,
      images: [], // In a real app, this would be uploaded images
      location: {
        lat: 28.6139, // Mock coordinates - in real app, would geocode the address
        lng: 77.2090,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
      sellerPhone: data.sellerPhone,
    };

    createListingMutation.mutate(createData);
  };

  const handleNext = async () => {
    const fields = getStepFields(activeStep);
    const isStepValid = await trigger(fields);
    
    if (isStepValid) {
      if (activeStep === steps.length - 1) {
        handleSubmit(onSubmit)();
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const totalImages = selectedImages.length + files.length;
    
    if (totalImages > MAX_IMAGES) {
      setImageError(`Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - selectedImages.length} more.`);
      return;
    }
    
    setImageError(null);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageError(null);
  };

  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 0: return ['title', 'description'];
      case 1: return ['price', 'category', 'subcategory'];
      case 2: return ['sellerPhone', 'address', 'city', 'state', 'pincode'];
      case 3: return [];
      default: return [];
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Tell us about your item
            </Typography>
            
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Title"
                  margin="normal"
                  error={!!errors.title}
                  helperText={errors.title?.message || 'Write a clear, descriptive title'}
                  autoFocus
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description"
                  multiline
                  rows={6}
                  margin="normal"
                  error={!!errors.description}
                  helperText={errors.description?.message || 'Describe your item in detail, including condition, features, and any defects'}
                />
              )}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Category and Pricing
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.category}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        {...field}
                        label="Category"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          // Reset subcategory when category changes
                          if (watch('subcategory')) {
                            // You'd need to use setValue here in a real implementation
                          }
                        }}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category && (
                        <Typography variant="caption" color="error">
                          {errors.category.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="subcategory"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.subcategory} disabled={!selectedCategory}>
                      <InputLabel>Subcategory</InputLabel>
                      <Select {...field} label="Subcategory">
                        {subcategories.map((subcat) => (
                          <MenuItem key={subcat.id} value={subcat.id}>
                            {subcat.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.subcategory && (
                        <Typography variant="caption" color="error">
                          {errors.subcategory.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>

            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Price"
                  type="number"
                  margin="normal"
                  error={!!errors.price}
                  helperText={errors.price?.message || 'Set a competitive price for your item'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupee />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />

            <Card sx={{ mt: 2, bgcolor: 'info.light' }}>
              <CardContent>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  💡 Pricing Tips:
                </Typography>
                <Typography variant="body2">
                  • Research similar items to set a competitive price<br />
                  • Consider the item's condition and age<br />
                  • Leave room for negotiation<br />
                  • Listing fee: ₹99 (paid after listing approval)
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Location and Contact
            </Typography>

            <Controller
              name="sellerPhone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone Number"
                  margin="normal"
                  error={!!errors.sellerPhone}
                  helperText={errors.sellerPhone?.message || 'Buyers will use this number to contact you'}
                  placeholder="+91 9876543210"
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Address"
                  margin="normal"
                  error={!!errors.address}
                  helperText={errors.address?.message || 'Street address, building name, etc.'}
                />
              )}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City"
                      margin="normal"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State"
                      margin="normal"
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Controller
              name="pincode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Pincode"
                  margin="normal"
                  error={!!errors.pincode}
                  helperText={errors.pincode?.message || '6-digit postal code'}
                  inputProps={{ maxLength: 6 }}
                />
              )}
            />
          </Box>
        );

      case 3:
        const formValues = watch();
        const selectedCategoryName = categories.find(c => c.id === formValues.category)?.name;
        const selectedSubcategoryName = subcategories.find(s => s.id === formValues.subcategory)?.name;

        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Review Your Listing
            </Typography>
            
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {formValues.title}
                </Typography>
                
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  ₹{formValues.price?.toLocaleString('en-IN')}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formValues.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Category:</Typography>
                  <Typography variant="body1">{selectedCategoryName} › {selectedSubcategoryName}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Location:</Typography>
                  <Typography variant="body1">
                    {formValues.address}, {formValues.city}, {formValues.state} - {formValues.pincode}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">Contact:</Typography>
                  <Typography variant="body1">{formValues.sellerPhone}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Next Steps:
              </Typography>
              <Typography variant="body2">
                1. Your listing will be saved as a draft<br />
                2. Pay the listing fee of {formatPrice(LISTING_PRICE_INR)} to publish<br />
                3. Your listing will be reviewed and go live within 24 hours
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Create New Listing
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Reach thousands of potential buyers in your area
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={createListingMutation.isPending}
            >
              {createListingMutation.isPending
                ? 'Creating...'
                : activeStep === steps.length - 1
                ? 'Create Listing'
                : 'Next'}
            </Button>
          </Box>
        </form>

        {/* Image Upload */}
        <Box
          sx={{
            mt: 4,
            p: 3,
            border: imageError ? '2px dashed red' : '2px dashed',
            borderColor: imageError ? 'error.main' : 'grey.300',
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: imageError ? 'error.light' : 'grey.50',
          }}
        >
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            multiple
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <IconButton color="primary" aria-label="upload picture" component="span" size="large">
              <Add sx={{ fontSize: 48 }} />
            </IconButton>
          </label>
          <Typography variant="h6" gutterBottom>
            Add Photos ({selectedImages.length}/{MAX_IMAGES})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload up to {MAX_IMAGES} photos of your item
          </Typography>
          {imageError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {imageError}
            </Typography>
          )}
        </Box>

        {/* Image Preview */}
        {selectedImages.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected Images
            </Typography>
            <ImageList sx={{ width: '100%', height: 200 }} cols={5} rowHeight={160}>
              {selectedImages.map((file, index) => (
                <ImageListItem key={index}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    loading="lazy"
                    style={{ objectFit: 'cover', height: '100%' }}
                  />
                  <ImageListItemBar
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CreateListingPage;