import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Assignments.css';

export function Assignments({ assignments, setAssignments }) {

    // Form for inputs
    const [form, setForm] = useState({ className: '', task: '', due: '' });
    // Save when assignments change
    useEffect(() => {
        localStorage.setItem('procrastinot_assignments', JSON.stringify(assignments));
    }, [assignments]);
    // handleChange function
    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    // handleSubmit adds the assignment without the page reloading (will not work if a field is blank)
    function handleSubmit(e) {
        e.preventDefault();
        // Requires all fields
        if (!form.className || !form.task || !form.due) return;
        // Add the new assignment, allows for assignment to be deleted
        setAssignments(prev => [...prev, { ...form, id: Date.now() }]);
        // Clears the form
        setForm({ className: '', task: '', due: '' });
    }
    // Delete handler to delete assignments
    function handleDelete(id) {
        setAssignments(prev => prev.filter(a => a.id !== id));
    }

    return (
        <main className="flex-grow-1">
            <h1>Assignments</h1>
            <div className="container">
                <div className="row">

                    {/* <!-- Current Assignments and Due Dates Column --> */}
                    <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                        <div className="table-responsive w-auto">
                            <table className="table table-striped table-hover custom-table">
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

                        {/* <!-- coming soon... --> */}
                        <section className="mt-3"><b>WebSocket Data</b> will be displayed here &#40;live updated grades and
                            assignments&#41;
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
                            <input className="btn btn-primary" type="submit" value="Submit" />

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