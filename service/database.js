const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const assignmentCollection = db.collection('assignments');
const goalCollection = db.collection('goal');
const gospelPlanCollection = db.collection('gospelPlan');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    try {
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
    await assignmentCollection.insertOne(assignment);
}

async function getAssignmentByUser(email) {
    return assignmentCollection.find({ userEmail: email }.toArray());
}

async function deleteAssignment(id, email) {
    return assignmentCollection.deleteOne({ _id: newObjectId(id), userEmail: email });
}

async function updateAssignment(id, email, updates) {
    return assignmentCollection.updateOne(
        { _id: new ObjectId(id), userEmail: email },
        { $set: { ...updates, updatedAt: new Date() } }
    );
}

/* GOALS STUFF */
async function addGoal(goal) {
    return goalCollection.insertOne(goal);
}

async function getGoalsByUser(email) {
    return goalCollection.find({ _id: new ObjectId(id), userEmail: email }.toArray());
}

async function deleteGoal(id, email) {
    goalCollection.deleteOne({ _id: newObjectId(id), userEmail: email });
}

/* GOSPEL PLAN STUFF */
async function addGospelPlan(plan) {
    return gospelPlanCollection.insertOne(plan);
}

async function getGospelPlansByUser(email) {
    return gospelPlanCollection.find({ _id: newObjectId(id), userEmail: email }.toArray());
}

async function deleteGospelPlan(id, email) {
    return gospelPlanCollection.deleteOne({ _id: newObjectId(id), userEmail: email });
}

module.exports = {
    getUser, getUserByToken, addUser, updateUser,
    addAssignment, getAssignmentsByUser, deleteAssignment, updateAssignment,
    addGoal, getGoalsByUser, deleteGoal,
    addGospelPlan, getGospelPlansByUser, deleteGospelPlan
};
