import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: 'draft' | 'pending_payment' | 'active' | 'suspended' | 'deleted' | 'sold' | 'expired' | 'fulfilled' | 'cancelled';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, ...props }) => {
  const getStatusColor = (status: string): ChipProps['color'] => {
    switch (status) {
      case 'active':
      case 'fulfilled':
        return 'success';
      case 'pending_payment':
      case 'expired':
        return 'warning';
      case 'suspended':
      case 'deleted':
      case 'cancelled':
        return 'error';
      case 'sold':
        return 'info';
      case 'draft':
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending_payment':
        return 'Pending Payment';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      size="small"
      {...props}
    />
  );
};