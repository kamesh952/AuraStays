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
  FormControlLabel,
  Switch
} from '@mui/material';

// In-memory storage helpers
let roomsStore = [

];

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// RoomForm Component with modern styling
const RoomForm = ({ room, onSave, onCancel, isEditing, loading }) => {
  const [formData, setFormData] = useState({
    name: room?.name || '',
    type: room?.type || '',
    capacity: room?.capacity || 1,
    pricePerNight: room?.pricePerNight || '',
    amenities: room?.amenities || [],
    isAvailable: room?.isAvailable ?? true,
    description: room?.description || ''
  });

  const [errors, setErrors] = useState({});
  const [amenityInput, setAmenityInput] = useState('');

  const roomTypes = [
    'standard',
    'deluxe',
    'suite',
    'executive',
    'presidential',
    'family'
  ];

  const commonAmenities = [
    'Wi-Fi',
    'Air Conditioning',
    'TV',
    'Mini Bar',
    'Room Service',
    'Balcony',
    'Ocean View',
    'City View',
    'Kitchenette',
    'Jacuzzi',
    'Safe',
    'Hair Dryer'
  ];

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || '',
        type: room.type || '',
        capacity: room.capacity || 1,
        pricePerNight: room.pricePerNight || '',
        amenities: room.amenities || [],
        isAvailable: room.isAvailable ?? true,
        description: room.description || ''
      });
    }
  }, [room]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Room type is required';
    }
    
    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    
    if (!formData.pricePerNight || formData.pricePerNight <= 0) {
      newErrors.pricePerNight = 'Price per night must be greater than 0';
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
        type: '',
        capacity: 1,
        pricePerNight: '',
        amenities: [],
        isAvailable: true,
        description: ''
      });
      setErrors({});
      setAmenityInput('');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }));
  };

  const handleAmenityKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAmenity();
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
        {isEditing ? 'Edit Room' : 'Create New Room'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Room Name */}
        <TextField
          fullWidth
          placeholder="Room Name"
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

        {/* Room Type */}
        <FormControl fullWidth>
          <Select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            displayEmpty
            error={!!errors.type}
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
                color: formData.type ? '#2c3e50' : '#95a5a6',
              }
            }}
          >
            <MenuItem value="" disabled>
              <Typography sx={{ color: '#95a5a6' }}>Room Type</Typography>
            </MenuItem>
            {roomTypes.map((type) => (
              <MenuItem key={type} value={type} sx={{ py: 1.5 }}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {errors.type && (
            <Typography variant="caption" color="error" sx={{ ml: 1, mt: 0.5 }}>
              {errors.type}
            </Typography>
          )}
        </FormControl>

        {/* Capacity and Price Row */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 1)}
              error={!!errors.capacity}
              helperText={errors.capacity}
              inputProps={{ min: 1, max: 20 }}
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
                  '&::placeholder': {
                    color: '#95a5a6',
                    opacity: 1
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Price per Night ($)"
              type="number"
              value={formData.pricePerNight}
              onChange={(e) => handleChange('pricePerNight', parseFloat(e.target.value) || '')}
              error={!!errors.pricePerNight}
              helperText={errors.pricePerNight}
              inputProps={{ min: 0, step: 0.01 }}
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
                  '&::placeholder': {
                    color: '#95a5a6',
                    opacity: 1
                  }
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Amenities Section */}
        <Box>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2, fontSize: '14px' }}>
            Amenities
          </Typography>
          
          {/* Add Amenity Input */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Add amenity"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyPress={handleAmenityKeyPress}
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
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#2c3e50',
                  '&::placeholder': {
                    color: '#95a5a6',
                    opacity: 1
                  }
                }
              }}
            />
            <Button
              onClick={handleAddAmenity}
              variant="outlined"
              sx={{
                borderRadius: '12px',
                borderColor: '#e0e6ed',
                color: '#2c3e50',
                '&:hover': {
                  borderColor: '#3498db',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              Add
            </Button>
          </Box>

          {/* Quick Add Common Amenities */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#95a5a6', mb: 1, display: 'block' }}>
              Quick add:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {commonAmenities.filter(amenity => !formData.amenities.includes(amenity)).slice(0, 6).map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  onClick={() => handleChange('amenities', [...formData.amenities, amenity])}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#e0e6ed',
                    color: '#7f8c8d',
                    '&:hover': {
                      borderColor: '#3498db',
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Current Amenities */}
          {formData.amenities.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.amenities.map((amenity, index) => (
                <Chip
                  key={index}
                  label={amenity}
                  onDelete={() => handleRemoveAmenity(amenity)}
                  color="primary"
                  size="small"
                  sx={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Availability Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.isAvailable}
              onChange={(e) => handleChange('isAvailable', e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography sx={{ color: '#2c3e50', fontSize: '16px' }}>
              Available for booking
            </Typography>
          }
        />

        {/* Description */}
        <TextField
          fullWidth
          placeholder="Room Description"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
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
          {loading ? 'Processing...' : (isEditing ? 'Update Room' : 'Create Room')}
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

// RoomList Component
const RoomList = ({ rooms, onDelete, onEdit, loading }) => {
  if (rooms.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
        <Typography variant="h6" color="text.secondary">
          No rooms added yet.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add your first room using the form above.
        </Typography>
      </Paper>
    );
  }

  const getRoomTypeColor = (type) => {
    switch (type) {
      case 'standard': return '#95a5a6';
      case 'deluxe': return '#3498db';
      case 'suite': return '#9b59b6';
      case 'executive': return '#e67e22';
      case 'presidential': return '#e74c3c';
      case 'family': return '#27ae60';
      default: return '#34495e';
    }
  };

  return (
    <Box>
      <Paper sx={{ mb: 2, p: 2, borderRadius: '12px' }}>
        <Typography variant="h6">
          Rooms ({rooms.length} {rooms.length === 1 ? 'room' : 'rooms'})
        </Typography>
      </Paper>
      
      <Grid container spacing={2}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {room.name}
                  </Typography>
                  <Chip
                    label={room.isAvailable ? 'Available' : 'Unavailable'}
                    color={room.isAvailable ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                
                <Chip
                  label={room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                  size="small"
                  sx={{
                    backgroundColor: getRoomTypeColor(room.type),
                    color: 'white',
                    mb: 2
                  }}
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  👥 Capacity: {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  💰 ${room.pricePerNight}/night
                </Typography>
                
                {room.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {room.description}
                  </Typography>
                )}
                
                {room.amenities && room.amenities.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '11px' }}
                      />
                    ))}
                    {room.amenities.length > 3 && (
                      <Chip
                        label={`+${room.amenities.length - 3} more`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '11px' }}
                      />
                    )}
                  </Box>
                )}
              </CardContent>
              
              <Divider />
              
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onEdit(room)}
                  sx={{ borderRadius: '8px' }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onDelete(room._id)}
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

// Main RoomsPage Component
export default function RoomsPage() {
  const [rooms, setRooms] = useState(roomsStore);
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSave = (roomData) => {
    setLoading(true);
    setError(null);
    try {
      let updatedRooms;
      
      if (editingRoom) {
        updatedRooms = roomsStore.map(room => 
          room._id === editingRoom._id 
            ? { ...roomData, _id: editingRoom._id, updatedAt: new Date().toISOString() }
            : room
        );
        setSuccessMessage('Room updated successfully!');
        setEditingRoom(null);
      } else {
        const newRoom = {
          ...roomData,
          _id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedRooms = [...roomsStore, newRoom];
        setSuccessMessage('Room added successfully!');
      }
      
      roomsStore = updatedRooms;
      setRooms(updatedRooms);
    } catch (error) {
      console.error('Error saving room:', error);
      setError('Failed to save room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (roomId) => {
    setRoomToDelete(roomId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!roomToDelete) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedRooms = roomsStore.filter(room => room._id !== roomToDelete);
      roomsStore = updatedRooms;
      setRooms(updatedRooms);
      setSuccessMessage('Room deleted successfully!');
    } catch (error) {
      console.error('Error deleting room:', error);
      setError('Failed to delete room. Please try again.');
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setRoomToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setRoomToDelete(null);
  };

  const handleEdit = (room) => {
    if (!room?._id) {
      setError('Invalid room data for editing');
      return;
    }
    setEditingRoom(room);
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
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
            Skyline Stays Room Manager
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage Your Hotel Rooms with Ease
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
              Are you sure you want to delete this room? This action cannot be undone.
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
          <RoomForm
            room={editingRoom}
            onSave={handleSave}
            onCancel={editingRoom ? handleCancelEdit : null}
            isEditing={!!editingRoom}
            loading={loading}
          />
        </Paper>

        {/* List Section */}
        <Box sx={{ width: '100%' }}>
          <RoomList
            rooms={rooms}
            onDelete={handleDeleteClick}
            onEdit={handleEdit}
            loading={loading}
          />
        </Box>
      </Box>
    </Box>
  );
}