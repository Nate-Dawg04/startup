import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Login({ authState, onAuthChange }) {
    const [email, setEmail] = useState('');

    // Restore email if user is already logged in
    useEffect(() => {
        const savedEmail = localStorage.getItem('startup_user');
        if (savedEmail) setEmail(savedEmail);
    }, []);

    function handleLogin(e) {
        e.preventDefault();
        if (!email.trim()) return alert('Please enter your email');

        // Persist login in localStorage
        localStorage.setItem('startup_user', email);
        localStorage.setItem('startup_auth', 'Authenticated');

        // Notify parent App component
        onAuthChange(email, 'Authenticated');
    }

    function handleLogout() {
        localStorage.removeItem('startup_user');
        localStorage.setItem('startup_auth', 'Unauthenticated');
        onAuthChange('', 'Unauthenticated');
    }

    if (authState === 'Authenticated') {
        return (
            <main className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '10vh' }}>
                <h1>Welcome, {email}!</h1>
                <button className="btn btn-secondary ms-3" onClick={handleLogout}>Logout</button>
            </main>
        );
    }

    return (
        <main className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '10vh' }}>
            <form onSubmit={handleLogin}>
                <h1>Login</h1>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" />
                </div>

                <button type="submit" className="btn btn-primary me-2">Sign in</button>
                <button type="button" className="btn btn-secondary">Create</button>
            </form>
        </main>
    );
}