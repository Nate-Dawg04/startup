import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Login() {
    return (
        <main className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '10vh' }}>            <h1>Login</h1>
            {/* <!-- Login input (changes page to Home.html) --> */}
            <form method="get" action="Home.html">

                {/* <!-- Email --> */}
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="inputEmail3" />
                </div>

                {/* <!-- Password --> */}
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" id="inputPassword3" />
                </div>

                {/* <!-- Submit and Create Buttons --> */}
                <button type="submit" class="btn btn-primary">Sign in</button>
                <button type="submit" class="btn btn-secondary">Create</button>
            </form>
        </main>
    );
}