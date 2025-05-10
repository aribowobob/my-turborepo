"use client";

import { useState } from "react";
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
import { useAppDispatch } from "../store/hooks";
import { getUserData, updateUserData } from "../store/actions";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // State for update profile modal
  const [updateProfileOpen, setUpdateProfileOpen] = useState(false);

  // State for snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

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
      const resultAction = await dispatch(getUserData());

      if (getUserData.fulfilled.match(resultAction)) {
        setUpdateProfileOpen(true);
      } else {
        setSnackbar({
          open: true,
          message: "Failed to load profile data",
          severity: "error",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load profile data",
        severity: "error",
      });
    }
  };

  const handleUpdateProfile = async (data: { name: string; email: string }) => {
    try {
      const resultAction = await dispatch(updateUserData({ name: data.name }));

      if (updateUserData.fulfilled.match(resultAction)) {
        setUpdateProfileOpen(false);

        setSnackbar({
          open: true,
          message: "Profile updated successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update profile",
          severity: "error",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const menuId = "primary-account-menu";
  const isMenuOpen = Boolean(anchorEl);

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

          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.dark" }}>
              {user?.name?.charAt(0).toUpperCase() || ""}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
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
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, display: "flex", flexDirection: "column" }}>
              <Typography variant="h4" gutterBottom>
                Welcome, {user?.name || user?.email?.split("@")[0] || "User"}!
              </Typography>
              <Typography variant="body1">
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
        onSubmit={handleUpdateProfile}
      />

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />

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
    </Box>
  );
}
