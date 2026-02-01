const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');
const session = require('express-session');
const fileUpload = require('express-fileupload');

// Port configuration
const PORT = process.env.PORT || 8000;

// Middleware - CORRECT ORDER MATTERS
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse request body BEFORE fileUpload
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '12mb' }));

// File upload middleware
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max total
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true
}));

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

// Middleware: require admin role
function requireAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') return next();
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(403).json({ error: 'Forbidden: admin access required' });
    }
    return res.redirect('/');
}

// Middleware: require authority or admin role (for delete permission)
function requireAuthorityOrAdmin(req, res, next) {
    if (req.session && req.session.user && (req.session.user.role === 'authority' || req.session.user.role === 'admin')) return next();
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(403).json({ error: 'Forbidden: authority/admin access required' });
    }
    return res.status(403).send('Forbidden: authority/admin access required');
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

// Delete notice (authority or admin only)
app.delete('/api/notices/:id', requireAuthorityOrAdmin, (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid notice id' });

        const dataDir = path.join(__dirname, 'data');
        const filePath = path.join(dataDir, 'notices.json');
        let notices = [];
        if (fs.existsSync(filePath)) {
            try {
                notices = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (!Array.isArray(notices)) notices = [];
            } catch (e) {
                notices = [];
            }
        }

        const idx = notices.findIndex(n => Number(n.id) === id);
        if (idx === -1) return res.status(404).json({ error: 'Notice not found' });

        const deleted = notices.splice(idx, 1)[0];
        fs.writeFileSync(filePath, JSON.stringify(notices, null, 2), 'utf8');

        console.log('✅ Notice deleted:', deleted.id);
        return res.json({ ok: true, id: deleted.id });
    } catch (err) {
        console.error('❌ Delete notice error:', err);
        return res.status(500).json({ error: 'Server error' });
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

// ========== ADMIN DASHBOARD ROUTES ==========
// Admin Dashboard Page
app.get('/admin-dashboard', requireAdmin, (req, res) => {
    try {
        const users = loadUsers();
        const schedule = readData('schedule.json');
        const totalVisits = 15234; // Placeholder - can be tracked in a visits.json
        res.render('admin/dashboard', { 
            title: 'Admin Dashboard', 
            users, 
            schedule,
            totalVisits,
            totalUsers: users.length,
            error: null
        });
    } catch (err) {
        console.error('Admin dashboard error', err);
        res.status(500).render('admin/dashboard', { title: 'Admin Dashboard', error: 'Failed to load dashboard', users: [], schedule: {}, totalVisits: 0, totalUsers: 0 });
    }
});

// ========== USER MANAGEMENT API ==========
// Get all users
app.get('/api/admin/users', requireAdmin, (req, res) => {
    const users = loadUsers();
    res.json(users);
});

// Add user
app.post('/api/admin/users', requireAdmin, (req, res) => {
    try {
        const { name, role, email, areaCode } = req.body;
        if (!name || !role || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const users = loadUsers();
        const newUser = { name, role, email, areaCode: areaCode || '' };
        users.push(newUser);

        const dataDir = path.join(__dirname, 'data');
        fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
        
        console.log('✅ User added:', name);
        res.json({ ok: true, user: newUser });
    } catch (err) {
        console.error('❌ Error adding user:', err);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

// Update user
app.put('/api/admin/users/:index', requireAdmin, (req, res) => {
    try {
        const idx = parseInt(req.params.index);
        const { name, role, email, areaCode } = req.body;
        
        const users = loadUsers();
        if (idx < 0 || idx >= users.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        users[idx] = { name, role, email, areaCode: areaCode || '' };
        const dataDir = path.join(__dirname, 'data');
        fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
        
        console.log('✅ User updated:', name);
        res.json({ ok: true, user: users[idx] });
    } catch (err) {
        console.error('❌ Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
app.delete('/api/admin/users/:index', requireAdmin, (req, res) => {
    try {
        const idx = parseInt(req.params.index);
        const users = loadUsers();
        
        if (idx < 0 || idx >= users.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        const deleted = users.splice(idx, 1);
        const dataDir = path.join(__dirname, 'data');
        fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
        
        console.log('✅ User deleted:', deleted[0].name);
        res.json({ ok: true, message: 'User deleted' });
    } catch (err) {
        console.error('❌ Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// ========== SCHEDULE MANAGEMENT API ==========
// Update schedule for an area
app.put('/api/admin/schedule/:area', requireAdmin, (req, res) => {
    try {
        const area = req.params.area;
        const { zone, status, timing, duration, message } = req.body;

        const dataDir = path.join(__dirname, 'data');
        const schedulePath = path.join(dataDir, 'schedule.json');
        let schedule = readData('schedule.json');

        schedule[area] = { zone, status, timing, duration, message };
        fs.writeFileSync(schedulePath, JSON.stringify(schedule, null, 2));

        console.log('✅ Schedule updated for:', area);
        res.json({ ok: true, area, data: schedule[area] });
    } catch (err) {
        console.error('❌ Error updating schedule:', err);
        res.status(500).json({ error: 'Failed to update schedule' });
    }
});

// ========== STATISTICS API ==========
app.get('/api/admin/stats', requireAdmin, (req, res) => {
    try {
        const users = loadUsers();
        const contacts = readData('contact-messages.json');
        const maintenance = readData('maintenance-requests.json');
        const notices = readData('notices.json');

        const stats = {
            totalUsers: users.length,
            totalAdmins: users.filter(u => u.role === 'admin').length,
            totalAuthority: users.filter(u => u.role === 'authority').length,
            totalCitizens: users.filter(u => u.role === 'citizen').length,
            totalContacts: Array.isArray(contacts) ? contacts.length : 0,
            totalMaintenanceRequests: Array.isArray(maintenance) ? maintenance.length : 0,
            totalNotices: Array.isArray(notices) ? notices.length : 0,
            totalPageVisits: 15234
        };

        res.json(stats);
    } catch (err) {
        console.error('❌ Error fetching stats:', err);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// ========== TRANSLATION SETTINGS API ==========
app.get('/api/admin/settings', requireAdmin, (req, res) => {
    try {
        // Return current i18n settings
        res.json({
            enabledLanguages: ['en', 'hi', 'mr'],
            defaultLanguage: 'en'
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
    try {
        const { enabledLanguages, defaultLanguage } = req.body;
        console.log('✅ Settings updated:', { enabledLanguages, defaultLanguage });
        res.json({ ok: true, settings: { enabledLanguages, defaultLanguage } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// --- Citizen Complaints API ---
// Submit complaint (citizen)
app.post('/citizen/complaint/submit', (req, res) => {
    try {
        const payload = req.body || {};
        // minimal validation
        const consumerNumber = payload.consumerNumber || '';
        const phone = payload.phone || '';
        const name = payload.name || '';
        const issueType = payload.issueType || '';
        const severity = payload.severity || '';
        const description = payload.description || '';
        const attachmentCount = parseInt(payload.attachmentCount || 0, 10);

        if (!phone || !issueType || !severity || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        // Create complaints directory for file storage
        const complaintsDir = path.join(dataDir, 'complaints-attachments');
        if (!fs.existsSync(complaintsDir)) fs.mkdirSync(complaintsDir, { recursive: true });

        const filePath = path.join(dataDir, 'complaints.json');

        let complaints = [];
        try {
            if (fs.existsSync(filePath)) {
                complaints = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (!Array.isArray(complaints)) complaints = [];
            }
        } catch (e) { complaints = []; }

        const reference = 'CMP' + Date.now().toString(36).toUpperCase().slice(-8);
        
        // Store attachment file names
        const attachments = [];
        for (let i = 0; i < attachmentCount; i++) {
            const fileKey = `attachment_${i}`;
            const file = req.files && req.files[fileKey];
            
            if (file) {
                // Sanitize filename
                const timestamp = Date.now();
                const safeFileName = `${reference}_${i}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const filePath2 = path.join(complaintsDir, safeFileName);
                
                try {
                    file.mv(filePath2);
                    attachments.push({
                        originalName: file.name,
                        storedName: safeFileName,
                        size: file.size,
                        uploadedAt: new Date().toISOString()
                    });
                    console.log(`✅ Attachment saved: ${safeFileName}`);
                } catch (err) {
                    console.error(`❌ Error saving attachment: ${err.message}`);
                }
            }
        }

        const entry = {
            reference,
            consumerNumber,
            name,
            phone,
            issueType,
            severity,
            description,
            attachments: attachments,
            status: 'New',
            receivedAt: new Date().toISOString()
        };
        complaints.push(entry);
        fs.writeFileSync(filePath, JSON.stringify(complaints, null, 2), 'utf8');

        console.log('✅ Complaint saved:', reference);
        return res.json({ ok: true, reference, attachmentCount: attachments.length });
    } catch (err) {
        console.error('❌ Complaint submit error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Get complaints (authority/admin only)
app.get('/api/complaints', requireAuthorityOrAdmin, (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'complaints.json');
        if (!fs.existsSync(filePath)) return res.json([]);
        const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.json(Array.isArray(list) ? list : []);
    } catch (err) {
        console.error('❌ Failed to read complaints:', err);
        res.json([]);
    }
});

// Update complaint status (e.g., Viewed, Resolved) (authority/admin only)
app.put('/api/complaints/:reference', requireAuthorityOrAdmin, (req, res) => {
    try {
        const ref = req.params.reference;
        const { status } = req.body || {};
        if (!ref || !status) return res.status(400).json({ error: 'Missing reference or status' });

        const filePath = path.join(__dirname, 'data', 'complaints.json');
        let complaints = [];
        if (fs.existsSync(filePath)) {
            try { complaints = JSON.parse(fs.readFileSync(filePath, 'utf8')); if (!Array.isArray(complaints)) complaints = []; } catch (e) { complaints = []; }
        }

        const idx = complaints.findIndex(c => c.reference === ref);
        if (idx === -1) return res.status(404).json({ error: 'Complaint not found' });

        complaints[idx].status = status;
        // optional: track viewedAt/resolvedAt
        if (status === 'Viewed') complaints[idx].viewedAt = new Date().toISOString();
        if (status === 'Resolved') complaints[idx].resolvedAt = new Date().toISOString();

        fs.writeFileSync(filePath, JSON.stringify(complaints, null, 2), 'utf8');
        return res.json({ ok: true, complaint: complaints[idx] });
    } catch (err) {
        console.error('❌ Update complaint error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Delete complaint (authority/admin only)
app.delete('/api/complaints/:reference', requireAuthorityOrAdmin, (req, res) => {
    try {
        const ref = req.params.reference;
        if (!ref) return res.status(400).json({ error: 'Missing reference' });

        const filePath = path.join(__dirname, 'data', 'complaints.json');
        let complaints = [];
        if (fs.existsSync(filePath)) {
            try { complaints = JSON.parse(fs.readFileSync(filePath, 'utf8')); if (!Array.isArray(complaints)) complaints = []; } catch (e) { complaints = []; }
        }

        const idx = complaints.findIndex(c => c.reference === ref);
        if (idx === -1) return res.status(404).json({ error: 'Complaint not found' });

        const deleted = complaints.splice(idx, 1)[0];
        fs.writeFileSync(filePath, JSON.stringify(complaints, null, 2), 'utf8');
        console.log('✅ Complaint deleted:', deleted.reference);
        return res.json({ ok: true, reference: deleted.reference });
    } catch (err) {
        console.error('❌ Delete complaint error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Start Server with robust error handling and retry on port conflict
const server = http.createServer(app);

function tryListen(startPort, maxAttempts = 10) {
    let attempts = 0;
    let port = Number(startPort) || 8000;

    function attempt() {
        if (attempts >= maxAttempts) {
            console.error(`⚠️ Failed to bind server after ${attempts} attempts.`);
            process.exit(1);
        }

        server.listen(port, () => {
            console.log(`✅ Server running at http://localhost:${port}`);
            // update process.env.PORT for downstream tools
            process.env.PORT = String(port);
        });
    }

    server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
            console.warn(`Port ${port} in use, trying ${port + 1}...`);
            attempts += 1;
            port += 1;
            // small delay before retrying
            setTimeout(() => attempt(), 300);
            return;
        }
        console.error('Server error:', err);
        process.exit(1);
    });

    attempt();
}

// Start trying from configured PORT
tryListen(PORT, 20);

// Graceful shutdown
function shutdown(signal) {
    console.log(`\nReceived ${signal}. Shutting down server...`);
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
    // Force exit after timeout
    setTimeout(() => process.exit(1), 5000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    shutdown('uncaughtException');
});
