import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, data } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Divider,
  MenuItem,
  Paper,
  Menu,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Laptop as LaptopIcon,
  Headphones as HeadphonesIcon,
  Watch as WatchIcon,
  Tablet as TabletIcon,
  FilterList as FilterListIcon,
  AddAPhoto as Add,
} from "@mui/icons-material";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import NavBar from "./NavBar";

const getCategoryIcon = (category) => {
  switch (category) {
    case "Smartphone":
      return <PhoneIcon fontSize="small" />;
    case "Laptop":
      return <LaptopIcon fontSize="small" />;
    case "Tablet":
      return <TabletIcon fontSize="small" />;
    case "Watch":
      return <WatchIcon fontSize="small" />;
    case "Audio":
      return <HeadphonesIcon fontSize="small" />;
    default:
      return <LaptopIcon fontSize="small" />;
  }
};

// Colors for charts
const COLORS = {
  "Cloudy White": "#F5F5F5",
  Blue: "#2196F3",
  Purple: "#9C27B0",
  Brown: "#795548",
  Red: "#F44336",
  Silver: "#C0C0C0",
  "Space Gray": "#4B4B4B",
  White: "#FFFF00",
  Black: "#000000",
};

const CAPACITY_COLORS = {
  "64GB": "#ff8042",
  "128GB": "#0088fe",
  "256GB": "#ffbb28",
  "512GB": "#00c49f",
  "32GB": "#83a6ed",
};

function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loader, setLoader] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [user, setUser] = useState({ email: null });
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [colors, setColor] = useState([]);
  const [capacities, SetCapacities] = useState([]);
  const [colorChartData, setColorChartData] = useState([]);
  const [capacityChartData, setCapacityChartData] = useState([]);

  useEffect(() => {
    setLoader(true);
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

    data
      .then((docs) => {
        const extractedData = docs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          category: getProductCategory(doc.data().name),
          image: doc.data()?.data?.img_url,
        }));
        setLoader(false);
        setProducts(extractedData);
        setFilteredProducts(extractedData);
      })
      .catch((err) => {
        console.log("error", err);
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      let colors1 = [
        ...new Set(
          products
            .filter((data) => {
              return data.data.color;
            })
            .map((one) => {
              return one.data.color;
            })
        ),
      ];

      setColor(colors1);

      let capacities1 = [
        ...new Set(
          products
            .filter((data) => {
              return data.data.capacity;
            })
            .map((one) => {
              return one.data.capacity;
            })
        ),
      ];

      SetCapacities(capacities1);

      let colorChartData1 = colors1.map((color) => ({
        name: color,
        count: products.filter((p) => p?.data?.color === color).length,
        fill: COLORS[color] || "#8884d8",
      }));

      setColorChartData(colorChartData1);

      let capacityChartData1 = capacities1.map((capacity) => ({
        name: capacity,
        value: products.filter((p) => p?.data?.capacity === capacity).length,
        fill: CAPACITY_COLORS[capacity] || "#8884d8",
      }));
      setCapacityChartData(capacityChartData1);
    }
  }, [products]);

  const getProductCategory = (name) => {
    if (
      name.includes("iPhone") ||
      name.includes("Pixel") ||
      name.includes("Galaxy")
    ) {
      return "Smartphone";
    } else if (name.includes("MacBook")) {
      return "Laptop";
    } else if (name.includes("iPad")) {
      return "Tablet";
    } else if (name.includes("Watch")) {
      return "Watch";
    } else if (name.includes("AirPods") || name.includes("Beats")) {
      return "Audio";
    } else {
      return "Other";
    }
  };

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType === "color" && selectedFilter) {
      filtered = filtered.filter(
        (product) => product.data.color === selectedFilter
      );
    } else if (filterType === "capacity" && selectedFilter) {
      filtered = filtered.filter(
        (product) => product.data.capacity === selectedFilter
      );
    }
    setFilteredProducts(filtered);
  }, [searchQuery, filterType, selectedFilter, products]);

  const handleFilterChange = (type, value) => {
    setFilterType(type);
    setSelectedFilter(value);
    setFilterMenuAnchorEl(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <NavBar user={user} />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "right",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => navigate("/add_item")}
            variant="contained"
            sx={{ mb: 4 }}
            startIcon={<Add />}
          >
            Add Item
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Welcome to ADLIFT Project(Test)
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Discover the latest tech products and accessories
          </Typography>
        </Box>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterMenuOpen}
            sx={{ minWidth: 120 }}
          >
            Filter
          </Button>
        </Box>

        {loader ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Menu
                  anchorEl={filterMenuAnchorEl}
                  open={Boolean(filterMenuAnchorEl)}
                  onClose={handleFilterMenuClose}
                >
                  <MenuItem onClick={() => handleFilterChange("all", "")}>
                    All Products
                  </MenuItem>
                  <Divider />
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      Color
                    </Typography>
                  </MenuItem>
                  {colors.map((color) => (
                    <MenuItem
                      key={color}
                      onClick={() => handleFilterChange("color", color)}
                    >
                      {color}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      Capacity
                    </Typography>
                  </MenuItem>
                  {capacities.map((capacity) => (
                    <MenuItem
                      key={capacity}
                      onClick={() => handleFilterChange("capacity", capacity)}
                    >
                      {capacity}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {selectedFilter && (
                <Box
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Filtered by:
                  </Typography>
                  <Chip
                    label={`${
                      filterType === "color" ? "Color" : "Capacity"
                    }: ${selectedFilter}`}
                    onDelete={() => handleFilterChange("all", "")}
                    size="small"
                  />
                </Box>
              )}

              {filteredProducts.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 200,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No products found matching your criteria
                  </Typography>
                </Paper>
              ) : (
                <Grid
                  sx={{ justifyContent: "center" }}
                  container
                  spacing={3}
                  alignItems="stretch"
                >
                  {filteredProducts.map((product) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={product.id}
                      sx={{ width: "350px" }}
                    >
                      <Card
                        sx={{
                          height: 420,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height="200"
                            width={300}
                            image={
                              product?.data?.img_url
                                ? product?.data?.img_url
                                : "https://www.stockvault.net/data/2017/04/07/233529/preview16.jpg"
                            }
                            alt={product?.name}
                          />
                          <Chip
                            icon={getCategoryIcon(product.category)}
                            label={product?.data?.category}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                            }}
                          />
                        </Box>

                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              fontWeight: "bold",
                              mb: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "300px",
                            }}
                            title={product?.name}
                          >
                            {product?.name}
                          </Typography>

                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontWeight: "bold", mb: 1 }}
                          >
                            {product?.data?.price
                              ? `$${product?.data?.price}`
                              : "Available soon"}
                          </Typography>

                          <Box sx={{ mt: "auto" }}>
                            {product?.data?.color && (
                              <Typography variant="body2">
                                <strong>Color:</strong> {product?.data?.color}
                              </Typography>
                            )}
                            {product?.data?.capacity ? (
                              <Typography variant="body2">
                                <strong>Capacity:</strong>{" "}
                                {product?.data?.capacity}
                              </Typography>
                            ) : (
                              <Typography variant="body2">
                                <strong>Capacity:</strong> Not disclosed
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Container>

      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 8 } }}
      >
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            Charts
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            Graph representation of the sale.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {!loader && (
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  width: "100%",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                >
                  Product Distribution by Color
                </Typography>
                <Box
                  sx={{ width: "100%", height: { xs: 250, sm: 300, md: 350 } }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={colorChartData}
                      margin={{ top: 5, right: 30, left: 10, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        name="Number of Products"
                        fill="#8884d8"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {loader ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 2, sm: 3 },
                  width: "100%",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                >
                  Product Distribution by Capacity
                </Typography>
                <Box
                  sx={{ width: "100%", height: { xs: 250, sm: 300, md: 350 } }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={capacityChartData}
                        cx="50%"
                        cy="50%"
                        labelLine
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {capacityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
