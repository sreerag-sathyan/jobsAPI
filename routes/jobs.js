const express = require('express')
const { getAllJobs, getAJob, deleteJob, createJob, updateJob } = require('../controllers/jobs')


const jobsRouter = express.Router()


jobsRouter.route('/').get(getAllJobs).post(createJob)
jobsRouter.route('/:id').get(getAJob).patch(updateJob).delete(deleteJob)

module.exports = jobsRouter