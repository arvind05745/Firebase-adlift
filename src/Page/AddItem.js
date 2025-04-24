import { useState, useEffect } from "react";
import { FormControl, InputLabel, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, handleCreateNewListing } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";

import {
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Container,
  MenuItem,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import NavBar from "./NavBar";

const AddItem = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [user, setUser] = useState({ email: null });
  const [AddItem, setAddItem] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    category: "",
    color: "",
    img_url: "",
    price: "",
    CPUModel: "",
    HardDiskSize: "",
    year: null,
  });

  const [errors, setErrors] = useState({});

  const categories = [
    "Smartphone",
    "Laptop",
    "Tablet",
    "Watch",
    "Audio",
    "Other",
  ];

  const capacityOptions = ["32GB", "64GB", "128GB", "256GB", "512GB"];

  const colorOptions = [
    "Black",
    "White",
    "Silver",
    "Gray",
    "Blue",
    "Red",
    "Purple",
    "Green",
    "Yellow",
    "Pink",
    "Gold",
    "Brown",
    "Cloudy White",
    "Space Gray",
  ];

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
      }
    });
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }

    if (
      !formData.year ||
      isNaN(formData.year) ||
      Number(formData.year) < 1990 ||
      Number(formData.year) > new Date().getFullYear() + 1
    ) {
      newErrors.year = "Valid year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        year: Number(formData.year),
      };
      handleCreateNewListing(formattedData);
      setAddItem(true);
      setTimeout(() => {
        navigate("/home");
      }, 5000);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 35 }, (_, i) => currentYear - i);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <NavBar user={user} />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: "auto" }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
              Product Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <Typography variant="caption" color="error">
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Color</InputLabel>
                  <Select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    label="Color"
                  >
                    {colorOptions.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Capacity</InputLabel>
                  <Select
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    label="Capacity"
                  >
                    {capacityOptions.map((capacity) => (
                      <MenuItem key={capacity} value={capacity}>
                        {capacity}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CPU Model"
                  name="CPUModel"
                  value={formData.CPUModel}
                  onChange={handleChange}
                  placeholder="e.g. Intel Core i7, Apple M1"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hard Disk Size"
                  name="HardDiskSize"
                  value={formData.HardDiskSize}
                  onChange={handleChange}
                  placeholder="e.g. 512GB SSD, 1TB HDD"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.year}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    label="Year"
                  >
                    {yearOptions.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.year && (
                    <Typography variant="caption" color="error">
                      {errors.year}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="img_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Save Product
                </Button>
              </Grid>
            </Grid>
          </Box>
          {AddItem && (
            <Box sx={{ mb: 4, mt: 5 }}>
              <Typography
                variant="p"
                component="p"
                gutterBottom
                sx={{ fontWeight: 400, color: "red" }}
              >
                Your product has been added successfully. It may take a few
                moments to appear in the product list. Redirecting to Home...
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AddItem;
