import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Goals.css';

export function Goals() {
    // Get Goals from localStorage or start with sample data
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('procrastinot_goals');
        // Default stuff
        return saved ? JSON.parse(saved) : [
            { id: 1, task: "Run a marathon", progress: 25 },
            { id: 2, task: 'Read "The Way of Kings"', progress: 75 },
        ];
    });

    // For the form input
    const [newGoal, setNewGoal] = useState('');

    // Saves goals to local storage when they're added
    useEffect(() => {
        localStorage.setItem('procrastinot_goals', JSON.stringify(goals));
    }, [goals]);

    // Updates the state as the user types
    function handleChange(e) {
        setNewGoal(e.target.value);
    }

    // Submit handler
    function handleSubmit(e) {
        e.preventDefault(); // prevent page reload

        if (newGoal.trim() === '') return; // ignore empty input

        const nextId = goals.length ? Math.max(...goals.map(g => g.id)) + 1 : 1;

        setGoals([...goals, { id: nextId, task: newGoal, progress: 0 }]);
        setNewGoal(''); // clear input
    }

    // Delete handler
    function handleDelete(id) {
        setGoals(goals.filter(g => g.id !== id));
    }

    // Handler for progress changes, ensures values are between 0 and 100
    function handleProgressChange(id, value) {
        const num = Number(value);
        const clamped = Math.min(100, Math.max(0, num)); // clamp between 0 and 100
        setGoals(goals.map(g => g.id === id ? { ...g, progress: clamped } : g));
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
                                        <tr key={g.id}>
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
                                                        value={g.progress}
                                                        onChange={(e) => handleProgressChange(g.id, e.target.value)}
                                                        style={{ width: '60px' }}
                                                    />
                                                    <span className="ms-1">%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(g.id)}
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

                    {/* <!-- Create New Goals Column --> */}
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
                            <button type="submit" className="btn btn-success">Create!</button>
                        </form>
                    </div>
                </div>
            </div>
            {/* <!-- coming soon... --> */}
            <h2 className="GoalIdeas">Get Goal Ideas!</h2>
            <section>3rd Party API (probably ChatGPT) here to generate goal suggestions</section>

        </main>
    );
}