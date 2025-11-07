import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Assignments } from './Assignments/Assignments';
import { Goals } from './Goals/Goals';
import { GospelPlan } from './GospelPlan/GospelPlan';
import { Home } from './Home/Home';
import { Login } from './Login/Login';

export default function App() {
    //Default stuff for all the dynamic content

    // Assignments
    const [assignments, setAssignments] = useState(() => {
        const raw = localStorage.getItem('procrastinot_assignments');
        if (!raw) {
            return [];
        }
        try { return JSON.parse(raw); } catch { return []; }
    });

    // Goals
    const [goals, setGoals] = useState(() => {
        const raw = localStorage.getItem('procrastinot_goals');
        if (!raw) return [];
        try { return JSON.parse(raw); } catch { return []; }
    });

    // Weekly plan
    const [weeklyPlan, setWeeklyPlan] = useState([
        { id: 1, day: 'Monday', reading: '', completed: false },
        { id: 2, day: 'Tuesday', reading: '', completed: false },
        { id: 3, day: 'Wednesday', reading: '', completed: false },
        { id: 4, day: 'Thursday', reading: '', completed: false },
        { id: 5, day: 'Friday', reading: '', completed: false },
        { id: 6, day: 'Saturday', reading: '', completed: false },
        { id: 7, day: 'Sunday', reading: '', completed: false },
    ]);

    // Save goals to localStorage automatically
    useEffect(() => {
        localStorage.setItem('procrastinot_goals', JSON.stringify(goals));
    }, [goals]);

    // Save assignments to localStorage
    useEffect(() => {
        localStorage.setItem('procrastinot_assignments', JSON.stringify(assignments));
    }, [assignments]);

    // Save gospel study plan to localStorage
    useEffect(() => {
        localStorage.setItem('procrastinot_weeklyPlan', JSON.stringify(weeklyPlan));
    }, [weeklyPlan]);
    return (
        <BrowserRouter>
            <div className="body d-flex flex-column min-vh-100">
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
                    <Route path='/Home' element={
                        <Home
                            assignments={assignments}
                            goals={goals}
                            weeklyPlan={weeklyPlan}
                        />
                    } />
                    <Route path='/Assignments' element={
                        <Assignments
                            assignments={assignments}
                            setAssignments={setAssignments}
                        />}
                    />
                    <Route path='/Goals' element={
                        <Goals
                            goals={goals}
                            setGoals={setGoals}
                        />}
                    />
                    <Route path='/GospelPlan' element={
                        <GospelPlan
                            weeklyPlan={weeklyPlan}
                            setWeeklyPlan={setWeeklyPlan}
                        />}
                    />
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
            </div>
        </BrowserRouter>
    );
}

// Handles unknown paths with the router
function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}