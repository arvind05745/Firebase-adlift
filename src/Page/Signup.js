import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, signInWithGooglePopup } from "../firebase";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });
  });

  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email-address"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Password must be at least 6 characters"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.2,
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "scale(1.02)",
                  transition: "all 0.2s ease-in-out",
                  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
                },
              }}
            >
              Sign Up
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  style={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Sign in
                </NavLink>
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }}>OR</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={logGoogleUser}
              sx={{
                py: 1.2,
                "&:hover": {
                  bgcolor: "rgba(66, 133, 244, 0.04)",
                  transform: "scale(1.02)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            >
              Sign In With Google
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
