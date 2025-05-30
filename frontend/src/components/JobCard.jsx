import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";


const JobCard = ({ job }) => {
  const [showApply, setShowApply] = useState(false);
  const [applicant, setApplicant] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

    const { mutate: deleteJob, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/jobs/${job._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });


  const handleApply = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSent(false);
    try {
      await fetch("/api/v1/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          ...applicant,
        }),
      });
      setSent(true);
      setApplicant({ name: "", email: "", message: "" });
    } catch {
      alert("Failed to send application.");
    }
    setIsSending(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold">{job.title}</h2>
        <div className="text-gray-600">{job.company} &middot; {job.type} &middot; {job.location}</div>
        <div className="text-gray-500 text-sm mb-2">Posted {new Date(job.postedAt).toLocaleDateString()}</div>
        <div className="mb-2">{job.description}</div>
        <ul className="list-disc ml-5 text-sm text-gray-700">
          {job.requirements?.map((req, i) => <li key={i}>{req}</li>)}
        </ul>
      </div>
         {authUser?._id === job.postedBy && (
        <button
          className="text-red-500 hover:text-red-700 ml-4"
          onClick={() => {
            if (window.confirm("Delete this job post?")) deleteJob();
          }}
          disabled={isDeleting}
          title="Delete Job"
        >
          <Trash2 size={20} />
        </button>
      )}
      <button
        className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        onClick={() => setShowApply(true)}
      >
        Apply Now
      </button>

      {/* Apply Modal */}
      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            className="bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-md relative"
            onSubmit={handleApply}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setShowApply(false)}
            >×</button>
            <h2 className="text-xl font-bold mb-4">Apply for {job.title}</h2>
            {sent ? (
              <div className="text-green-600 font-semibold">Application sent!</div>
            ) : (
              <>
                <input
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Your Name"
                  value={applicant.name}
                  onChange={e => setApplicant(a => ({ ...a, name: e.target.value }))}
                  required
                />
                <input
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Your Email"
                  type="email"
                  value={applicant.email}
                  onChange={e => setApplicant(a => ({ ...a, email: e.target.value }))}
                  required
                />
                <textarea
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Message (optional)"
                  value={applicant.message}
                  onChange={e => setApplicant(a => ({ ...a, message: e.target.value }))}
                  rows={3}
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-dark transition"
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Send Application"}
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default JobCard;