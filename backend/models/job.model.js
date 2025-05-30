import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  type: { type: String, enum: ["full-time", "part-time", "contract", "internship"], required: true },
  location: { type: String, required: true },
  salary: { type: String },
  postedAt: { type: Date, default: Date.now },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  email: { type: String, required: true }, 
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Job", jobSchema);