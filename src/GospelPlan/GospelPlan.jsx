import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GospelPlan.css';

export function GospelPlan({ weeklyPlan, setWeeklyPlan }) {
    // useState for the recently read stuff
    const [recentlyRead, setRecentlyRead] = useState([]);

    // useStates to allow for editing
    const [editingId, setEditingId] = useState(null);
    const [tempReading, setTempReading] = useState('');

    // useState for the message for a new week
    const [message, setMessage] = useState('');

    // Function to mark the reading as complete, and add the entry to recentlyRead
    function handleCompleteReading(id) {
        // Find the item first
        const completedItem = weeklyPlan.find(item => item.id === id);

        if (!completedItem) return;

        // Only proceed if there's something in the reading
        if (!completedItem.reading || completedItem.reading.trim() === "") {
            alert("Nice try! No reading was completed");
            return;
        }

        // Mark the item as completed in the weekly plan
        setWeeklyPlan(prevPlan =>
            prevPlan.map(item =>
                item.id === id ? { ...item, completed: true } : item
            )
        );

        // Add to recentlyRead
        const nextId = recentlyRead.length ? Math.max(...recentlyRead.map(r => r.id)) + 1 : 1;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        setRecentlyRead([...recentlyRead, { id: nextId, title: completedItem.reading, date: today }]);
    }

    // Updates the correct item's reading value and exits edit mode
    function handleSaveEdit(id) {
        setWeeklyPlan(prev =>
            prev.map(item =>
                item.id === id ? { ...item, reading: tempReading } : item
            )
        );
        setEditingId(null);
        setTempReading('');
    }

    // Function for starting a new week
    function handleStartNewWeek() {
        const confirmed = window.confirm("Start a new weekly plan? This will clear all readings and progress.");
        if (!confirmed) return;

        const resetPlan = weeklyPlan.map(item => ({
            ...item,
            reading: '',
            completed: false
        }));

        setWeeklyPlan(resetPlan);
        setMessage("🆕 New week started — add your readings!");
        setTimeout(() => setMessage(""), 3000);
    }
    return (
        <main className="flex-grow-1">
            <h1>Gospel Study Plan</h1>
            <div className="container">
                <div className="row">

                    {/* <!-- Weekly Plan Column --> */}
                    <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                        <h3 className="WeekPlan">
                            This Week's Plan:
                        </h3>
                        <div className="table-responsive w-auto">

                            {/* <!-- Table with all the Data (placeholders) --> */}
                            <table className="table table-striped mt-3">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Reading</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weeklyPlan.map(item => (
                                        <tr
                                            key={item.id}
                                            className={item.completed ? 'completed-row' : ''}
                                        >
                                            <td>{item.day}</td>
                                            <td
                                                onClick={() => {
                                                    setEditingId(item.id);
                                                    setTempReading(item.reading);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {editingId === item.id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={tempReading}
                                                        autoFocus
                                                        onChange={(e) => setTempReading(e.target.value)}
                                                        onBlur={() => handleSaveEdit(item.id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveEdit(item.id);
                                                        }}
                                                    />
                                                ) : (
                                                    item.reading || <span className="text-muted fst-italic">Click to add reading...</span>
                                                )}
                                            </td>
                                            <td>
                                                {item.completed ? (
                                                    <span className="text-success fw-bold">Done ✅</span>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleCompleteReading(item.id)}
                                                        disabled={!item.reading || item.reading.trim() === ""}
                                                    >
                                                        Finished
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                className="btn btn-primary mt-2"
                                onClick={handleStartNewWeek}
                            >
                                Start New Week
                            </button>

                            {message && <div className="text-success mt-2">{message}</div>}
                        </div>
                    </div>

                    {/* <!-- Past Items Studied Column --> */}
                    <div className="col-12 col-lg-6 mb-3 mb-lg-0">

                        <h3>
                            Recently Read:
                        </h3>

                        {/* <!-- Scrollable recently read list, storted by the date they were read --> */}
                        <div className="recently-read-scrollable">
                            <ol className="list-group list-group-numbered mb-0">

                                {[...recentlyRead]
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map(item => (
                                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">{item.title}</div>
                                                <b>Read:</b> {new Date(item.date).toLocaleDateString()}
                                            </div>
                                        </li>
                                    ))}
                            </ol>
                        </div>

                        {/* <!-- coming soon... --> */}
                        <p className="placeholders"><b>Database</b> to store things that have been read</p>
                        <p className="placeholders"><b>Websocket data</b> that shows what others have been reading and what's
                            popular worldwide</p>

                    </div>
                </div>
            </div>

            {/* <!-- coming soon... --> */}
            <p className="placeholders"><b>3rd Party API</b> to create weekly study plans and get ideas for new study material
            </p>
        </main>
    );
}