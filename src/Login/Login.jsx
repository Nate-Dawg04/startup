import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Login({ authState, onAuthChange }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    // Restore email if user is already logged in
    useEffect(() => {
        const savedEmail = localStorage.getItem('startup_user');
        if (savedEmail) setEmail(savedEmail);
    }, []);

    async function handleAuth(endpoint) {
        if (!email.trim() || !password.trim()) return setError('Enter both email and password');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (response.status === 200) {
                localStorage.setItem('startup_user', email);
                localStorage.setItem('startup_auth', 'Authenticated');
                onAuthChange(email, 'Authenticated');
                setError(''); // clear any previous error
            } else {
                const body = await response.json();
                setError(body.msg || 'Authentication failed');
            }
        } catch (err) {
            setError('Network error');
        }
    }

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'DELETE' });
        } catch (err) {
            console.warn('Logout failed', err);
        } finally {
            localStorage.removeItem('startup_user');
            localStorage.setItem('startup_auth', 'Unauthenticated');
            onAuthChange('', 'Unauthenticated');
        }
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
            <form>
                <h1>Login</h1>

                {error && <div className="alert alert-danger">{error}</div>}

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
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="button" className="btn btn-primary me-2" onClick={() => handleAuth('/api/auth/login')}>
                    Sign in
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => handleAuth('/api/auth/create')}>
                    Create
                </button>
            </form>
        </main>
    );
}