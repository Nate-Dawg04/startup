const { MongoClient, ObjectId } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const assignmentCollection = db.collection('assignments');
const goalCollection = db.collection('goal');
const gospelPlanCollection = db.collection('gospelPlan');
const recentlyReadCollection = db.collection('recentlyRead');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log(`Connected to database`);
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
    }
})();

/* USER STUFF */

function getUser(email) {
    return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function addUser(user) {
    await userCollection.insertOne(user);
}

async function updateUser(user) {
    await userCollection.updateOne({ email: user.email }, { $set: user });
}


/* ASSIGNMENT STUFF */
async function addAssignment(assignment) {
    return assignmentCollection.insertOne(assignment);
}

async function getAssignmentsByUser(email) {
    return assignmentCollection.find({ userEmail: email }).toArray();
}

async function deleteAssignment(id, email) {
    return assignmentCollection.deleteOne({ _id: new ObjectId(id), userEmail: email });
}

/* GOALS STUFF */
async function addGoal(goal) {
    return goalCollection.insertOne(goal);
}

async function getGoalsByUser(email) {
    return goalCollection.find({ userEmail: email }).toArray();
}

async function deleteGoal(id, email) {
    return goalCollection.deleteOne({ _id: new ObjectId(id), userEmail: email });
}

async function updateGoalProgress(id, email, progress) {
    if (!id || !email) throw new Error("Missing id or email");
    const objId = new ObjectId(id); // will throw if id is invalid
    const numProgress = Math.min(100, Math.max(0, Number(progress) || 0));

    const result = await goalCollection.updateOne(
        { _id: objId, userEmail: email },
        { $set: { progress: numProgress } }
    );

    if (result.matchedCount === 0) {
        throw new Error("Goal not found or user mismatch");
    }

    const updatedGoal = await goalCollection.findOne({ _id: objId, userEmail: email });
    if (updatedGoal) updatedGoal._id = updatedGoal._id.toString();
    return updatedGoal;
}

/* GOSPEL PLAN STUFF */
async function addGospelPlan(plan) {
    return gospelPlanCollection.insertOne(plan);
}

async function getGospelPlansByUser(email) {
    return await gospelPlanCollection
        .find({ userEmail: email })
        .sort({ createdAt: 1 })
        .toArray();
}

async function updateGospelPlan(id, email, fields) {
    const objId = new ObjectId(id);
    await gospelPlanCollection.updateOne(
        { _id: objId, userEmail: email },
        { $set: fields }
    );
    const updated = await gospelPlanCollection.findOne({ _id: objId, userEmail: email });
    if (updated) updated._id = updated._id.toString();
    return updated;
}

async function resetGospelPlanForUser(email) {
    // Delete all existing plan items
    await gospelPlanCollection.deleteMany({ userEmail: email });

    // Create default week
    const defaultWeek = [
        { day: 'Monday', reading: '', completed: false, userEmail: email, createdAt: new Date() },
        { day: 'Tuesday', reading: '', completed: false, userEmail: email, createdAt: new Date() },
        { day: 'Wednesday', reading: '', completed: false, userEmail: email, createdAt: new Date() },
        { day: 'Thursday', reading: '', completed: false, userEmail: email, createdAt: new Date() },
        { day: 'Friday', reading: '', completed: false, userEmail: email, createdAt: new Date() },
        { day: 'Saturday', reading: '', completed: false, userEmail: email, createdAt: new Date() },
        { day: 'Sunday', reading: '', completed: false, userEmail: email, createdAt: new Date() },
    ];

    const result = await gospelPlanCollection.insertMany(defaultWeek);

    return Object.values(result.insertedIds).map((id, i) => ({
        ...defaultWeek[i],
        _id: id
    }));
}

/* Recently Read functionality (within Gospel Plan) */
// Get recently read for a user
async function getRecentlyReadByUser(email) {
    return recentlyReadCollection
        .find({ userEmail: email })
        .sort({ date: -1 }) // newest first
        .limit(50)
        .toArray();
}

// Get recently read for all users (for the websocket part)
async function getRecentlyReadAll(limit = 50) {
    return recentlyReadCollection
        .find({})          // all emails
        .sort({ date: -1 }) // newest first
        .limit(limit)
        .toArray();
}


// Add a new recently read item
async function addRecentlyRead(userEmail, title, date) {
    return recentlyReadCollection.insertOne({ userEmail, title, date });
}

// Remove a single recently read item by title for a user
async function removeRecentlyReadItem(userEmail, title) {
    return recentlyReadCollection.deleteOne({ userEmail, title });
}

module.exports = {
    getUser, getUserByToken, addUser, updateUser,
    addAssignment, getAssignmentsByUser, deleteAssignment,
    addGoal, getGoalsByUser, deleteGoal, updateGoalProgress,
    addGospelPlan, getGospelPlansByUser, updateGospelPlan, resetGospelPlanForUser,
    getRecentlyReadByUser, addRecentlyRead, removeRecentlyReadItem,
    getRecentlyReadAll,
};
