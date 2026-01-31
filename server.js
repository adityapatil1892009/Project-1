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
app.use(express.json({ limit: '12mb' }));

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

app.get('/services/tanks/cleaning-schedule', (req, res) => {
    res.render('services/cleaning-schedule', { title: 'Cleaning Schedules' });
});

app.get('/services/pipeline', (req, res) => {
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

// Contact form submission
app.post('/contact/submit', (req, res) => {
    try {
        const payload = req.body || {};
        
        // Validate required fields
        if (!payload.name || !payload.email || !payload.category || !payload.subject || !payload.message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Prepare storage directory and file
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const filePath = path.join(dataDir, 'contact-messages.json');
        let messages = [];
        
        try {
            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath, 'utf8');
                messages = JSON.parse(rawData);
                if (!Array.isArray(messages)) messages = [];
            }
        } catch (err) {
            console.error('Error reading contact messages:', err);
            messages = [];
        }

        // Create reference ID
        const reference = 'MSG' + Date.now().toString(36).toUpperCase().slice(-8);
        const entry = Object.assign({}, payload, { 
            reference, 
            receivedAt: new Date().toISOString(),
            status: 'received'
        });
        messages.push(entry);

        // Save to file
        try {
            fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');
            console.log('✅ Contact message saved:', reference);
        } catch (err) {
            console.error('❌ Error saving contact message:', err);
            return res.status(500).json({ error: 'Error saving your message' });
        }

        return res.json({ ok: true, reference, message: 'Your message has been received. We will contact you soon.' });
    } catch (err) {
        console.error('❌ Contact form error:', err);
        return res.status(500).json({ error: 'Server error while processing your request' });
    }
});

// Get contact messages (admin view)
app.get('/api/contact-messages', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'contact-messages.json');
        if (!fs.existsSync(filePath)) return res.json([]);
        const messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.json(Array.isArray(messages) ? messages : []);
    } catch (err) {
        console.error('❌ Failed to read contact messages:', err);
        res.json([]);
    }
});

// Maintenance requests
app.post('/services/maintenance/request', (req, res) => {
    try {
        const payload = req.body || {};
        const sectorType = payload.sectorType || 'citizen';

        // Validate based on sector type
        if (sectorType === 'citizen') {
            if (!payload.serviceType || !payload.address || !payload.fullname || !payload.phone || !payload.description) {
                return res.status(400).json({ error: 'Missing required fields for citizen request' });
            }
            const age = parseInt(payload.age, 10);
            if (!isNaN(age) && age > 0 && age < 18) {
                if (!payload.guardianName || !payload.guardianPhone) {
                    return res.status(400).json({ error: 'Guardian details required for applicants under 18' });
                }
            }
        } else if (sectorType === 'industrial') {
            if (!payload.serviceType || !payload.facilityName || !payload.address || !payload.contactName || !payload.phone || !payload.description || !payload.requestedWaterRequirement) {
                return res.status(400).json({ error: 'Missing required fields for industrial request' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid sector type' });
        }

        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const filePath = path.join(dataDir, 'maintenance-requests.json');
        let list = [];
        try {
            if (fs.existsSync(filePath)) {
                list = JSON.parse(fs.readFileSync(filePath));
                if (!Array.isArray(list)) list = [];
            }
        } catch (err) {
            list = [];
        }

        const reference = (sectorType === 'industrial' ? 'IND' : 'CIT') + Date.now().toString(36).toUpperCase().slice(-8);
        const entry = Object.assign({}, payload, { reference, receivedAt: new Date().toISOString() });
        list.push(entry);

        fs.writeFileSync(filePath, JSON.stringify(list, null, 2));

        return res.json({ ok: true, reference });
    } catch (err) {
        console.error('❌ Request save error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/maintenance-requests', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'maintenance-requests.json');
        if (!fs.existsSync(filePath)) return res.json([]);
        const list = JSON.parse(fs.readFileSync(filePath));
        res.json(Array.isArray(list) ? list : []);
    } catch (err) {
        console.error('❌ Failed to read maintenance requests:', err);
        res.json([]);
    }
});

// API Routes
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
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
