import { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Box, Typography, Divider } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import axios from 'axios';
import './navbar.css';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail');
    setUserEmail(storedEmail);

    if (storedEmail) {
      fetchUserInfo(storedEmail);
    }
  }, []);

  const handleMenuOpen = (event) => {
    setDropdownOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setDropdownOpen(null);
  };

  const fetchUserInfo = async (email) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-user/${email}`);
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#9C8CB9", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button color="inherit" href="/" sx={{ fontWeight: "bold" }}>Home</Button>
            <Button color="inherit" href="/Calendar" sx={{ fontWeight: "bold" }}>CALENDER</Button>
          </Box>

          {/* Profile Icon */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="user menu"
            onClick={handleMenuOpen}
            sx={{ marginLeft: 2 }}
          >
            <AccountCircle />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={dropdownOpen}
            open={Boolean(dropdownOpen)}
            onClose={handleMenuClose}
            sx={{ marginTop: 2 }}
          >
            {userInfo ? (
              <>
                <MenuItem>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {userInfo.name}
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography variant="body2">{userInfo.email}</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography variant="body2">
                    DOB: {new Date(userInfo.dob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </MenuItem>
                <Divider />
              </>
            ) : (
              <MenuItem>
                <Typography variant="body2">Loading user info...</Typography>
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ paddingTop: "65px" }}></Box>
    </Box>
  );
}
