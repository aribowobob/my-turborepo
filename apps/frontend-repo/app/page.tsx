"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Avatar,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { UpdateProfileForm } from "../components/organisms/UpdateProfileForm";
import { PrimaryButton } from "../components/atoms/Button";
import { Snackbar } from "../components/atoms/Snackbar";
import Cookies from "js-cookie";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/actions";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // State for update profile modal
  const [updateProfileOpen, setUpdateProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);

  // State for snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Fetch the backend URL from environment variable
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    // Initialize profile data from user context
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleOpenUpdateProfile = async () => {
    try {
      // Fetch the latest user data from API
      setIsLoading(true);
      const token = Cookies.get("auth-token");

      const response = await fetch(`${backendUrl}/api/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
        });
        setUpdateProfileOpen(true);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load profile data",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: { name: string; email: string }) => {
    try {
      setIsLoading(true);
      const token = Cookies.get("auth-token");

      // Only send name field in the update request
      const response = await fetch(`${backendUrl}/api/update-user-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: data.name }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Update local state with new data
        setProfileData({
          name: updatedUser.name,
          email: updatedUser.email,
        });

        // Update user state in Redux
        dispatch(setUser(updatedUser));

        // Close the modal
        setUpdateProfileOpen(false);

        // Show success message
        setSnackbar({
          open: true,
          message: "Profile updated successfully",
          severity: "success",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // If not logged in, redirect to login (this is handled by middleware.ts)

  const menuId = "primary-account-menu";
  const isMenuOpen = Boolean(anchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Dashboard
        </Typography>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Dashboard
          </Typography>
          <IconButton color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.dark" }}>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, display: "flex", flexDirection: "column" }}>
              <Typography variant="h4" gutterBottom>
                Welcome, {user?.name || user?.email?.split("@")[0] || "User"}!
              </Typography>
              <Typography variant="body1" paragraph>
                This is your personal dashboard. Here you can manage your
                account, view recent activities, and access important features.
              </Typography>

              <Box sx={{ mt: 2 }}>
                <PrimaryButton
                  onClick={handleOpenUpdateProfile}
                  startIcon={<AccountCircleIcon />}
                  sx={{ mt: 2 }}
                >
                  Update Profile
                </PrimaryButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box
        component="footer"
        sx={{ p: 2, bgcolor: "background.paper", mt: "auto" }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} My Dashboard App
        </Typography>
      </Box>

      {/* Update Profile Modal */}
      <UpdateProfileForm
        open={updateProfileOpen}
        onClose={() => setUpdateProfileOpen(false)}
        initialData={profileData}
        onSubmit={handleUpdateProfile}
        isLoading={isLoading}
      />

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />

      {renderMenu}
    </Box>
  );
}
