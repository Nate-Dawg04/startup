import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GospelPlan.css';

export function GospelPlan() {
    return (
        <main className="flex-grow-1">
            <h1>Gospel Study Plan</h1>
            <div className="container">
                <div className="row">

                    {/* <!-- Weekly Plan Column --> */}
                    <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                        <h3 className="WeekPlan">
                            This Week's Plan:
                        </h3>
                        <div className="table-responsive w-auto">

                            {/* <!-- Table with all the Data (placeholders) --> */}
                            <table className="table table-striped table-hover mx-auto w-auto">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>To-Study</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Monday</td>
                                        <td>Jacob 5</td>
                                    </tr>
                                    <tr>
                                        <td>Tuesday</td>
                                        <td>2 Nephi 2</td>
                                    </tr>
                                    <tr>
                                        <td>Wednesday</td>
                                        <td>"Think Celestial"</td>
                                    </tr>
                                    <tr>
                                        <td>Thursday</td>
                                        <td>D&C 1</td>
                                    </tr>
                                    <tr>
                                        <td>Friday</td>
                                        <td>Alma 5</td>
                                    </tr>
                                    <tr>
                                        <td>Saturday</td>
                                        <td>Luke 5</td>
                                    </tr>
                                    <tr>
                                        <td>Sunday</td>
                                        <td>All Holland Talks</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* <!-- Past Items Studied Column --> */}
                    <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                        <h3>
                            Recently Read:
                        </h3>

                        {/* <!-- Fancy list holding information (with placeholders) --> */}
                        <ol className="list-group list-group-numbered">
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">Moroni 10</div>
                                    <b>Read:</b> October 1
                                </div>
                                {/* <!-- Trending Tag --> */}
                                <span className="badge text-bg-primary rounded-pill">Trending</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">Ephesians 4</div>
                                    <b>Read:</b> September 29
                                </div>
                                {/* <!-- Hidden Tag (if not trending) --> */}
                                <span className="badge text-bg-primary rounded-pill d-none">14</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">President Nelson, "Think Celestial"</div>
                                    <b>Read:</b> September 28
                                </div>
                                {/* <!-- Trending Tag --> */}
                                <span className="badge text-bg-primary rounded-pill">Trending</span>
                            </li>
                        </ol>

                        {/* <!-- coming soon... --> */}
                        <p className="placeholders"><b>Database</b> to store things that have been read</p>
                        <p className="placeholders"><b>Websocket data</b> that shows what others have been reading and what's
                            popular worldwide</p>

                    </div>
                </div>
            </div>

            {/* <!-- coming soon... --> */}
            <p className="placeholders"><b>3rd Party API</b> to create weekly study plans and get ideas for new study material
            </p>
        </main>
    );
}