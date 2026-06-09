const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Kết nối MongoDB
connectDB();

// Routes


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});