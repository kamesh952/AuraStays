import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Bed, Restaurant, Pool, Wifi } from '@mui/icons-material';
import { cardStyle, formStyle } from '../styles';

const ParticleBackground = () => {
  const drawParticles = useCallback((canvas) => {
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 80;
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Update positions
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary checks
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <canvas
      ref={drawParticles}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)'
      }}
    />
  );
};

const FloatingIcons = ({ isMobile }) => {
  const icons = [
    { icon: <Bed />, size: isMobile ? 30 : 40, speed: 1.5, left: '10%', top: '20%' },
    { icon: <Restaurant />, size: isMobile ? 25 : 35, speed: 2, left: '85%', top: '30%' },
    { icon: <Pool />, size: isMobile ? 35 : 45, speed: 1, left: '15%', top: '70%' },
    { icon: <Wifi />, size: isMobile ? 20 : 30, speed: 2.5, left: '80%', top: '60%' }
  ];
  
  return (
    <>
      {icons.map((item, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            color: 'rgba(255, 255, 255, 0.15)',
            fontSize: `${item.size}px`,
            animation: `float ${10/item.speed}s ease-in-out infinite`,
            animationDelay: `${index}s`,
            left: item.left,
            top: item.top,
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(-20px) rotate(5deg)' }
            }
          }}
        >
          {item.icon}
        </Box>
      ))}
    </>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      padding: isMobile ? '16px' : '24px'
    }}>
      <ParticleBackground />
      <FloatingIcons isMobile={isMobile} />
      
      <Paper sx={{ 
        ...cardStyle, 
        width: isMobile ? '100%' : isTablet ? '75%' : 400,
        maxWidth: 400,
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        padding: isMobile ? '20px' : '30px'
      }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" gutterBottom sx={{ color: '#3f37c9' }}>
          Hotel Management
        </Typography>
        <Typography variant="body1" align="center" sx={{ 
          mb: 3, 
          color: 'text.secondary',
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{
          ...formStyle,
          '& .MuiTextField-root': {
            marginBottom: isMobile ? '12px' : '16px'
          }
        }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            size={isMobile ? 'small' : 'medium'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" fontSize={isMobile ? 'small' : 'medium'} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            size={isMobile ? 'small' : 'medium'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" fontSize={isMobile ? 'small' : 'medium'} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size={isMobile ? 'small' : 'medium'}
                  >
                    {showPassword ? 
                      <VisibilityOff color="primary" fontSize={isMobile ? 'small' : 'medium'} /> : 
                      <Visibility color="primary" fontSize={isMobile ? 'small' : 'medium'} />
                    }
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size={isMobile ? 'medium' : 'large'}
            disabled={loading}
            sx={{ 
              mt: isMobile ? 2 : 3, 
              mb: isMobile ? 1 : 2,
              background: 'linear-gradient(45deg, #4361ee 0%, #3f37c9 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3f37c9 0%, #4361ee 100%)'
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          <Typography variant="body2" align="center" sx={{ 
            color: 'text.secondary',
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}>
            Don't have an account?{' '}
            <Link href="/register" underline="hover" color="primary">
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}