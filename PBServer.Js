const express = require('express');
const cors = require('cors');
const path = require('path');
const envelopesRouter = require('./RoutesEnvelopes');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (CSS, JS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Use the envelopes router
app.use('/envelopes', envelopesRouter);

// Serve the frontend HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
