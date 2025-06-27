import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  styled,
  Badge,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StyledAppBar = styled(AppBar)(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}15 0%, 
    ${theme.palette.background.paper} 50%, 
    ${theme.palette.secondary.main}10 100%)`,
  backdropFilter: "blur(20px)",
  color: theme.palette.text.primary,
  boxShadow: `
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  borderRadius: 0, // ensure straight edges

  transition: theme.transitions.create(["width", "margin", "box-shadow"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  "&:hover": {
    boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.15),
      0 1px 3px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
  },
  ...(open && {
    marginLeft: 240,
    width: "calc(100% - 240px)",
    transition: theme.transitions.create(["width", "margin", "box-shadow"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: "72px !important",
  padding: theme.spacing(0, 3),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(0, 2),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0, 1),
    minHeight: "64px !important",
  },
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.75rem",
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  letterSpacing: "-0.5px",
  [theme.breakpoints.down("md")]: {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
    marginRight: theme.spacing(1), // Ensure title doesn't get cut off
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px", // Limits title width on smallest screens
  },
}));

const GrowDiv = styled("div")({
  flexGrow: 1,
});
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: "12px",
  padding: theme.spacing(1.5),
  margin: theme.spacing(0, 0.5),
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    border: `1px solid ${theme.palette.primary.main}40`,
  },
  "&:active": {
    transform: "translateY(0px)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1), // Reduced padding for mobile
    margin: theme.spacing(0, 0.25), // Reduced margin for mobile
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.15)",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${theme.palette.primary.main}60`,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5, 1), // Reduced padding for mobile
  },
}));
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main})`,
  color: "white",
  fontWeight: "600",
  fontSize: "0.875rem",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  border: "2px solid rgba(255, 255, 255, 0.2)",
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "16px",
    marginTop: theme.spacing(1),
    minWidth: 200,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: `
      0 10px 40px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
  },
  "& .MuiMenuItem-root": {
    borderRadius: "8px",
    margin: theme.spacing(0.5, 1),
    padding: theme.spacing(1, 1.5),
    transition: "all 0.2s ease",
    "&:hover": {
      background: `linear-gradient(135deg, 
        ${theme.palette.primary.main}15, 
        ${theme.palette.secondary.main}10)`,
      transform: "translateX(4px)",
    },
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  height: "24px",
  fontSize: "0.75rem",
  fontWeight: "500",
  background: `linear-gradient(135deg, 
    ${theme.palette.success.main}20, 
    ${theme.palette.success.light}30)`,
  color: theme.palette.success.dark,
  border: `1px solid ${theme.palette.success.main}40`,
  "& .MuiChip-label": {
    padding: theme.spacing(0, 1),
  },
}));

const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: "600",
  fontSize: "0.875rem",
  color: theme.palette.text.primary,
  maxWidth: "120px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
    minWidth: "auto", // Changed from fixed width to auto
    maxWidth: "calc(100% - 32px)", // Ensure it doesn't touch screen edges
    width: "100%", // Take full width on mobile
    margin: "16px", // Add margin on mobile
    [theme.breakpoints.up("sm")]: {
      minWidth: "500px", // Only set minimum width on larger screens
      maxWidth: "600px",
    },
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}20, 
    ${theme.palette.secondary.main}15)`,
  padding: theme.spacing(3),
  borderRadius: "20px 20px 0 0",
  textAlign: "center",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2), // Reduce padding on mobile
  },
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main})`,
  color: "white",
  fontWeight: "700",
  fontSize: "2rem",
  margin: "0 auto 16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  border: "4px solid rgba(255, 255, 255, 0.3)",
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
    fontSize: "1.5rem",
    marginBottom: theme.spacing(1),
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.5)",
  },
}));

export default function CustomAppBar({ children, open }) {
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down(400));
  // Mock user data - replace with actual user data from context
  const userDetails = {
    name: currentUser?.name || "John Doe",
    email: currentUser?.email || "john.doe@skylinestays.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    department: "Operations",
    role: "Administrator",
    joinDate: "January 15, 2023",
    employeeId: "SS-2023-001",
    status: "Active",
  };

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    setProfileDialogOpen(true);
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <StyledAppBar position="fixed" open={open}>
        <StyledToolbar>
          {children}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 0, // Allows text truncation
              flex: isMobile ? 1 : "none", // Takes available space on mobile
            }}
          >
            <LogoTypography
              variant="h5"
              noWrap
              component="div"
              sx={{
                ...(isSmallMobile && {
                  maxWidth: "120px", // Even smaller width for very small screens
                }),
              }}
            >
              Skyline Stays
            </LogoTypography>
          </Box>
          <GrowDiv />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StatusChip
              label="Online"
              size="small"
              sx={{
                display: { xs: "none", sm: "flex" },
                mr: 1,
              }}
            />

            <StyledIconButton color="inherit" size="large">
              <Badge
                badgeContent={3}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.75rem",
                    height: "18px",
                    minWidth: "18px",
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </StyledIconButton>

            <StyledIconButton
              color="inherit"
              size="large"
              onClick={handleDashboardClick}
            >
              <SettingsIcon />
            </StyledIconButton>

            <UserSection onClick={handleMenuOpen}>
              <Box sx={{ display: "flex", flexDirection: "column", mr: 1.5 }}>
                <UserName variant="subtitle2">
                  {currentUser?.name || "User"}
                </UserName>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Administrator
                </Typography>
              </Box>
              <StyledAvatar alt={currentUser?.name}>
                {getInitials(currentUser?.name)}
              </StyledAvatar>
              <ArrowDownIcon
                sx={{
                  ml: 1,
                  fontSize: "1.2rem",
                  transition: "transform 0.2s ease",
                  transform: Boolean(anchorEl)
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </UserSection>

            <StyledMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleProfileClick}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  👤 Profile
                </Box>
              </MenuItem>
              <MenuItem onClick={handleDashboardClick}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  📊 Dashboard
                </Box>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "error.main",
                  "&:hover": {
                    background: "rgba(244, 67, 54, 0.08) !important",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  🚪 Logout
                </Box>
              </MenuItem>
            </StyledMenu>
          </Box>
        </StyledToolbar>
      </StyledAppBar>

      {/* Profile Dialog */}
      <StyledDialog
        open={profileDialogOpen}
        onClose={handleProfileDialogClose}
        maxWidth="md"
        fullWidth
      >
        <ProfileHeader>
          <IconButton
            onClick={handleProfileDialogClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              background: "rgba(255, 255, 255, 0.2)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <LargeAvatar>{getInitials(userDetails.name)}</LargeAvatar>

          <Typography variant="h4" fontWeight="700" gutterBottom>
            {userDetails.name}
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            {userDetails.role}
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}
          >
            <Chip
              label={userDetails.status}
              color="success"
              size="small"
              sx={{ fontWeight: "600" }}
            />
            <Chip
              label={userDetails.department}
              variant="outlined"
              size="small"
            />
          </Box>
        </ProfileHeader>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoCard>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    fontWeight="600"
                  >
                    📞 Contact Information
                  </Typography>

                  <InfoItem>
                    <EmailIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {userDetails.email}
                      </Typography>
                    </Box>
                  </InfoItem>

                  <InfoItem>
                    <PhoneIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {userDetails.phone}
                      </Typography>
                    </Box>
                  </InfoItem>

                  <InfoItem>
                    <LocationIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {userDetails.location}
                      </Typography>
                    </Box>
                  </InfoItem>
                </CardContent>
              </InfoCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoCard>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    fontWeight="600"
                  >
                    💼 Work Information
                  </Typography>

                  <InfoItem>
                    <WorkIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Department
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {userDetails.department}
                      </Typography>
                    </Box>
                  </InfoItem>

                  <InfoItem>
                    <BadgeIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Employee ID
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {userDetails.employeeId}
                      </Typography>
                    </Box>
                  </InfoItem>

                  <InfoItem>
                    <CalendarIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Join Date
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {userDetails.joinDate}
                      </Typography>
                    </Box>
                  </InfoItem>
                </CardContent>
              </InfoCard>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleProfileDialogClose}
            sx={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0, #1e88e5)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
}
