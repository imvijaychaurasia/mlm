import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../core/state/auth.store';
import { getAuthAdapter } from '../../../adapters/registry';
import { ROUTES } from '../../../core/config/app.config';

const schema = yup.object().shape({
  otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
});

type FormData = {
  otp: string;
};

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, setToken } = useAuthStore();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const phone = (location.state as any)?.phone || user?.phone;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    if (!phone) {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Send initial OTP
    sendOTP();
  }, [phone, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOTP = async () => {
    if (!phone) return;

    setResending(true);
    setError(null);

    try {
      const authAdapter = getAuthAdapter();
      const result = await authAdapter.sendOTP(phone);
      
      setSuccess(result.message);
      setCountdown(30); // 30-second countdown
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!phone) return;

    setLoading(true);
    setError(null);

    try {
      const authAdapter = getAuthAdapter();
      const result = await authAdapter.verifyOTP({
        phone,
        otp: data.otp,
      });
      
      setUser(result.user);
      setToken(result.token);
      
      navigate(ROUTES.HOME);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!phone) {
    return null; // Will redirect to login
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Verify Phone Number
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We've sent a 6-digit code to
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            {phone}
          </Typography>
        </Box>

        {/* reCAPTCHA container for Firebase Phone Auth */}
        <div id="recaptcha-container" style={{ display: 'none' }}></div>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Enter 6-digit OTP"
                margin="normal"
                error={!!errors.otp}
                helperText={errors.otp?.message}
                autoComplete="one-time-code"
                autoFocus
                inputProps={{
                  maxLength: 6,
                  style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' },
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  field.onChange(value);
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify Phone Number'}
          </Button>
        </form>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Didn't receive the code?
          </Typography>
          
          {countdown > 0 ? (
            <Typography variant="body2" color="text.secondary">
              Resend OTP in {countdown} seconds
            </Typography>
          ) : (
            <Button
              variant="text"
              onClick={sendOTP}
              disabled={resending}
              startIcon={resending ? <CircularProgress size={16} /> : null}
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </Button>
          )}
        </Box>

        {/* Demo info */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'info.light',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'info.main',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Demo Mode:
          </Typography>
          <Typography variant="body2">
            Use OTP: <strong>123456</strong> to verify any phone number
          </Typography>
        </Box>

        <Box textAlign="center" mt={3}>
          <Button
            variant="text"
            onClick={() => navigate(ROUTES.HOME)}
          >
            Skip for now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyPage;