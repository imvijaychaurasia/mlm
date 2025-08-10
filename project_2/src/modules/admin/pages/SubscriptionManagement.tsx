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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Payment,
  Edit,
  History,
  Save,
  Cancel,
  CurrencyRupee,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  SubscriptionPricing,
  getSubscriptionPricing,
  updateSubscriptionPricing,
  getPricingAuditLog,
  formatPrice,
} from '../../../core/config/pricing';
import { ConfirmDialog } from '../../../core/ui/components/ConfirmDialog';

const schema = yup.object().shape({
  contactPassPrice: yup.number()
    .positive('Contact pass price must be positive')
    .max(10000, 'Price cannot exceed ₹10,000')
    .required('Contact pass price is required'),
  contactPassDuration: yup.number()
    .positive('Duration must be positive')
    .max(365, 'Duration cannot exceed 365 days')
    .required('Duration is required'),
  listingPrice: yup.number()
    .positive('Listing price must be positive')
    .max(10000, 'Price cannot exceed ₹10,000')
    .required('Listing price is required'),
  listingDuration: yup.number()
    .positive('Duration must be positive')
    .max(365, 'Duration cannot exceed 365 days')
    .required('Duration is required'),
  viewContactsAddonPrice: yup.number()
    .positive('Addon price must be positive')
    .max(10000, 'Price cannot exceed ₹10,000')
    .required('Addon price is required'),
});

const SubscriptionManagement: React.FC = () => {
  const [pricing, setPricing] = useState<SubscriptionPricing>(getSubscriptionPricing());
  const [editDialog, setEditDialog] = useState(false);
  const [historyDialog, setHistoryDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ open: false, title: '', message: '', onConfirm: () => {} });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const [auditLog, setAuditLog] = useState(getPricingAuditLog());

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SubscriptionPricing>({
    resolver: yupResolver(schema),
    defaultValues: pricing,
  });

  useEffect(() => {
    reset(pricing);
  }, [pricing, reset]);

  const handleEditClick = () => {
    setEditDialog(true);
  };

  const handleSave = (data: SubscriptionPricing) => {
    const changes = Object.keys(data).reduce((acc, key) => {
      const typedKey = key as keyof SubscriptionPricing;
      if (data[typedKey] !== pricing[typedKey]) {
        acc[typedKey] = data[typedKey];
      }
      return acc;
    }, {} as Partial<SubscriptionPricing>);

    if (Object.keys(changes).length === 0) {
      setSnackbar({
        open: true,
        message: 'No changes detected',
        severity: 'info',
      });
      setEditDialog(false);
      return;
    }

    const changesList = Object.entries(changes)
      .map(([key, value]) => `${key}: ${formatPrice(value as number)}`)
      .join(', ');

    setConfirmDialog({
      open: true,
      title: 'Confirm Price Changes',
      message: `Are you sure you want to update the following prices?\n\n${changesList}\n\nThese changes will be reflected immediately across the platform.`,
      onConfirm: () => {
        const updated = updateSubscriptionPricing(changes);
        setPricing(updated);
        setAuditLog(getPricingAuditLog());
        setEditDialog(false);
        setConfirmDialog({ ...confirmDialog, open: false });
        setSnackbar({
          open: true,
          message: 'Subscription pricing updated successfully',
          severity: 'success',
        });
      },
    });
  };

  const handleCancel = () => {
    reset(pricing);
    setEditDialog(false);
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const pricingCards = [
    {
      title: 'Contact Pass',
      description: 'Unlimited seller contact access',
      price: pricing.contactPassPrice,
      duration: pricing.contactPassDuration,
      durationLabel: 'days',
      icon: <Payment color="primary" />,
    },
    {
      title: 'Listing Fee',
      description: 'Post and promote listings',
      price: pricing.listingPrice,
      duration: pricing.listingDuration,
      durationLabel: 'days',
      icon: <Payment color="secondary" />,
    },
    {
      title: 'View Contacts Addon',
      description: 'See interested buyer contacts',
      price: pricing.viewContactsAddonPrice,
      duration: null,
      durationLabel: 'one-time',
      icon: <Payment color="success" />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Subscription Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage pricing for platform subscriptions and services
          </Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<History />}
            onClick={() => setHistoryDialog(true)}
          >
            View History
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEditClick}
          >
            Edit Pricing
          </Button>
        </Box>
      </Box>

      {/* Current Pricing Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {pricingCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {formatPrice(card.price)}
                </Typography>
                <Chip
                  size="small"
                  label={card.duration ? `${card.duration} ${card.durationLabel}` : card.durationLabel}
                  color="primary"
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Changes */}
      {auditLog.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Recent Changes
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Changes Made</TableCell>
                  <TableCell>Updated By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLog.slice(-5).reverse().map((log: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                    <TableCell>
                      {Object.entries(log.changes).map(([key, value]: [string, any]) => (
                        <Chip
                          key={key}
                          size="small"
                          label={`${key}: ${formatPrice(value)}`}
                          color="info"
                          variant="outlined"
                          sx={{ mr: 1, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>{log.updatedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Edit Pricing Dialog */}
      <Dialog open={editDialog} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>Edit Subscription Pricing</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Important Notice
              </Typography>
              <Typography variant="body2">
                Price changes will be reflected immediately across the platform. All new transactions will use the updated pricing.
              </Typography>
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="contactPassPrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contact Pass Price"
                      type="number"
                      error={!!errors.contactPassPrice}
                      helperText={errors.contactPassPrice?.message || 'Price for 15-day contact access'}
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="contactPassDuration"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contact Pass Duration (Days)"
                      type="number"
                      error={!!errors.contactPassDuration}
                      helperText={errors.contactPassDuration?.message || 'Validity period in days'}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="listingPrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Listing Fee"
                      type="number"
                      error={!!errors.listingPrice}
                      helperText={errors.listingPrice?.message || 'One-time fee to post a listing'}
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="listingDuration"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Listing Duration (Days)"
                      type="number"
                      error={!!errors.listingDuration}
                      helperText={errors.listingDuration?.message || 'How long listing stays active'}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="viewContactsAddonPrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="View Contacts Addon Price"
                      type="number"
                      error={!!errors.viewContactsAddonPrice}
                      helperText={errors.viewContactsAddonPrice?.message || 'Price to see interested buyer contacts'}
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
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialog} onClose={() => setHistoryDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Pricing Change History</DialogTitle>
        <DialogContent>
          {auditLog.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <History sx={{ fontSize: '3rem', color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No pricing changes yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All pricing changes will be logged here for audit purposes
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Field Changed</TableCell>
                    <TableCell>Previous Value</TableCell>
                    <TableCell>New Value</TableCell>
                    <TableCell>Updated By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLog.reverse().map((log: any, logIndex: number) =>
                    Object.entries(log.changes).map(([field, newValue]: [string, any], fieldIndex: number) => (
                      <TableRow key={`${logIndex}-${fieldIndex}`}>
                        <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {field}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatPrice(log.previousValues[field])}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {formatPrice(newValue)}
                          </Typography>
                        </TableCell>
                        <TableCell>{log.updatedBy}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        confirmText="Update Pricing"
        destructive={false}
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

export default SubscriptionManagement;