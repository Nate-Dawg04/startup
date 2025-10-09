import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'

export function Home() {
    return (
        <main className="flex-grow-1">
            <h1>Home</h1>
            <div className="container">
                {/* <!-- Welcome Text --> */}
                <section className="welcome">Welcome to Procrastinot, <b>[User name here]</b>! The all-in-one place to manage
                    your school assignments, goals, and gospel study plan. Here's your snapshot: </section>

                <div className="row">
                    {/* <!-- Upcoming Assignments Snapshot --> */}
                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                        <header className="Snapshots">Upcoming Assignments</header>
                        <p className="SnapshotData">Database data here</p>
                    </div>

                    {/* <!-- Goals Snapshot --> */}
                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                        <header className="Snapshots">Goals</header>
                        <p className="SnapshotData">Database data here</p>
                    </div>

                    {/* <!-- Gospel Study Plan Snapshot --> */}
                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                        <header className="Snapshots">Gospel Study Plan</header>
                        <p className="SnapshotData">Database data here</p>
                    </div>

                    {/* <!-- Picture of Pres Nelson (with animation) --> */}
                    <div id="picture" className="img-fluid col-12 slide-in picture-box"><img width="400px" src="PresNelson.jpg"
                        alt="random" />
                    </div>
                    <p className="col-12 presNelson">President Nelson is cheering you on!</p>
                </div>
            </div>
        </main>
    );
}