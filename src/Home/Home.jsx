import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'

export function Home({ assignments, goals, weeklyPlan }) {
    // Sort assignments by most urgent, shows only 7
    const upcomingAssignments = [...assignments]
        .sort((a, b) => new Date(a.due) - new Date(b.due))
        .slice(0, 7);
    return (
        <main className="flex-grow-1">
            <h1>Home</h1>
            <div className="container">
                {/* <!-- Welcome Text --> */}
                <section className="welcome">Welcome to Procrastinot, <b>[User name here]</b>! The all-in-one place to manage
                    your school assignments, goals, and gospel study plan. Here's your snapshot: </section>

                <div className="row">
                    {/* <!-- Upcoming Assignments Snapshot --> */}
                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                        <header className="Snapshots">Upcoming Assignments</header>
                        <div className="SnapshotData">
                            {upcomingAssignments.length === 0 ? (
                                <p className="text-muted text-center">No upcoming assignments</p>
                            ) : (
                                <ul className="list-unstyled mb-0">
                                    {upcomingAssignments.map(a => (
                                        <li key={a.id}>
                                            <b>{a.className}:</b> {a.task} — {new Date(a.due).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* <!-- Goals Snapshot --> */}
                    {/* <!-- Goals Snapshot --> */}
                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                        <header className="Snapshots">Goals</header>
                        <div className="SnapshotData">
                            {goals.length === 0 ? (
                                <p className="text-muted text-center">No goals set</p>
                            ) : (
                                <ul className="list-unstyled mb-0">
                                    {goals.map(g => (
                                        <li key={g.id}>
                                            {g.task} — {g.progress}%
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* <!-- Gospel Study Plan Snapshot --> */}
                    {/* <!-- Gospel Study Plan Snapshot --> */}
                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                        <header className="Snapshots">Gospel Study Plan</header>
                        <div className="SnapshotData">
                            {weeklyPlan.length === 0 ? (
                                <p className="text-muted text-center">No plan set</p>
                            ) : (
                                <ul className="list-unstyled mb-0">
                                    {weeklyPlan.map(day => (
                                        <li key={day.id}>
                                            <b>{day.day}:</b> {day.reading || <em>No reading yet</em>} {day.completed ? '✅' : ''}
                                        </li>
                                    ))}
                                </ul>
                            )}
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