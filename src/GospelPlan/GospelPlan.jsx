import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GospelPlan.css';

export function GospelPlan({ weeklyPlan, setWeeklyPlan }) {
    // useState for the recently read stuff
    const [recentlyRead, setRecentlyRead] = useState([]);

    // current user state
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const currentUserRef = useRef('');

    useEffect(() => {
        currentUserRef.current = currentUserEmail;
    }, [currentUserEmail]);

    //useStates for editing the readings
    const [newDay, setNewDay] = useState('');
    const [newReading, setNewReading] = useState('');

    // useStates for the mock API call for reading suggestions
    const [topic, setTopic] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    // useStates to allow for editing
    const [editingId, setEditingId] = useState(null);
    const [tempReading, setTempReading] = useState('');

    // useState for the message for a new week
    const [message, setMessage] = useState('');

    // useState for the other users recently read stuff
    const [otherUsersRecentlyRead, setOtherUsersRecentlyRead] = useState([]);

    // useRef for websocket
    const wsRef = useRef(null);

    // useEffect to get the current user (for websocket)
    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const res = await fetch('/api/me', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setCurrentUserEmail(data.userEmail);

                // Initialize WebSocket after getting email
                const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
                const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);
                wsRef.current = ws;

                ws.onopen = () => console.log('WebSocket connected');
                ws.onclose = () => console.log('WebSocket disconnected');

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);

                    const wsEmail = (data.userEmail || '').trim().toLowerCase();
                    const me = (currentUserRef.current || '').trim().toLowerCase();

                    if (!wsEmail || wsEmail === me) {
                        return; // ignore own or malformed events
                    }

                    setOtherUsersRecentlyRead(prev => [data, ...prev]);
                };

            } catch (err) {
                console.error(err);
            }
        }
        fetchCurrentUser();

        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    // useEffect to get all recently read Items (excluding the user) for the other user list
    useEffect(() => {
        if (!currentUserEmail) return;

        async function fetchOtherUsersRecentlyRead() {
            try {
                const res = await fetch('/api/recentlyRead/all', { credentials: 'include' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();

                const me = currentUserEmail.trim().toLowerCase();
                const filtered = data.filter(item =>
                    (item.userEmail || '').trim().toLowerCase() !== me
                );

                setOtherUsersRecentlyRead(filtered);
            } catch (err) {
                console.error('Fetch other users failed:', err);
            }
        }

        // Initial load
        fetchOtherUsersRecentlyRead();

        // Refresh when tab becomes visible (fix for google chrome)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchOtherUsersRecentlyRead();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [currentUserEmail]);



    // stores recentlyRead stuff in local storage
    useEffect(() => {
        localStorage.setItem('procrastinot_recentlyRead', JSON.stringify(recentlyRead));
    }, [recentlyRead]);

    // loads the gospel plan saved in the DB
    useEffect(() => {
        async function fetchPlans() {
            try {
                const res = await fetch('/api/gospelPlan', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch gospel plans');
                const data = await res.json();

                if (data.length === 0) {
                    // no data in DB → create a default week
                    const defaultWeek = [
                        { day: 'Monday', reading: '', completed: false },
                        { day: 'Tuesday', reading: '', completed: false },
                        { day: 'Wednesday', reading: '', completed: false },
                        { day: 'Thursday', reading: '', completed: false },
                        { day: 'Friday', reading: '', completed: false },
                        { day: 'Saturday', reading: '', completed: false },
                        { day: 'Sunday', reading: '', completed: false },
                    ];

                    // save default to DB
                    const created = await Promise.all(
                        defaultWeek.map(async (item) => {
                            const res = await fetch('/api/gospelPlan', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify(item),
                            });
                            return await res.json();
                        })
                    );

                    setWeeklyPlan(created.map(p => ({ ...p, _id: p._id.toString() })));
                } else {
                    setWeeklyPlan(data.map(p => ({ ...p, _id: p._id.toString() })));
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchPlans();
    }, []);

    // Loads the recently read stuff from the database
    useEffect(() => {
        async function fetchRecentlyRead() {
            try {
                const res = await fetch('/api/recentlyRead', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch recently read');
                const data = await res.json();
                setRecentlyRead(data); // show all items, scrollable
            } catch (err) {
                console.error(err);
            }
        }
        fetchRecentlyRead();
    }, []);

    // Function for adding items to the plan
    async function handleAddPlanItem(e) {
        e.preventDefault();
        if (!newDay || !newReading) return;

        try {
            const res = await fetch('/api/gospelPlan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ day: newDay, reading: newReading }),
            });

            if (!res.ok) throw new Error('Failed to add plan item');
            const newItem = await res.json();
            setWeeklyPlan(prev => [...prev, { ...newItem, _id: newItem._id.toString() }]);
            setNewDay('');
            setNewReading('');
        } catch (err) {
            console.error('Error adding plan item:', err);
        }
    }

    // Function to mark the reading as complete, and add the entry to recentlyRead
    async function handleCompleteReading(id) {
        const completedItem = weeklyPlan.find(item => item._id === id);
        if (!completedItem || !completedItem.reading.trim()) return;

        // 1. Update weekly plan state
        setWeeklyPlan(prev =>
            prev.map(item =>
                item._id === id ? { ...item, completed: true } : item
            )
        );

        // 2. Save completed status to DB
        if (completedItem._id) {
            try {
                await fetch(`/api/gospelPlan/${completedItem._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: true }),
                    credentials: 'include'
                });
            } catch (err) {
                console.error('Failed to update plan item:', err);
            }
        }

        // 3. Add to recently read DB and update live list
        try {
            const res = await fetch('/api/recentlyRead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: completedItem.reading }),
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to save recently read');

            const newItem = await res.json();

            // Update recentlyRead state live
            setRecentlyRead(prev => [newItem, ...prev]);

            // After saving to DB, update via websocket for other users
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    title: completedItem.reading,
                    userEmail: currentUserEmail,
                    date: new Date().toISOString()
                }));
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Updates the correct item's reading value and exits edit mode
    async function handleSaveEdit(id) {
        setWeeklyPlan(prev =>
            prev.map(item =>
                item._id === id ? { ...item, reading: tempReading } : item
            )
        );

        // Save to DB
        const planItem = weeklyPlan.find(item => item._id === id);
        if (planItem) {
            try {
                await fetch(`/api/gospelPlan/${planItem._id}`, {
                    method: 'PATCH', // optional: you can create a PATCH endpoint if you want incremental edits
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reading: tempReading }),
                    credentials: 'include'
                });
            } catch (err) {
                console.error(err);
            }
        }

        setEditingId(null);
        setTempReading('');
    }

    // Function for starting a new week
    async function handleStartNewWeek() {
        const confirmed = window.confirm("Start a new weekly plan? This will clear all readings and progress.");
        if (!confirmed) return;

        try {
            const res = await fetch('/api/gospelPlan/reset', {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to reset week');

            const newWeek = await res.json();
            setWeeklyPlan(newWeek.map(p => ({ ...p, _id: p._id.toString() })));
            setMessage("🆕 New week started — add your readings!");
            setTimeout(() => setMessage(""), 3000);

        } catch (err) {
            console.error(err);
        }
    }

    // Function for the mock API call to generate reading suggestions
    function generateSuggestionsMock() {
        if (!topic.trim()) return;

        setLoading(true);
        setSuggestions([]);

        setTimeout(() => {
            const keywords = topic.split(',').map(k => k.trim());
            const generated = keywords.flatMap(k => [
                `[Insert chapter on ${k} from the Book of Mormon here]`,
                `[Insert General Conference talk about ${k} here]`,
                `[Insert related scriptures on ${k} here]`
            ]);
            setSuggestions(Array.from(new Set(generated)).slice(0, 5));
            setLoading(false);
        }, 1200); // simulate API latency
    }

    // Toggle completion of a reading
    async function handleToggleReading(id) {
        const item = weeklyPlan.find(p => p._id === id);
        if (!item || !item.reading) return;

        const newCompleted = !item.completed;

        try {
            const res = await fetch(`/api/gospelPlan/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: newCompleted }),
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to update reading');

            const updatedItem = await res.json();

            // Update weeklyPlan state
            setWeeklyPlan(prev =>
                prev.map(p => p._id === id ? updatedItem : p)
            );

            // If marking complete, add to recentlyRead
            if (newCompleted) {
                const res2 = await fetch('/api/recentlyRead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: item.reading }),
                    credentials: 'include'
                });
                if (!res2.ok) throw new Error('Failed to add to recently read');
                const newItem = await res2.json();

                setRecentlyRead(prev => [newItem, ...prev]);
            } else {
                // Remove from recentlyRead state if marking incomplete
                setRecentlyRead(prev =>
                    prev.filter(r => r.title !== item.reading)
                );
            }
        } catch (err) {
            console.error(err);
        }
    }

    // useEffect to get all the recently Read stuff for everyone except the current user
    useEffect(() => {
        async function fetchOtherUsersRecentlyRead() {
            try {
                const res = await fetch('/api/recentlyRead/all', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch other users recently read');
                const data = await res.json();

                const me = (currentUserEmail || '').trim().toLowerCase();
                const filtered = data.filter(item =>
                    (item.userEmail || '').trim().toLowerCase() !== me
                );

                setOtherUsersRecentlyRead(filtered);
            } catch (err) {
                console.error(err);
            }
        }

        if (currentUserEmail) fetchOtherUsersRecentlyRead();
    }, [currentUserEmail]);



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
                                            key={item._id || item.day}
                                            className={item.completed ? 'completed-row' : ''}
                                        >
                                            <td>{item.day}</td>
                                            <td
                                                onClick={() => {
                                                    setEditingId(item._id);
                                                    setTempReading(item.reading || '');
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {editingId === item._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={tempReading}
                                                        autoFocus
                                                        onChange={(e) => setTempReading(e.target.value)}
                                                        onBlur={() => handleSaveEdit(item._id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveEdit(item._id);
                                                        }}
                                                    />
                                                ) : (
                                                    item.reading || <span className="text-muted fst-italic">Click to add reading...</span>
                                                )}
                                            </td>
                                            <td>
                                                {item.completed ? (
                                                    <span
                                                        className="text-success fw-bold"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleToggleReading(item._id)}
                                                        title="Click to mark incomplete"
                                                    >
                                                        Done ✅
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleToggleReading(item._id)}
                                                        disabled={!item.reading || !item.reading.trim()}
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
                                className="btn btn-success mt-2"
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
                            Your Recently Read:
                        </h3>

                        {/* <!-- Scrollable recently read list, storted by the date they were read --> */}
                        <div className="recently-read-scrollable">
                            <ol className="list-group list-group-numbered mb-0">

                                {[...recentlyRead]
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map(item => (
                                        <li key={item._id} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">{item.title}</div>
                                                <b>Read:</b> {new Date(item.date).toLocaleDateString()}
                                            </div>
                                        </li>
                                    ))}
                            </ol>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom two columns */}
            <div className="container mt-5">
                <div className="row">

                    {/* LEFT COLUMN — Study Suggestions */}
                    <div className="col-12 col-lg-6 mb-4">
                        <h3>Get Study Suggestions</h3>

                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Enter topics, e.g., faith, prayer"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />

                        <button
                            className="btn btn-success mb-3"
                            onClick={generateSuggestionsMock}
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Generate Suggestions'}
                        </button>

                        {suggestions.length > 0 && (
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered suggestions-table">
                                    <thead>
                                        <tr>
                                            <th>Suggested Study Items</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {suggestions.map((s, i) => (
                                            <tr key={i} className="table-light">
                                                <td>{s}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN — Other User's reads (using Websocket) */}
                    <div className="col-12 col-lg-6 mb-4">
                        <h3>Recently Read by Other Users:</h3>

                        <div className="recently-read-scrollable">
                            <ol className="list-group list-group-numbered mb-0">
                                {[...otherUsersRecentlyRead]
                                    .filter(item =>
                                        (item.userEmail || '').trim().toLowerCase() !==
                                        (currentUserEmail || '').trim().toLowerCase()
                                    )
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map(item => (
                                        <li key={item._id} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">{item.title}</div>
                                                <small className="text-muted">Read by <b>{item.userEmail}</b> on {new Date(item.date).toLocaleDateString()}</small>
                                            </div>
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}