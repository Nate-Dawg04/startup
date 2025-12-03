const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const fetch = require('node-fetch');
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy');

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
        await DB.updateUser(user);
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

/* ASSIGNMENTS */

// Get all assignments for logged-in user
apiRouter.get('/assignments', verifyAuth, async (req, res) => {
    const userAssignments = await DB.getAssignmentsByUser(req.userEmail);
    res.send(userAssignments);
});

// Add a new assignment
apiRouter.post('/assignments', verifyAuth, async (req, res) => {
    const { className, task, due } = req.body;
    if (!className || !task || !due) return res.status(400).send({ msg: 'Missing fields' });

    const newAssignment = {
        userEmail: req.userEmail,
        className,
        task,
        due,
        createdAt: new Date(),
    };
    const result = await DB.addAssignment(newAssignment);
    res.status(201).send({ ...newAssignment, _id: result.insertedId });
});

// Delete an assignment
apiRouter.delete('/assignments/:id', verifyAuth, async (req, res) => {
    await DB.deleteAssignment(req.params.id, req.userEmail);
    res.status(204).end();
});


/* GOALS */

// Get all goals for logged-in user
apiRouter.get('/goals', verifyAuth, async (req, res) => {
    const userGoals = await DB.getGoalsByUser(req.userEmail);
    res.send(userGoals);
});

// Add a new goal
apiRouter.post('/goals', verifyAuth, async (req, res) => {
    const { task, progress } = req.body;
    if (!task) return res.status(400).send({ msg: 'Missing task' });

    const newGoal = {
        userEmail: req.userEmail,
        task,
        progress: progress || 0,
        createdAt: new Date(),
    };

    const result = await DB.addGoal(newGoal);
    res.status(201).send({ ...newGoal, _id: result.insertedId });
});

// Delete a goal
apiRouter.delete('/goals/:id', verifyAuth, async (req, res) => {
    await DB.deleteGoal(req.params.id, req.userEmail);
    res.status(204).end();
});

// Update goal progress
apiRouter.patch('/goals/:id', verifyAuth, async (req, res) => {
    try {
        const { progress } = req.body;
        const updatedGoal = await DB.updateGoalProgress(req.params.id, req.userEmail, progress);
        res.send(updatedGoal);
    } catch (err) {
        console.error('PATCH /goals/:id error:', err);
        res.status(500).send({ error: err.message });
    }
});

/* GOSPEL STUDY PLAN */

// Get all gospel plans for the logged-in user
apiRouter.get('/gospelPlan', verifyAuth, async (req, res) => {
    try {
        const plan = await DB.getGospelPlansByUser(req.userEmail);
        res.send(plan);
    } catch (err) {
        console.error('GET /gospelPlan error:', err);
        res.status(500).send({ error: err.message });
    }
});

// Add a new gospel plan item
apiRouter.post('/gospelPlan', verifyAuth, async (req, res) => {
    try {
        const { day, reading, completed } = req.body;
        if (!day) return res.status(400).send({ msg: 'Missing day' });

        const newPlan = {
            userEmail: req.userEmail,
            day,
            reading,
            completed: completed || false,
            createdAt: new Date()
        };

        const result = await DB.addGospelPlan(newPlan);
        res.status(201).send({ ...newPlan, _id: result.insertedId });
    } catch (err) {
        console.error('POST /gospelPlan error:', err);
        res.status(500).send({ error: err.message });
    }
});

// Update a gospel plan item (e.g., change reading or mark as completed)
apiRouter.patch('/gospelPlan/:id', verifyAuth, async (req, res) => {
    try {
        const { reading, completed } = req.body;
        const id = req.params.id;
        const email = req.userEmail;

        const updateFields = {};
        if (reading !== undefined) updateFields.reading = reading;
        if (completed !== undefined) updateFields.completed = completed;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).send({ error: 'No valid fields provided' });
        }

        const updated = await DB.updateGospelPlan(id, email, updateFields);
        if (!updated) return res.status(404).send({ error: 'Plan item not found' });

        // Remove the reading from recently read ONLY if marking incomplete
        if (completed === false && updated.reading) {
            await DB.removeRecentlyReadItem(email, updated.reading);
        }

        res.send(updated);
    } catch (err) {
        console.error('PATCH /gospelPlan/:id error:', err);
        res.status(500).send({ error: err.message });
    }
});

// Reset gospel plan for the logged-in user
apiRouter.post('/gospelPlan/reset', verifyAuth, async (req, res) => {
    try {
        const newWeek = await DB.resetGospelPlanForUser(req.userEmail);
        res.status(201).send(newWeek);
    } catch (err) {
        console.error('POST /gospelPlan/reset error:', err);
        res.status(500).send({ error: err.message });
    }
});

/* RECENTLY READ */
// Get recently read items
apiRouter.get('/recentlyRead', verifyAuth, async (req, res) => {
    try {
        const items = await DB.getRecentlyReadByUser(req.userEmail);
        res.send(items.map(i => ({ ...i, _id: i._id.toString() })));
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

// Add a new recently read item
apiRouter.post('/recentlyRead', verifyAuth, async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).send({ msg: 'Missing title' });

        const date = new Date();
        const result = await DB.addRecentlyRead(req.userEmail, title, date);
        res.status(201).send({ _id: result.insertedId.toString(), title, date });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

/* VERSES */

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
const server = app.listen(port, () => {
    console.log(`Startup backend + WebSocket running on port ${port}`);
});

peerProxy(server);