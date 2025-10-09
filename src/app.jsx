import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return (
        <body className="d-flex flex-column min-vh-100">
            <header>
                <h1 className="mainName">Procrastinot!</h1>

                {/* Main Menu */}
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" href="index.html">Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="Home.html">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="Assignments.html">Assignments</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="Goals.html">Goals</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="GospelPlan.html">Gospel Study Plan</a>
                    </li>

                </ul>
            </header>

            <main>App components go here</main>

            {/* Footer with Startup Repo */}
            <footer className="text-dark mt-auto py-4">
                <div className="container">
                    <div className="row">

                        {/* Left side */}
                        <div className="col-md-6 mb-3 mb-md-0">
                            <h5>Startup Repository (Nathan Brady)</h5>
                            <a className="mb-0" href="https://github.com/Nate-Dawg04/startup.git">Source (Github)</a>
                        </div>
                    </div>
                </div>
            </footer>
        </body>
    );
}