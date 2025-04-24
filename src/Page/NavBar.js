import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Home as HomeIcon,
  AddAPhoto as Add,
} from "@mui/icons-material";

export default function NavBar({ user }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            ALIFT Project(Test)
          </Typography>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              ml: 2,
            }}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1 }}>
              {user.email ? user.email.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.email}
            </Typography>
          </Box>

          <Button
            color="primary"
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "white",
              },
            }}
          >
            {isMobile ? "" : "Logout"}
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}
