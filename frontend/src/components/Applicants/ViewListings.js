import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import NavbarApplicant from "../templates/NavbarApplicant";

const JobsList = (props) => {
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [sortRatingFlag, setSortRatingFlag] = useState(true);
  const [sortSalaryFlag, setSortSalaryFlag] = useState(true);
  const [sortDurationFlag, setSortDurationFlag] = useState(true);

  useEffect(() => {
    // Fetch jobs
    axios
      .get("http://localhost:4000/job")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch user data
    axios
      .get("http://localhost:4000/user/me", {
        headers: {
          token: localStorage.getItem("token")
            ? localStorage.getItem("token").split(" ")[1]
            : "",
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const showJob = (jobId) => {
    axios
      .get("http://localhost:4000/job/checkAccepted/" + user._id)
      .then((res) => {
        if (res.data.gotAccepted === 1) {
          alert("Can't Apply! You have been accepted to a job!");
        } else {
          props.history.push("/apply-job/" + jobId);
        }
      })
      .catch((err) => {
        alert("Error checking job acceptance status");
      });
  };

  const sortRating = () => {
    const sortedJobs = [...jobs].sort((a, b) => {
      if (a.rating !== undefined && b.rating !== undefined) {
        return (1 - sortRatingFlag * 2) * (a.rating - b.rating);
      } else {
        return 1;
      }
    });
    setJobs(sortedJobs);
    setSortRatingFlag(!sortRatingFlag);
  };

  const sortSalary = () => {
    const sortedJobs = [...jobs].sort((a, b) => {
      if (a.salary !== undefined && b.salary !== undefined) {
        return (1 - sortSalaryFlag * 2) * (a.salary - b.salary);
      } else {
        return 1;
      }
    });
    setJobs(sortedJobs);
    setSortSalaryFlag(!sortSalaryFlag);
  };

  const sortDuration = () => {
    const sortedJobs = [...jobs].sort((a, b) => {
      if (a.duration !== undefined && b.duration !== undefined) {
        return (1 - sortDurationFlag * 2) * (a.duration - b.duration);
      } else {
        return 1;
      }
    });
    setJobs(sortedJobs);
    setSortDurationFlag(!sortDurationFlag);
  };

  const renderIconRating = () => {
    return sortRatingFlag ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />;
  };

  const renderIconSalary = () => {
    return sortSalaryFlag ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />;
  };

  const renderIconDuration = () => {
    return sortDurationFlag ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />;
  };

  return (
    <div className="container">
      <NavbarApplicant />
      <br />
      {jobs.length > 0 ? (
        <Grid container>
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Recruiter Name</TableCell>
                    <TableCell>
                      <Button onClick={sortRating}>{renderIconRating()}</Button>
                      Recruiter Rating
                    </TableCell>
                    <TableCell>
                      <Button onClick={sortSalary}>{renderIconSalary()}</Button>
                      Salary(Rupees)
                    </TableCell>
                    <TableCell>
                      <Button onClick={sortDuration}>{renderIconDuration()}</Button>
                      Duration(months)
                    </TableCell>
                    <TableCell>Deadline</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job, ind) => {
                    const isApplied = job.receivedApplicants
                      ? job.receivedApplicants.some(
                          (applicant) => applicant._id === user._id
                        )
                      : false;

                    return moment(job.deadline).diff(moment()) > 0 ? (
                      <TableRow key={ind}>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.name}</TableCell>
                        <TableCell>{job.rating || "N/A"}</TableCell>
                        <TableCell>{job.salary || "N/A"}</TableCell>
                        <TableCell>{job.duration || "N/A"}</TableCell>
                        <TableCell>
                          {job.deadline.split("T")[0]} <br />
                          {new Date(job.deadline).getUTCHours()}:
                          {new Date(job.deadline).getUTCMinutes() || "00"}
                        </TableCell>
                        {user.jobsApplied && user.jobsApplied.length < 10 ? (
                          isApplied ? (
                            <TableCell>
                              <Button style={{ color: "blue" }}>Applied</Button>
                            </TableCell>
                          ) : job.receivedApplicants &&
                            job.receivedApplicants.length < job.maxApplicants &&
                            job.noOfAccepted < job.maxPositions ? (
                            <TableCell>
                              <Button
                                style={{ color: "green" }}
                                onClick={() => showJob(job._id)}
                              >
                                Apply
                              </Button>
                            </TableCell>
                          ) : (
                            <TableCell>
                              <Button style={{ color: "red" }}>Full</Button>
                            </TableCell>
                          )
                        ) : (
                          <TableCell colSpan={2}>
                            You cannot apply to more than 10 jobs
                          </TableCell>
                        )}
                      </TableRow>
                    ) : null;
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        "There are no job listings yet!"
      )}
    </div>
  );
};

export default JobsList;
