import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGooglePopup } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = (e) => {
    e.preventDefault();
    setError("");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/home");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        navigate("/home");
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

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
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={onLogin}
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
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              Sign In
            </Button>

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

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2">
                No account yet?{" "}
                <NavLink
                  to="/signup"
                  style={{
                    color: "#1976d2",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Sign up
                </NavLink>
              </Typography>
            </Box>

            {isAuthenticated && (
              <Alert severity="success" sx={{ mt: 2 }}>
                You are successfully logged in!
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
