import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import { mailtrapClient, sender } from "../lib/mailtrap.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user?._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user._id;

  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  // Only the poster can delete
  if (job.postedBy.toString() !== userId.toString()) {
    return res.status(403).json({ message: "You are not authorized to delete this job" });
  }

  await Job.findByIdAndDelete(jobId);
  res.json({ message: "Job deleted successfully" });
};

// Get all jobs with optional filters
export const getJobs = async (req, res) => {
  const { search, type, location } = req.query;
  let filter = {};
  if (search) filter.title = { $regex: search, $options: "i" };
  if (type && type !== "all") filter.type = type;
  if (location && location !== "all") filter.location = location;
  const jobs = await Job.find(filter).sort({ postedAt: -1 });
  res.json(jobs);
};

// Get a single job by ID
export const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

export const applyToJob = async (req, res) => {
  const { jobId, name, email, message } = req.body;
  const job = await Job.findById(jobId);
  if (!job || !job.email) return res.status(404).json({ message: "Job or poster not found" });

  // Compose email
  const html = `
    <h2>New Application for ${job.title}</h2>
    <p><strong>Applicant Name:</strong> ${name}</p>
    <p><strong>Applicant Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br/>${message || "(No message)"}</p>
  `;

   try {
    await mailtrapClient.send({
      from: sender,
      to: [{ email: job.email }], // <-- Use job.email here
      subject: `Application for ${job.title} at ${job.company}`,
      html,
      category: "job_application"
    });
    res.json({ message: "Application sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send application" });
  }
};