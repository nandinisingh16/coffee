import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import JobCard from "../components/JobCard";

const jobTypes = ["full-time", "part-time", "contract", "internship"];
const locations = [
  "Portland, OR", "Seattle, WA", "San Francisco, CA", "New York, NY",
  "Austin, TX", "Chicago, IL", "Denver, CO", "Los Angeles, CA"
];

const exampleJob = {
 title: "Head Barista",
  company: "Brew Haven",
  type: "full-time",
  location: "Portland, OR",
  salary: "",
  description: "Looking for an experienced barista to lead our team and maintain high quality standards.",
  requirements: ["3+ years experience", "SCA Certification", "Team leadership"],
  email: "", };

const JobsPage = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [location, setLocation] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(exampleJob);

  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", search, type, location],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (type !== "all") params.type = type;
      if (location !== "all") params.location = location;
      const res = await axiosInstance.get("/jobs", { params });
      return res.data;
    },
  });

  const postJob = useMutation({
    mutationFn: async (job) => {
      await axiosInstance.post("/jobs", job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      setShowModal(false);
      setForm(exampleJob);
    }
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleRequirementsChange = (e) => {
    setForm(f => ({ ...f, requirements: e.target.value.split("\n") }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postJob.mutate(form);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Coffee Industry Jobs</h1>
          <p className="text-gray-600">Find your next opportunity in the coffee world</p>
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-full shadow font-semibold hover:bg-primary-dark transition"
          onClick={() => setShowModal(true)}
        >
          + Post a Job
        </button>
      </div>
      <form className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Job title, company, keyword..."
          className="flex-1 p-2 rounded border"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={type} onChange={e => setType(e.target.value)} className="p-2 rounded border">
          <option value="all">All Types</option>
          {jobTypes.map(jt => <option key={jt} value={jt}>{jt.replace("-", " ")}</option>)}
        </select>
        <select value={location} onChange={e => setLocation(e.target.value)} className="p-2 rounded border">
          <option value="all">All Locations</option>
          {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        <button type="button" className="p-2 rounded bg-gray-200" onClick={() => { setSearch(""); setType("all"); setLocation("all"); }}>Clear Filters</button>
      </form>
      <div className="mb-4 text-gray-700">{isLoading ? "Loading..." : `${jobs.length} jobs found`}</div>
      <div className="space-y-4">
        {jobs.map(job => <JobCard key={job._id} job={job} />)}
      </div>

      {/* Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            className="bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-lg relative"
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setShowModal(false)}
            >×</button>
            <h2 className="text-xl font-bold mb-4">Post a Coffee Job</h2>
            <input
               className="w-full mb-2 p-2 border rounded"
          name="email"
          placeholder="Contact Email (applications will be sent here)"
          type="email"
          value={form.email}
          onChange={handleFormChange}
          required
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleFormChange}
              required
            />
            <select
              className="w-full mb-2 p-2 border rounded"
              name="type"
              value={form.type}
              onChange={handleFormChange}
              required
            >
              {jobTypes.map(jt => <option key={jt} value={jt}>{jt.replace("-", " ")}</option>)}
            </select>
            <select
              className="w-full mb-2 p-2 border rounded"
              name="location"
              value={form.location}
              onChange={handleFormChange}
              required
            >
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <input
              className="w-full mb-2 p-2 border rounded"
              name="salary"
              placeholder="Salary (optional)"
              value={form.salary}
              onChange={handleFormChange}
            />
            <textarea
              className="w-full mb-2 p-2 border rounded"
              name="description"
              placeholder="Job Description"
              value={form.description}
              onChange={handleFormChange}
              required
            />
            <textarea
              className="w-full mb-2 p-2 border rounded"
              name="requirements"
              placeholder="Requirements (one per line)"
              value={form.requirements.join("\n")}
              onChange={handleRequirementsChange}
              rows={3}
              required
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-dark transition"
              disabled={postJob.isPending}
            >
              {postJob.isPending ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobsPage;