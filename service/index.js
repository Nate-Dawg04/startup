const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());

// Serve static files (used after deployment)
app.use(express.static('public'));

const authCookieName = 'token';
let users = [];
let goals = []; // You can rename this to whatever fits your app (e.g., “assignments”, “tasks”)

let apiRouter = express.Router();
app.use('/api', apiRouter);

// --- AUTH ENDPOINTS ---
// Create user
apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.email, req.body.password);
        setAuthCookie(res, user.token);
        res.send({ email: user.email });
    }
});

// Login
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

// Logout
apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) delete user.token;
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// --- MOCK DATA ENDPOINTS ---
// Example: Get all graded assignments / goals / etc.
apiRouter.get('/goals', verifyAuth, (_req, res) => {
    res.send(goals);
});

// Example: Add a new goal
apiRouter.post('/goal', verifyAuth, (req, res) => {
    const newGoal = { id: uuid.v4(), ...req.body };
    goals.unshift(newGoal);
    res.send(goals);
});

// --- AUTH HELPERS ---
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { email, password: passwordHash, token: uuid.v4() };
    users.push(user);
    return user;
}

async function findUser(field, value) {
    if (!value) return null;
    return users.find((u) => u[field] === value);
}

async function verifyAuth(req, res, next) {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) next();
    else res.status(401).send({ msg: 'Unauthorized' });
}

// Default route (for deployment)
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`✅ Startup service running on port ${port}`);
});