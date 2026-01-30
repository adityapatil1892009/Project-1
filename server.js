const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper to read data
const readData = (filename) => {
    try {
        const rawData = fs.readFileSync(path.join(__dirname, 'data', filename));
        return JSON.parse(rawData);
    } catch (err) {
        console.error(`Error reading ${filename}:`, err);
        return [];
    }
};

// Routes

// Home
app.get('/', (req, res) => {
    const notices = readData('notices.json');
    const messages = readData('messages.json');
    res.render('index', { 
        title: 'Home', 
        notices, 
        messages 
    });
});

// About Routes
app.get('/about/introduction', (req, res) => {
    res.render('about/introduction', { title: 'Introduction' });
});

app.get('/about/objectives', (req, res) => {
    res.render('about/objectives', { title: 'Objectives and Functions' });
});

app.get('/about/officers', (req, res) => {
    res.render('about/officers', { title: 'Officers and Employees' });
});

// Citizen Corner
app.get('/citizen/complaint', (req, res) => {
    res.render('citizen/complaint', { title: 'Complaint and Queries' });
});

// Services
app.get('/services/tanks', (req, res) => {
    const tanks = readData('tanks.json');
    const plants = readData('plants.json');
    res.render('services/tanks', { title: 'Water Tanks', tanks, plants });
});

// "Cleaning Schedules" is under Water Tanks, but we'll make it a separate route or a section
app.get('/services/tanks/cleaning-schedule', (req, res) => {
    // For simplicity, reusing a generic template or creating a specific one if needed
    // I'll create a specific one later if needed, but for now map it to a specific view
    res.render('services/cleaning-schedule', { title: 'Cleaning Schedules' });
});

app.get('/services/pipeline', (req, res) => {
    // Pass Google Maps API key from environment if available
    const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY || '';
    res.render('services/pipeline', { title: 'Pipeline System', googleMapsKey });
});

app.get('/services/maintenance', (req, res) => {
    res.render('services/maintenance', { title: 'Maintenance' });
});

// Schedule
app.get('/schedule', (req, res) => {
    const schedule = readData('schedule.json');
    res.render('schedule', { title: 'Water Supply Schedule', schedule });
});

// Contact
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

// API Routes (for dynamic client-side updates if needed)
app.get('/api/notices', (req, res) => {
    res.json(readData('notices.json'));
});

app.get('/api/schedule', (req, res) => {
    res.json(readData('schedule.json'));
});

app.get('/api/messages', (req, res) => {
    res.json(readData('messages.json'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
