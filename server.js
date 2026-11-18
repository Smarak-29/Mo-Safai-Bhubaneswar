require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const { startIoTSimulator } = require('./utils/iotSimulator');
const { router: authRoutes } = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mo_safai_bbsr_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

// View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global template variables middleware
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Mount Routes
app.use('/', authRoutes);
app.use('/', apiRoutes);

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start IoT Simulator once connected
    startIoTSimulator();

    // Start Server
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🌿 [Mo Safai Bhubaneswar] Civic App Running!`);
      console.log(`🌐 Local URL: http://localhost:${PORT}`);
      console.log(`🏛️  Bhubaneswar Municipal Corporation (BMC)`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error(`Failed to initialize application: ${err.message}`);
    process.exit(1);
  }
};

startServer();
