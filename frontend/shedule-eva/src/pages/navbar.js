import { useState } from "react";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Box } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import scheduleLogo from "../images/logo_shedule.png";
import './navbar.css';  

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleMenuOpen = (event) => {
    setDropdownOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setDropdownOpen(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#aa94d8", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <img src={scheduleLogo} alt="Logo" style={{ height: "30px", width: "auto" }} /> */}
            <Button color="inherit" href="/" sx={{ fontWeight: "bold" }}>Home</Button>
            <Button color="inherit" href="/Calendar" sx={{ fontWeight: "bold" }}>Calendar</Button>
          </Box>

        
          <IconButton
            edge="end"
            color="inherit"
            aria-label="user menu"
            onClick={handleMenuOpen}
            sx={{ marginLeft: 2 }}
          >
            <AccountCircle />
          </IconButton>

      
          <Menu
            anchorEl={dropdownOpen}
            open={Boolean(dropdownOpen)}
            onClose={handleMenuClose}
            sx={{ marginTop: 2 }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

    
      <Box sx={{ paddingTop: "65px" }}></Box>
    </Box>
  );
}
