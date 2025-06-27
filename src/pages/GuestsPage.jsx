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
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Divider
} from '@mui/material';

// In-memory storage helpers (replacing localStorage)
let guestsStore = [
  ];

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// GuestForm Component with modern styling
const GuestForm = ({ guest, onSave, onCancel, isEditing, loading }) => {
  const [formData, setFormData] = useState({
    name: guest?.name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    attending: guest?.attending || 'pending',
    dietaryRestrictions: guest?.dietaryRestrictions || '',
    plusOne: guest?.plusOne || false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name || '',
        email: guest.email || '',
        phone: guest.phone || '',
        attending: guest.attending || 'pending',
        dietaryRestrictions: guest.dietaryRestrictions || '',
        plusOne: guest.plusOne || false
      });
    }
  }, [guest]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
        name: '',
        email: '',
        phone: '',
        attending: 'pending',
        dietaryRestrictions: '',
        plusOne: false
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
        {isEditing ? 'Edit Guest' : 'Add New Guest'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Name Field */}
        <TextField
          fullWidth
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          required
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

        {/* Email Field */}
        <TextField
          fullWidth
          placeholder="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
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

        {/* Phone Field */}
        <TextField
          fullWidth
          placeholder="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
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

        {/* Attending Status */}
        <Box>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1, fontSize: '14px' }}>
            Attendance Status
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.attending}
              onChange={(e) => handleChange('attending', e.target.value)}
              displayEmpty
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
                  color: '#2c3e50',
                }
              }}
            >
              <MenuItem value="pending" sx={{ py: 1.5 }}>Pending Response</MenuItem>
              <MenuItem value="yes" sx={{ py: 1.5 }}>Attending</MenuItem>
              <MenuItem value="no" sx={{ py: 1.5 }}>Not Attending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Dietary Restrictions */}
        <TextField
          fullWidth
          placeholder="Dietary Restrictions or Special Requests"
          multiline
          rows={4}
          value={formData.dietaryRestrictions}
          onChange={(e) => handleChange('dietaryRestrictions', e.target.value)}
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

        {/* Plus One Checkbox */}
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          border: '2px solid #e0e6ed',
          p: 2
        }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.plusOne}
                onChange={(e) => handleChange('plusOne', e.target.checked)}
                sx={{
                  color: '#95a5a6',
                  '&.Mui-checked': {
                    color: '#3498db',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: '#2c3e50', fontSize: '16px' }}>
                Plus One (+1)
              </Typography>
            }
          />
        </Box>

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
          {loading ? 'Processing...' : (isEditing ? 'Update Guest' : 'Add Guest')}
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

// GuestList Component
const GuestList = ({ guests, onDelete, onEdit, loading }) => {
  if (guests.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
        <Typography variant="h6" color="text.secondary">
          No guests added yet.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add your first guest using the form above.
        </Typography>
      </Paper>
    );
  }

  const getAttendingColor = (status) => {
    switch (status) {
      case 'yes': return 'success';
      case 'no': return 'error';
      default: return 'warning';
    }
  };

  const getAttendingLabel = (status) => {
    switch (status) {
      case 'yes': return 'Attending';
      case 'no': return 'Not Attending';
      default: return 'Pending';
    }
  };

  return (
    <Box>
      <Paper sx={{ mb: 2, p: 2, borderRadius: '12px' }}>
        <Typography variant="h6">
          Guest List ({guests.length} {guests.length === 1 ? 'guest' : 'guests'})
        </Typography>
      </Paper>
      
      <Grid container spacing={2}>
        {guests.map((guest) => (
          <Grid item xs={12} sm={6} md={4} key={guest._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {guest.name}
                </Typography>

                {guest.email && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    📧 {guest.email}
                  </Typography>
                )}

                {guest.phone && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    📞 {guest.phone}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={getAttendingLabel(guest.attending)}
                    color={getAttendingColor(guest.attending)}
                    size="small"
                  />
                  {guest.plusOne && (
                    <Chip
                      label="+1"
                      color="info"
                      size="small"
                    />
                  )}
                </Box>

                {guest.dietaryRestrictions && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Dietary:</strong> {guest.dietaryRestrictions}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <Divider />

              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onEdit(guest)}
                  sx={{ borderRadius: '8px' }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onDelete(guest._id)}
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

// Main GuestsPage Component
export default function GuestsPage() {
  const [guests, setGuests] = useState(guestsStore);
  const [editingGuest, setEditingGuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSave = (guestData) => {
    setLoading(true);
    setError(null);
    try {
      let updatedGuests;
      
      if (editingGuest) {
        updatedGuests = guestsStore.map(guest => 
          guest._id === editingGuest._id 
            ? { ...guestData, _id: editingGuest._id, updatedAt: new Date().toISOString() }
            : guest
        );
        setSuccessMessage('Guest updated successfully!');
        setEditingGuest(null);
      } else {
        const newGuest = {
          ...guestData,
          _id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedGuests = [...guestsStore, newGuest];
        setSuccessMessage('Guest added successfully!');
      }
      
      guestsStore = updatedGuests;
      setGuests(updatedGuests);
    } catch (error) {
      console.error('Error saving guest:', error);
      setError('Failed to save guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (guestId) => {
    setGuestToDelete(guestId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!guestToDelete) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedGuests = guestsStore.filter(guest => guest._id !== guestToDelete);
      guestsStore = updatedGuests;
      setGuests(updatedGuests);
      setSuccessMessage('Guest deleted successfully!');
    } catch (error) {
      console.error('Error deleting guest:', error);
      setError('Failed to delete guest. Please try again.');
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setGuestToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setGuestToDelete(null);
  };

  const handleEdit = (guest) => {
    if (!guest?._id) {
      setError('Invalid guest data for editing');
      return;
    }
    setEditingGuest(guest);
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingGuest(null);
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
            Skyline Stays Guest Manager
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
              Are you sure you want to delete this guest? This action cannot be undone.
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

        {/* Form Section */}
        <Paper elevation={3} sx={{ mb: 4, borderRadius: '16px' }}>
          <GuestForm
            guest={editingGuest}
            onSave={handleSave}
            onCancel={editingGuest ? handleCancelEdit : null}
            isEditing={!!editingGuest}
            loading={loading}
          />
        </Paper>

        {/* List Section */}
        <Box sx={{ width: '100%' }}>
          <GuestList
            guests={guests}
            onDelete={handleDeleteClick}
            onEdit={handleEdit}
            loading={loading}
          />
        </Box>
      </Box>
    </Box>
  );
}