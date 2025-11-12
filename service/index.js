const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const fetch = require('node-fetch');
const DB = require('./database.js');

const authCookieName = 'token';
// Verses to pull from the API using fetch
const popularVerses = [
    '1 Nephi 3:7',
    '2 Nephi 2:25',
    'Mosiah 2:17',
    'Alma 37:6',
    'Ether 12:27',
    'Moroni 10:5',
    'Doctrine and Covenants 123:17',
    'Doctrine and Covenants 50:24',
    'Matthew 5:14-16',
    'John 3:16',
    'Romans 8:28',
    'Philippians 4:13',
    'Mosiah 18:9',
    'Alma 37:35',
];

// Service port
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Router for API endpoints
const apiRouter = express.Router();
app.use('/api', apiRouter);

/* ---------------- AUTH ENDPOINTS ---------------- */

// Register new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.email, req.body.password);
        setAuthCookie(res, user.token);
        res.send({ email: user.email });
    }
});

// Login existing user
apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('email', req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        user.token = uuid.v4();
        await DB.updateUser(user);
        setAuthCookie(res, user.token);
        res.send({ email: user.email });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Logout user
apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        delete user.token;
        DB.updateUser(user);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// Middleware to secure endpoints
const verifyAuth = async (req, res, next) => {
    const token = req.cookies[authCookieName];
    const user = await findUser('token', token);
    if (user) {
        req.userEmail = user.email; // Attach email to request
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

// Get all assignments for logged-in user
apiRouter.get('/assignments', verifyAuth, (req, res) => {
    const userAssignments = tasks.filter(a => a.userEmail === req.userEmail);
    res.send(userAssignments);
});

// Add a new assignment
apiRouter.post('/assignments', verifyAuth, (req, res) => {
    const { className, task, due } = req.body;
    if (!className || !task || !due) return res.status(400).send({ msg: 'Missing fields' });

    const newAssignment = {
        id: Date.now(),
        userEmail: req.userEmail,
        className,
        task,
        due,
    };
    tasks.push(newAssignment);
    res.send(newAssignment);
});

// Delete an assignment
apiRouter.delete('/assignments/:id', verifyAuth, (req, res) => {
    const assignmentId = Number(req.params.id);
    tasks = tasks.filter(a => !(a.id === assignmentId && a.userEmail === req.userEmail));
    res.status(204).end();
});

// Gets a random verse from the API using the list above
apiRouter.get('/verse', async (req, res) => {
    try {
        // Pick the reference from query or a random popular verse
        const ref = req.query.ref || popularVerses[Math.floor(Math.random() * popularVerses.length)];
        const url = `https://api.nephi.org/scriptures/?q=${encodeURIComponent(ref)}`;

        const response = await fetch(url);
        if (!response.ok) {
            return res.status(502).json({ error: 'Failed to fetch from Nephi API' });
        }

        const data = await response.json();
        if (!data.scriptures || data.scriptures.length === 0) {
            return res.status(404).json({ error: 'Verse not found' });
        }

        const verse = data.scriptures[0];
        res.json({ verse: `${verse.scripture}: ${verse.text}` });

    } catch (err) {
        console.error('Verse fetch error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/* ---------------- HELPER FUNCTIONS ---------------- */
async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        email,
        password: passwordHash,
        token: uuid.v4()
    };
    await DB.addUser(user);
    return user;
}

async function findUser(field, value) {
    if (!value) return null;

    if (field === 'token') {
        return DB.getUserByToken(value);
    }
    return DB.getUser(value);
}

function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

/* ---------------- DEFAULT HANDLERS ---------------- */
// Catch all unknown routes and serve frontend
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// Default error handler
app.use((err, req, res, next) => {
    res.status(500).send({ type: err.name, message: err.message });
});

/* ---------------- START SERVER ---------------- */
app.listen(port, () => {
    console.log(`Procrastinot backend listening on port ${port}`);
});