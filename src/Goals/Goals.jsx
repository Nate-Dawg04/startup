import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Goals.css';

export function Goals({ goals, setGoals }) {
    // For the form input
    const [newGoal, setNewGoal] = useState('');
    const [keywords, setKeywords] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    // Track what the user is currently typing for each goal
    const [tempProgress, setTempProgress] = useState({});

    // loads goals from the database when user goes to the page
    useEffect(() => {
        async function fetchGoals() {
            try {
                const res = await fetch('/api/goals', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch goals');
                const data = await res.json();
                setGoals(data.map(g => ({ ...g, _id: g._id.toString() })));
            } catch (err) {
                console.error(err);
            }
        }
        fetchGoals();
    }, []);

    // Updates the state as the user types
    function handleChange(e) {
        setNewGoal(e.target.value);
    }

    // Submit handler
    async function handleSubmit(e) {
        e.preventDefault();
        if (!newGoal.trim()) return;
        try {
            const res = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: newGoal, progress: 0 }),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to add goal');
            const savedGoal = await res.json();
            setGoals(prev => [...prev, { ...savedGoal, _id: savedGoal._id.toString() }]);
            setNewGoal('');
        } catch (err) {
            console.error(err);
        }
    }

    // Delete handler
    async function handleDelete(id) {
        try {
            const res = await fetch(`/api/goals/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok || res.status === 204) {
                setGoals(prev => prev.filter(g => g._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    }

    function handleProgressChangeInput(id, value) {
        const num = Math.min(100, Math.max(0, Number(value) || 0));
        setTempProgress(prev => ({ ...prev, [id]: num }));
    }

    async function handleProgressChangeSave(id) {
        const num = tempProgress[id];
        if (num == null) return; // nothing to save

        // Update UI immediately
        setGoals(prev => prev.map(g => g._id === id ? { ...g, progress: num } : g));

        try {
            const res = await fetch(`/api/goals/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress: num }),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to update progress');
            const updatedGoal = await res.json();

            // Ensure state is in sync with DB
            setGoals(prev => prev.map(g => g._id === id ? updatedGoal : g));

            // Remove temp state for this goal
            setTempProgress(prev => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        } catch (err) {
            console.error(err);
        }
    }

    // Mock API call to generate goals
    function generateGoalsMock() {
        if (!keywords.trim()) return;

        setLoading(true);
        setSuggestions([]);

        setTimeout(() => {
            const words = keywords.split(',').map(k => k.trim());
            const generated = words.flatMap(word => [
                `Improve ${word}`,
                `Learn more about ${word}`,
                `Practice ${word} weekly`
            ]);
            setSuggestions(Array.from(new Set(generated)).slice(0, 5));
            setLoading(false);
        }, 1500);
    }

    // === Add suggestion to goals table ===
    async function addSuggestion(goalText) {
        try {
            const res = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: goalText, progress: 0 }),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to add suggestion');
            const savedGoal = await res.json();
            setGoals(prev => [...prev, savedGoal]);
            setSuggestions(prev => prev.filter(s => s !== goalText));
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main className="flex-grow-1">
            <h1>Goals</h1>
            <div className="container">
                <div className="row">

                    {/* <!-- Current Goals and Progress Column (with placeholders) --> */}
                    <div className="col-12 col-lg-8 mb-3 mb-lg-0">
                        <div className="table-responsive w-auto">
                            <table className="table table-striped table-hover mx-auto w-auto">
                                <thead>
                                    <tr>
                                        <th>Goal</th>
                                        <th>Progress</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {/* .map() over goals */}
                                <tbody>
                                    {goals.map(g => (
                                        <tr key={g._id}>
                                            <td>{g.task}</td>
                                            <td>
                                                {/* Progress bars that automatically update */}
                                                <div className="d-flex align-items-center">
                                                    <div className="progress flex-grow-1 me-2" role="progressbar" aria-valuenow={g.progress} aria-valuemin="0" aria-valuemax="100">
                                                        <div className="progress-bar bg-success" style={{ width: `${g.progress}%` }}></div>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={tempProgress[g._id] ?? g.progress}
                                                        onChange={(e) => handleProgressChangeInput(g._id, e.target.value)}
                                                        onBlur={() => handleProgressChangeSave(g._id)}
                                                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                                        style={{ width: '60px' }}
                                                    />
                                                    <span className="ms-1">%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(g._id)}
                                                    title="Delete goal"
                                                >
                                                    ✖
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Create New Goals + Mock Suggestions */}
                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="goalLabel">New Goal</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Climb Mount Everest"
                                    value={newGoal}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-success" disabled={!newGoal.trim()}>Create!</button>
                        </form>

                        <div className="mt-4">
                            <label className="goalLabel">Get Goal Ideas (Mock)</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Enter keywords, e.g., reading, fitness"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                            />
                            <button
                                className="btn btn-success mb-2"
                                onClick={generateGoalsMock}
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Goals'}
                            </button>

                            {/* Suggestions Table */}
                            {suggestions.length > 0 && (
                                <div className="table-responsive">
                                    <table className="table table-hover table-bordered suggestions-table">
                                        <thead>
                                            <tr>
                                                <th>Suggested Goals</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {suggestions.map((goal, i) => (
                                                <tr
                                                    key={i}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => addSuggestion(goal)}
                                                    className="table-light"
                                                >
                                                    <td>{goal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </main>
    );
}