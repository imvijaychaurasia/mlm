import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Search, Clear, FilterList } from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  filters?: Array<{ label: string; value: string }>;
  onFilterChange?: (filters: string[]) => void;
  onSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  suggestions = [],
  filters = [],
  onFilterChange,
  onSearch,
}) => {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);

  const handleFilterChange = (newFilters: string[]) => {
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch?.();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {value && (
                <IconButton
                  size="small"
                  onClick={() => onChange('')}
                  edge="end"
                >
                  <Clear />
                </IconButton>
              )}
              {filters.length > 0 && (
                <IconButton size="small" edge="end">
                  <FilterList />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'background.paper',
            },
          },
        }}
      />
      
      {selectedFilters.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {selectedFilters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              size="small"
              onDelete={() => {
                const newFilters = selectedFilters.filter(f => f !== filter);
                handleFilterChange(newFilters);
              }}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Box>
  );
};