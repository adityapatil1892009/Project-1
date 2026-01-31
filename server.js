const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '12mb' }));

// Session setup
app.use(session({
    name: 'wsess',
    secret: process.env.SESSION_SECRET || 'water_supply_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
}));

// Make user available in all views
app.use((req, res, next) => {
    res.locals.user = req.session && req.session.user ? req.session.user : null;
    next();
});

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

// Helper to load users
const loadUsers = () => {
    try {
        const raw = fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8');
        const u = JSON.parse(raw);
        return Array.isArray(u) ? u : [];
    } catch (e) {
        console.error('Error loading users:', e);
        return [];
    }
};

// Middleware: require authority role
function requireAuthority(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'authority') return next();
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(403).json({ error: 'Forbidden: authority access required' });
    }
    return res.status(403).send('Forbidden: authority access required');
}

// Routes

// Home
app.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
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
    if (!req.session.user) return res.redirect('/login');
    res.render('about/introduction', { title: 'Introduction' });
});

app.get('/about/objectives', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('about/objectives', { title: 'Objectives and Functions' });
});

app.get('/about/officers', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('about/officers', { title: 'Officers and Employees' });
});

// Citizen Corner
app.get('/citizen/complaint', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('citizen/complaint', { title: 'Complaint and Queries' });
});

// Services
app.get('/services/tanks', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const tanks = readData('tanks.json');
    const plants = readData('plants.json');
    res.render('services/tanks', { title: 'Water Tanks', tanks, plants });
});

app.get('/services/tanks/cleaning-schedule', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('services/cleaning-schedule', { title: 'Cleaning Schedules' });
});

app.get('/services/pipeline', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY || '';
    res.render('services/pipeline', { title: 'Pipeline System', googleMapsKey });
});

app.get('/services/maintenance', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('services/maintenance', { title: 'Maintenance' });
});

// Schedule
app.get('/schedule', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const schedule = readData('schedule.json');
    res.render('schedule', { title: 'Water Supply Schedule', schedule });
});

// Contact
app.get('/contact', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
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

// --- Auth Routes ---
app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('login', { title: 'Login', error: null });
});

app.post('/login', (req, res) => {
    try {
        const { role, method, identifier } = req.body || {};
        if (!role || !method || !identifier) {
            return res.status(400).render('login', { title: 'Login', error: 'Missing fields' });
        }

        const users = loadUsers();
        const user = users.find(u =>
            u.role === role &&
            ((method === 'email' && u.email === identifier) || (method === 'code' && u.areaCode === identifier))
        );
        if (!user) {
            return res.status(401).render('login', { title: 'Login', error: 'Invalid credentials' });
        }

        req.session.user = { 
            name: user.name, 
            role: user.role, 
            email: user.email || null, 
            areaCode: user.areaCode || null 
        };
        return res.redirect('/');
    } catch (err) {
        console.error('Login error', err);
        return res.status(500).render('login', { title: 'Login', error: 'Server error' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

// Publish notice (authority only)
app.get('/notices/new', requireAuthority, (req, res) => {
    res.render('notices/new', { title: 'Publish Notice', error: null });
});

app.post('/notices/new', requireAuthority, (req, res) => {
    try {
        const { title, content, date } = req.body || {};
        if (!title || !content) {
            return res.status(400).render('notices/new', { title: 'Publish Notice', error: 'Title and content required' });
        }

        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        const filePath = path.join(dataDir, 'notices.json');
        let notices = [];
        try {
            if (fs.existsSync(filePath)) {
                notices = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (!Array.isArray(notices)) notices = [];
            }
        } catch (err) { notices = []; }

        const newId = notices.length ? Math.max(...notices.map(n => n.id || 0)) + 1 : 1;
        const entry = {
            id: newId,
            title,
            date: date || new Date().toISOString().slice(0,10),
            content,
            author: req.session.user.name || req.session.user.email || 'authority'
        };
        notices.push(entry);
        fs.writeFileSync(filePath, JSON.stringify(notices, null, 2), 'utf8');

        return res.redirect('/');
    } catch (err) {
        console.error('Publish notice error', err);
        return res.status(500).render('notices/new', { title: 'Publish Notice', error: 'Server error' });
    }
});

// Admin dashboard (authority only)
app.get('/admin/dashboard', requireAuthority, (req, res) => {
    try {
        const dataDir = path.join(__dirname, 'data');
        const contactPath = path.join(dataDir, 'contact-messages.json');
        const maintenancePath = path.join(dataDir, 'maintenance-requests.json');
        const noticesPath = path.join(dataDir, 'notices.json');

        const contacts = fs.existsSync(contactPath) ? JSON.parse(fs.readFileSync(contactPath, 'utf8')) : [];
        const maintenance = fs.existsSync(maintenancePath) ? JSON.parse(fs.readFileSync(maintenancePath, 'utf8')) : [];
        const notices = fs.existsSync(noticesPath) ? JSON.parse(fs.readFileSync(noticesPath, 'utf8')) : [];

        res.render('authority/dashboard', { title: 'Admin Dashboard', contacts, maintenance, notices });
    } catch (err) {
        console.error('Admin dashboard error', err);
        res.status(500).send('Server error');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
