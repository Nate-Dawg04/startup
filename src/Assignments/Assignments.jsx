import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Assignments.css';

export function Assignments({ assignments, setAssignments }) {
    // Form for inputs
    const [form, setForm] = useState({ className: '', task: '', due: '' });

    // Recently graded assignments state
    const [graded, setGraded] = useState(() => {
        const saved = localStorage.getItem('procrastinot_graded');
        return saved ? JSON.parse(saved) : [];
    });
    const [flashId, setFlashId] = useState(null);

    // useEffect to get assignment data
    useEffect(() => {
        async function fetchAssignments() {
            try {
                const res = await fetch('/api/assignments');
                if (res.ok) {
                    const data = await res.json();
                    setAssignments(data);
                }
            } catch (err) {
                console.error('Failed to fetch assignments', err);
            }
        }
        fetchAssignments();
    }, []);

    // Mock WebSocket: push a new graded assignment every 10s
    useEffect(() => {
        const mockGradedPool = [
            { className: 'Math', task: 'Algebra Quiz', grade: 'A (95%)' },
            { className: 'Science', task: 'Lab Report', grade: 'B+ (89%)' },
            { className: 'English', task: 'Essay', grade: 'A- (91%)' },
            { className: 'History', task: 'Project', grade: 'B (84%)' },
        ];

        const interval = setInterval(() => {
            const newGraded = { ...mockGradedPool[Math.floor(Math.random() * mockGradedPool.length)], id: Date.now() };
            setGraded(prev => [newGraded, ...prev].slice(0, 5));
            setFlashId(newGraded.id);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // save the graded assignments to localStorage
    useEffect(() => {
        localStorage.setItem('procrastinot_graded', JSON.stringify(graded));
    }, [graded]);

    // handleChange function
    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.className || !form.task || !form.due) return;

        try {
            const res = await fetch('/api/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const newAssignment = await res.json();
                setAssignments(prev => [...prev, newAssignment]);
                setForm({ className: '', task: '', due: '' });
            }
        } catch (err) {
            console.error('Failed to submit assignment', err);
        }
    }

    return (
        <main className="flex-grow-1">
            <h1>Assignments</h1>
            <div className="container">
                <div className="row">

                    {/* <!-- Current Assignments and Due Dates Column --> */}
                    <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                        <div className="table-responsive w-auto">
                            <table className="table table-striped table-hover custom-table table-header-color">
                                <thead>

                                    {/* <!-- Table Labels --> */}
                                    <tr>
                                        <th>Class</th>
                                        <th>Assignment</th>
                                        <th>Due Date</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                {/* <!-- Table Body (maps the assignments array) --> */}
                                <tbody>
                                    {[...assignments]
                                        // Sort by the date
                                        .sort((a, b) => new Date(a.due) - new Date(b.due))
                                        .map(a => (
                                            <tr key={a.id}>
                                                <td>{a.className}</td>
                                                <td>{a.task}</td>
                                                <td>{new Date(a.due).toLocaleDateString()}</td>
                                                <td>
                                                    {/* Button to delete assignments */}
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(a.id)}
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
                        {/* Recently Graded Assignments */}
                        <section className="mt-4">
                            <h2>Recently Graded Assignments</h2>
                            {graded.length === 0 ? (
                                <p className="text-muted">No grades yet</p>
                            ) : (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Class</th>
                                            <th>Assignment</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {graded.map(a => (
                                            <tr
                                                key={a.id}
                                                className={a.id === flashId ? 'flash-row' : ''}
                                                onAnimationEnd={() => setFlashId(null)}
                                            >
                                                <td>{a.className}</td>
                                                <td>{a.task}</td>
                                                <td>{a.grade}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </section>
                    </div>

                    {/* <!-- Add New Assignments Column --> */}
                    <div className="col-12 col-lg-6">
                        {/* <!-- Header --> */}
                        <h2 className="alternate">Add New Assignment:</h2>

                        <form onSubmit={handleSubmit}>
                            {/* <!-- Class Input --> */}
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Class</span>
                                <input
                                    name="className"
                                    value={form.className}
                                    onChange={handleChange}
                                    type="text"
                                    className="form-control"
                                    placeholder="MATH 215"
                                />
                            </div>

                            {/* <!-- Assignment Input --> */}
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Assignment</span>
                                <input
                                    name="task"
                                    value={form.task}
                                    onChange={handleChange}
                                    type="text"
                                    className="form-control"
                                    placeholder="Research Paper"
                                />
                            </div>

                            {/* <!-- Due Date Input --> */}
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon-date">Due Date</span>
                                <input
                                    name="due"
                                    value={form.due}
                                    onChange={handleChange}
                                    type="date"
                                    className="form-control"
                                />
                            </div>
                            {/* <!-- Submit Button --> */}
                            <input className="btn btn-success" type="submit" value="Submit" />

                            {/* <!-- Reset Button --> */}
                            <button
                                className="btn btn-secondary ms-2"
                                type="button"
                                onClick={() => setForm({ className: '', task: '', due: '' })}
                            >
                                Reset
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}