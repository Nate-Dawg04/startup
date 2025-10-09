import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Assignments } from './Assignments/Assignments';
import { Goals } from './Goals/Goals';
import { GospelPlan } from './GospelPlan/GospelPlan';
import { Home } from './Home/Home';
import { Login } from './Login/Login';

export default function App() {
    return (
        <BrowserRouter>
            <body className="d-flex flex-column min-vh-100">
                <header>
                    <h1 className="mainName">Procrastinot!</h1>

                    {/* Main Menu */}
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <NavLink className='nav-link' to="">
                                Login
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="Home">
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="Assignments">
                                Assignments
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="Goals">
                                Goals
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="GospelPlan">
                                Gospel Study Plan
                            </NavLink>
                        </li>

                    </ul>
                </header>

                <Routes>
                    <Route path='/' element={<Login />} exact />
                    <Route path='/Home' element={<Home />} />
                    <Route path='/Assignments' element={<Assignments />} />
                    <Route path='/Goals' element={<Goals />} />
                    <Route path='/GospelPlan' element={<GospelPlan />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>

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
        </BrowserRouter>
    );
}

// Handles unknown paths with the router
function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}