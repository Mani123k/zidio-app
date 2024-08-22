import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarApplicant from "../templates/NavbarApplicant";

function ApplyJob(props) {
    const [jobs, setJobs] = useState([]);
    const [sop, setSOP] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:4000/job/list') // Fetch the list of jobs
            .then(res => setJobs(res.data))
            .catch(err => console.error(err));
    }, []);

    async function onChangeSOP(event) {
        setSOP(event.target.value);
    }

    function onSubmit(e) {
        e.preventDefault();

        if (!selectedJob) {
            alert("Please select a job to apply for.");
            return;
        }

        const application = {
            jobId: selectedJob._id,
            sop: sop
        };

        axios.post(`http://localhost:4000/job/apply/${selectedJob._id}`, application)
            .then(res => {
                alert("Applied successfully!");
                props.history.push('/applications');
            })
            .catch(err => alert(err.response.data.error));
    }

    return (
        <div>
            <NavbarApplicant /><br />
            <h1><u>Apply for a Job</u></h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Select Job:</label>
                    <select onChange={(e) => setSelectedJob(jobs.find(job => job._id === e.target.value))}>
                        <option value="">Select a job</option>
                        {jobs.map(job => (
                            <option key={job._id} value={job._id}>{job.title}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>SOP: </label>
                    <textarea 
                        className="form-control" 
                        value={sop}
                        onChange={onChangeSOP}
                        required
                    />
                </div>
                <div className="form-group">
                    <input type="submit" value="Apply" className="btn btn-primary" />
                </div>
            </form>
        </div>
    );
}

export default ApplyJob;
