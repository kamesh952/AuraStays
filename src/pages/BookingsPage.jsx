import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  useMediaQuery, 
  useTheme,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Divider,
  Autocomplete
} from '@mui/material';

// In-memory storage helpers (replacing localStorage)
let bookingsStore = [];
let guestsStore = [
  { name: 'John Smith', email: 'john@example.com' },
  { name: 'Sarah Johnson', email: 'sarah@example.com' },
  { name: 'Michael Brown', email: 'michael@example.com' },
  { name: 'Emily Davis', email: 'emily@example.com' }
];

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// BookingForm Component with modern styling
const BookingForm = ({ booking, onSave, onCancel, isEditing, loading, guests }) => {
  const [formData, setFormData] = useState({
    guestName: booking?.guestName || '',
    checkInDate: booking?.checkInDate || '',
    checkOutDate: booking?.checkOutDate || '',
    roomType: booking?.roomType || '',
    numberOfGuests: booking?.numberOfGuests || 1,
    specialRequests: booking?.specialRequests || '',
    status: booking?.status || 'confirmed'
  });

  const [errors, setErrors] = useState({});

  // Get guest options for autocomplete
  const guestOptions = guests.map(guest => ({
    label: guest.name,
    value: guest.name,
    email: guest.email
  }));

  const roomTypes = [
    'Standard Single',
    'Standard Double',
    'Deluxe Room',
    'Executive Suite',
    'Presidential Suite',
    'Family Room'
  ];

  useEffect(() => {
    if (booking) {
      setFormData({
        guestName: booking.guestName || '',
        checkInDate: booking.checkInDate || '',
        checkOutDate: booking.checkOutDate || '',
        roomType: booking.roomType || '',
        numberOfGuests: booking.numberOfGuests || 1,
        specialRequests: booking.specialRequests || '',
        status: booking.status || 'confirmed'
      });
    }
  }, [booking]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    
    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }
    
    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    }
    
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Check-out date must be after check-out date';
      }
    }
    
    if (!formData.roomType) {
      newErrors.roomType = 'Room type is required';
    }
    
    if (formData.numberOfGuests < 1) {
      newErrors.numberOfGuests = 'Number of guests must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onSave(formData);
    if (!isEditing) {
      setFormData({
        guestName: '',
        checkInDate: '',
        checkOutDate: '',
        roomType: '',
        numberOfGuests: 1,
        specialRequests: '',
        status: 'confirmed'
      });
      setErrors({});
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', p: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          fontWeight: 600, 
          color: '#2c3e50', 
          textAlign: 'center', 
          mb: 5,
          fontSize: { xs: '28px', sm: '32px' }
        }}
      >
        {isEditing ? 'Edit Booking' : 'Create New Booking'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Guest Selection */}
        <Autocomplete
          options={guestOptions}
          getOptionLabel={(option) => option.label || ''}
          value={guestOptions.find(option => option.value === formData.guestName) || null}
          onChange={(event, newValue) => {
            handleChange('guestName', newValue ? newValue.value : '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Guest"
              required
              error={!!errors.guestName}
              helperText={errors.guestName}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  '& fieldset': {
                    borderColor: '#e0e6ed',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3498db',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3498db',
                  },
                },
                '& .MuiInputLabel-root': {
                  display: 'none'
                },
                '& .MuiOutlinedInput-input': {
                  padding: '16px 20px',
                  fontSize: '16px',
                  color: '#2c3e50',
                  '&::placeholder': {
                    color: '#95a5a6',
                    opacity: 1
                  }
                }
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ p: 1.5 }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                  {option.label}
                </Typography>
                {option.email && (
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '14px' }}>
                    {option.email}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          sx={{
            '& .MuiAutocomplete-popupIndicator': {
              color: '#95a5a6'
            }
          }}
        />

        {/* Room Selection */}
        <FormControl fullWidth>
          <Select
            value={formData.roomType}
            onChange={(e) => handleChange('roomType', e.target.value)}
            displayEmpty
            error={!!errors.roomType}
            required
            sx={{
              borderRadius: '12px',
              backgroundColor: 'white',
              fontSize: '16px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e6ed',
                borderWidth: '2px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3498db',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3498db',
              },
              '& .MuiSelect-select': {
                padding: '16px 20px',
                color: formData.roomType ? '#2c3e50' : '#95a5a6',
              }
            }}
          >
            <MenuItem value="" disabled>
              <Typography sx={{ color: '#95a5a6' }}>Room</Typography>
            </MenuItem>
            {roomTypes.map((type) => (
              <MenuItem key={type} value={type} sx={{ py: 1.5 }}>
                {type}
              </MenuItem>
            ))}
          </Select>
          {errors.roomType && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.roomType}
            </Typography>
          )}
        </FormControl>

        {/* Check-in Date */}
        <Box>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1, fontSize: '14px' }}>
            Check-in Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={formData.checkInDate}
            onChange={(e) => handleChange('checkInDate', e.target.value)}
            error={!!errors.checkInDate}
            helperText={errors.checkInDate}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: '#e0e6ed',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: '#3498db',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3498db',
                },
              },
              '& .MuiInputLabel-root': {
                display: 'none'
              },
              '& .MuiOutlinedInput-input': {
                padding: '16px 20px',
                fontSize: '16px',
                color: '#2c3e50',
              }
            }}
          />
        </Box>

        {/* Check-out Date */}
        <Box>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1, fontSize: '14px' }}>
            Check-out Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={formData.checkOutDate}
            onChange={(e) => handleChange('checkOutDate', e.target.value)}
            error={!!errors.checkOutDate}
            helperText={errors.checkOutDate}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: '#e0e6ed',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: '#3498db',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3498db',
                },
              },
              '& .MuiInputLabel-root': {
                display: 'none'
              },
              '& .MuiOutlinedInput-input': {
                padding: '16px 20px',
                fontSize: '16px',
                color: '#2c3e50',
              }
            }}
          />
        </Box>

        {/* Special Requests */}
        <TextField
          fullWidth
          placeholder="Special Requests"
          multiline
          rows={4}
          value={formData.specialRequests}
          onChange={(e) => handleChange('specialRequests', e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: '#e0e6ed',
                borderWidth: '2px',
              },
              '&:hover fieldset': {
                borderColor: '#3498db',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3498db',
              },
            },
            '& .MuiInputLabel-root': {
              display: 'none'
            },
            '& .MuiOutlinedInput-input': {
              padding: '16px 20px',
              fontSize: '16px',
              color: '#2c3e50',
              '&::placeholder': {
                color: '#95a5a6',
                opacity: 1
              }
            }
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          disabled={loading}
          sx={{
            mt: 2,
            py: 2,
            borderRadius: '12px',
            backgroundColor: loading ? '#bdc3c7' : '#34495e',
            color: 'white',
            fontSize: '16px',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: loading ? '#bdc3c7' : '#2c3e50',
            },
            '&:disabled': {
              backgroundColor: '#bdc3c7',
              color: 'white'
            }
          }}
        >
          {loading ? 'Processing...' : (isEditing ? 'Update Booking' : 'Create Booking')}
        </Button>

        {isEditing && onCancel && (
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={onCancel}
            sx={{
              py: 2,
              borderRadius: '12px',
              borderColor: '#e0e6ed',
              color: '#7f8c8d',
              fontSize: '16px',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#bdc3c7',
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

// BookingList Component
const BookingList = ({ bookings, onDelete, onEdit, loading }) => {
  if (bookings.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
        <Typography variant="h6" color="text.secondary">
          No bookings added yet.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add your first booking using the form above.
        </Typography>
      </Paper>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'checked-in': return 'info';
      case 'checked-out': return 'default';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box>
      <Paper sx={{ mb: 2, p: 2, borderRadius: '12px' }}>
        <Typography variant="h6">
          Bookings ({bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'})
        </Typography>
      </Paper>
      
      <Grid container spacing={2}>
        {bookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {booking.guestName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  🏨 {booking.roomType}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  📅 {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                  {calculateNights(booking.checkInDate, booking.checkOutDate) > 0 && (
                    <span> ({calculateNights(booking.checkInDate, booking.checkOutDate)} nights)</span>
                  )}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  👥 {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'guest' : 'guests'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </Box>
                
                {booking.specialRequests && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Special Requests:</strong> {booking.specialRequests}
                    </Typography>
                  </Box>
                )}
              </CardContent>
              
              <Divider />
              
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onEdit(booking)}
                  sx={{ borderRadius: '8px' }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onDelete(booking._id)}
                  disabled={loading}
                  sx={{ borderRadius: '8px' }}
                >
                  {loading ? <CircularProgress size={16} /> : 'Delete'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Main BookingsPage Component
export default function BookingsPage() {
  const [bookings, setBookings] = useState(bookingsStore);
  const [guests, setGuests] = useState(guestsStore);
  const [editingBooking, setEditingBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSave = (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      let updatedBookings;
      
      if (editingBooking) {
        updatedBookings = bookingsStore.map(booking => 
          booking._id === editingBooking._id 
            ? { ...bookingData, _id: editingBooking._id, updatedAt: new Date().toISOString() }
            : booking
        );
        setSuccessMessage('Booking updated successfully!');
        setEditingBooking(null);
      } else {
        const newBooking = {
          ...bookingData,
          _id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedBookings = [...bookingsStore, newBooking];
        setSuccessMessage('Booking added successfully!');
      }
      
      bookingsStore = updatedBookings;
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error saving booking:', error);
      setError('Failed to save booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (bookingId) => {
    setBookingToDelete(bookingId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!bookingToDelete) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedBookings = bookingsStore.filter(booking => booking._id !== bookingToDelete);
      bookingsStore = updatedBookings;
      setBookings(updatedBookings);
      setSuccessMessage('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Failed to delete booking. Please try again.');
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setBookingToDelete(null);
  };

  const handleEdit = (booking) => {
    if (!booking?._id) {
      setError('Invalid booking data for editing');
      return;
    }
    setEditingBooking(booking);
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: isMobile ? 2 : 4,
    }}>
      <Box sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Page Header */}
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center', borderRadius: '16px' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Skyline Stays Booking Manager
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Take Your Best your Residency Ever
          </Typography>
        </Paper>

        {/* Notifications */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={handleDeleteCancel}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '16px'
            }
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error"
              autoFocus
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Guest Count Warning */}
        {guests.length === 0 && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
            No guests registered yet. Please register guests first to create bookings.
          </Alert>
        )}

        {/* Form Section */}
        <Paper elevation={3} sx={{ mb: 4, borderRadius: '16px' }}>
          <BookingForm
            booking={editingBooking}
            onSave={handleSave}
            onCancel={editingBooking ? handleCancelEdit : null}
            isEditing={!!editingBooking}
            loading={loading}
            guests={guests}
          />
        </Paper>

        {/* List Section */}
        <Box sx={{ width: '100%' }}>
          <BookingList
            bookings={bookings}
            onDelete={handleDeleteClick}
            onEdit={handleEdit}
            loading={loading}
          />
        </Box>
      </Box>
    </Box>
  );
}