import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Assignments.css';

export function Assignments() {
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
                                    </tr>
                                </thead>

                                {/* <!-- Table Body (with placeholder info) --> */}
                                <tbody>
                                    <tr>
                                        <td>CS260</td>
                                        <td>HTML Deliverable</td>
                                        <td>Sept. 24</td>
                                    </tr>
                                    <tr>
                                        <td>POLI 110</td>
                                        <td>Midterm 1</td>
                                        <td>Oct. 1</td>
                                    </tr>
                                    <tr>
                                        <td>MATH 213</td>
                                        <td>Written HW 3.1</td>
                                        <td>Oct. 2</td>
                                    </tr>
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

                        <form>
                            {/* <!-- Class Input --> */}
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Class</span>
                                <input type="text" className="form-control" placeholder="MATH 215" aria-label="Username"
                                    aria-describedby="basic-addon1" />
                            </div>

                            {/* <!-- Assignment Input --> */}
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Assignment</span>
                                <input type="text" className="form-control" placeholder="Research Paper" aria-label="Username"
                                    aria-describedby="basic-addon1" />
                            </div>

                            {/* <!-- Due Date Input --> */}
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon-date">Due Date</span>
                                <input type="date" className="form-control" aria-label="Due Date"
                                    aria-describedby="basic-addon-date" />
                            </div>
                            {/* <!-- Submit Button --> */}
                            <input className="btn btn-primary" type="submit" value="Submit" />

                            {/* <!-- Reset Button --> */}
                            <input className="btn btn-secondary" type="reset" value="Reset" />
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}