const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');
const albaranRoutes = require('./routes/albaranRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/client', require('./routes/clientRoutes'));

app.use('/api/albaranes', albaranRoutes);

module.exports = app;
