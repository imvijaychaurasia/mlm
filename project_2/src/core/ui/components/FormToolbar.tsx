import React from 'react';
import { Paper, Stack, Button, useTheme } from '@mui/material';

interface FormToolbarProps {
  onCancel?: () => void;
  onSave?: () => void;
  cancelLabel?: string;
  saveLabel?: string;
  saveDisabled?: boolean;
  loading?: boolean;
}

export const FormToolbar: React.FC<FormToolbarProps> = ({
  onCancel,
  onSave,
  cancelLabel = 'Cancel',
  saveLabel = 'Save',
  saveDisabled = false,
  loading = false,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        position: 'sticky',
        bottom: 0,
        p: theme.spacing(2),
        mt: theme.spacing(4),
        borderRadius: 0,
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
        )}
        {onSave && (
          <Button
            variant="contained"
            onClick={onSave}
            disabled={saveDisabled || loading}
          >
            {loading ? 'Saving...' : saveLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};