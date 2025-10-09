import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Goals.css';

export function Goals() {
    return (
        <main className="flex-grow-1">
            <h1>Goals</h1>
            <div className="container">
                <div className="row">

                    {/* <!-- Current Goals and Progress Column (with placeholders) --> */}
                    <div className="col-12 col-lg-8 mb-3 mb-lg-0">
                        <div className="table-responsive w-auto">
                            <table className="table table-striped table-hover mx-auto w-auto">
                                <thead>
                                    <tr>
                                        <th>Goal</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {/* <!-- Label --> */}
                                        <td>Run a marathon</td>

                                        {/* <!-- Progress Bar --> */}
                                        <td>
                                            <div className="progress" role="progressbar" aria-label="Success example"
                                                aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                <div className="progress-bar bg-success" style="width: 25%"></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        {/* <!-- Label --> */}
                                        <td>Read "The Way of Kings"</td>

                                        {/* <!-- Progress Bar --> */}
                                        <td>
                                            <div className="progress" role="progressbar" aria-label="Success example"
                                                aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                <div className="progress-bar bg-success" style="width: 75%"></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* <!-- Create New Goals Column --> */}
                    <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                        <form>
                            {/* <!-- New Goal Input --> */}
                            <div className="mb-3">
                                <label className="goalLabel">New Goal</label>
                                <input type="text" className="form-control" id="newGoal" placeholder="Climb Mount Everest" />
                            </div>

                            {/* <!-- Create Button --> */}
                            <button type="submit" className="btn btn-success">Create!</button>
                        </form>
                    </div>
                </div>
            </div>
            {/* <!-- coming soon... --> */}
            <h2 className="GoalIdeas">Get Goal Ideas!</h2>
            <section>3rd Party API (probably ChatGPT) here to generate goal suggestions</section>

        </main>
    );
}