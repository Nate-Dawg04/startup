import React, { useState, useEffect } from 'react';
// import { Verses } from '../GospelPlan/Verses.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'

export function Home({ assignments, goals, weeklyPlan, userName }) {
    // Sort assignments by most urgent, shows only 7
    const upcomingAssignments = [...assignments]
        .sort((a, b) => new Date(a.due) - new Date(b.due))
        .slice(0, 7);

    const [verse, setVerse] = useState('');


    // UseEffect to get random verse (from above list) from the API
    useEffect(() => {
        async function fetchRandomVerse() {
            try {
                const res = await fetch('/api/verse');
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setVerse(data.verse || 'Verse not found.');
            } catch (err) {
                console.error('Failed to fetch verse:', err);
                setVerse('Unable to fetch verse at this time.');
            }
        }

        fetchRandomVerse();
        const interval = setInterval(fetchRandomVerse, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="flex-grow-1">
            <h1>Home</h1>
            <div className="container">
                {/* <!-- Welcome Text --> */}
                <section className="welcome">Welcome to Procrastinot, <b>{userName}</b>! The all-in-one place to manage
                    your school assignments, goals, and gospel study plan. Here's your snapshot: </section>

                {/* Gospel Verse Display */}
                <section className="mt-3 text-center">
                    <div className="alert alert-light border shadow-sm d-inline-block px-4 py-2">
                        <em>{verse}</em>
                    </div>
                </section>
                <div className="row">
                    {/* <!-- Upcoming Assignments Snapshot --> */}
                    <div className="col-12 col-lg-4">
                        <div className="card shadow-sm">
                            <div className="snapshot-card-header">Upcoming Assignments</div>
                            <div className="card-body p-0">
                                {upcomingAssignments.length === 0 ? (
                                    <p className="text-center m-2 text-muted">No upcoming assignments</p>
                                ) : (
                                    <table className="table table-striped mb-0">
                                        <thead>
                                            <tr>
                                                <th>Class</th>
                                                <th>Assignment</th>
                                                <th>Due</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {upcomingAssignments.map(a => (
                                                <tr key={a.id}>
                                                    <td>{a.className}</td>
                                                    <td>{a.task}</td>
                                                    <td>{new Date(a.due + 'T00:00').toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* <!-- Goals Snapshot --> */}
                    <div className="col-12 col-lg-4">
                        <div className="card shadow-sm">
                            <div className="snapshot-card-header">Goals</div>
                            <div className="card-body p-0">
                                {goals.length === 0 ? (
                                    <p className="text-center m-2 text-muted">No goals set</p>
                                ) : (
                                    <table className="table table-striped mb-0">
                                        <thead>
                                            <tr>
                                                <th>Goal</th>
                                                <th>Progress</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {goals.map(g => (
                                                <tr key={g.id}>
                                                    <td>{g.task}</td>
                                                    <td>{g.progress}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* <!-- Gospel Study Plan Snapshot --> */}
                    <div className="col-12 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="snapshot-card-header">Weekly Plan</div>
                            <div className="card-body p-0">
                                {weeklyPlan.length === 0 ? (
                                    <p className="text-center m-2 text-muted">No plan set</p>
                                ) : (
                                    <table className="table table-striped mb-0">
                                        <thead>
                                            <tr>
                                                <th>Day</th>
                                                <th>Reading</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {weeklyPlan.map(day => (
                                                <tr key={day.id}>
                                                    <td>{day.day}</td>
                                                    <td>{day.reading || <em>Nothing Planned</em>}</td>
                                                    <td>{day.completed ? '✅' : ''}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* <!-- Picture of Pres Nelson (with animation) --> */}
                    <div className="col-12 text-center slide-in picture-box">
                        <img className="img-fluid mb-2" src="/PresNelson.jpg" alt="President Nelson" style={{ maxWidth: '400px' }} />
                        <p className="mb-0">President Nelson is cheering you on!</p>
                    </div>
                </div>
            </div >
        </main >
    );
}