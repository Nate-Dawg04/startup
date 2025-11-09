const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const fetch = require('node-fetch');

const authCookieName = 'token';

// Memory storage for users and tasks (instead of scores)
let users = [];
let tasks = [];

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
        setAuthCookie(res, user.token);
        res.send({ email: user.email });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Logout user
apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) delete user.token;
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

// Fetch scripture verse from Nephi API
apiRouter.get('/verse', async (req, res) => {
    try {
        const ref = req.query.ref;
        if (!ref) return res.status(400).json({ error: 'Missing verse reference' });

        // Use correct API endpoint
        const url = `https://api.nephi.org/scriptures/?q=${ref}`;
        console.log(`Fetching from Nephi API: ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
            console.error('Nephi API error:', response.status, response.statusText);
            return res.status(502).json({ error: 'Failed to fetch from Nephi API' });
        }

        const data = await response.json();

        // The verse is inside data.scriptures[0]
        if (!data.scriptures || data.scriptures.length === 0) {
            return res.status(404).json({ error: 'Verse not found' });
        }

        const verse = data.scriptures[0];
        const verseText = `${verse.scripture}: ${verse.text}`;
        res.json({ verse: verseText });

    } catch (err) {
        console.error('Verse fetch failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/* ---------------- HELPER FUNCTIONS ---------------- */
async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { email, password: passwordHash, token: uuid.v4() };
    users.push(user);
    return user;
}

async function findUser(field, value) {
    if (!value) return null;
    return users.find(u => u[field] === value);
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