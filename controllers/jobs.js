const { redirect } = require("express/lib/response");
const BadRequestError = require("../errors/bad-request");
const Job = require("../models/Job");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res, next) => {
  let Jobs = await Job.find({ createdBy: req.userId }).sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json(Jobs);
};
const getAJob = async (req, res, next) => {
  const job = await Job.findOne({ createdBy: req.userId, _id:req.params.id});
  if (!job) {
    throw new BadRequestError("No such Job");
  }
  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res, next) => {
  const { company, position } = req.body;
  const job = new Job({ company: company, position: position });
  const user = await User.findById(req.userId);
  job.createdBy = user;
  await job.save();
  res.status(StatusCodes.CREATED).json({ msg: "Job creared", job });
};

const updateJob = async (req, res, next) => {
  let job = await Job.findOneAndUpdate(
    {
      createdBy: req.userId,
      _id: req.params.id,
    },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({job})
};

const deleteJob = async (req, res, next) => {
 const job =  await Job.findOneAndDelete({createdBy: req.userId, _id: req.params.id})
 if(!job){
  throw new BadRequestError('No job to delete')
 }
 res.status(StatusCodes.ACCEPTED).send()
};

module.exports = {
  getAllJobs,
  getAJob,
  createJob,
  updateJob,
  deleteJob,
};
