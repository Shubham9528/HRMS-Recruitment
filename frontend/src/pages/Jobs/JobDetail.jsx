import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { jobsApi } from "../../api/jobs.api";
import { closeJob } from "../../features/jobs/jobsSlice";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/shared/ErrorState";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const fetchJobData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobsApi.getJob(id);
      setJob(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load job details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCloseJob = async () => {
    setIsClosing(true);
    try {
      const action = await dispatch(closeJob(id));
      if (closeJob.rejected.match(action)) throw new Error(action.payload);
      toast.success("Job closed successfully");
      setIsModalOpen(false);
      fetchJobData(); // refresh local state to show updated status
    } catch (err) {
      toast.error(err.message || "Failed to close job");
    } finally {
      setIsClosing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-1/3" />
        <div className="bg-surface-elevated p-6 rounded-md border border-border space-y-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <ErrorState
        description={error || "Job not found"}
        onRetry={fetchJobData}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            {job.title}
          </h1>
          <div className="mt-1 flex items-center space-x-3 text-sm text-text-secondary">
            <span>{job.department}</span>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <Badge status={job.status} />
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate(`/jobs/${id}/edit`)}
          >
            Edit
          </Button>
          {job.status === "open" && (
            <Button variant="danger" onClick={() => setIsModalOpen(true)}>
              Close Job
            </Button>
          )}
        </div>
      </div>

      {/* Read-only Content */}
      <div className="bg-surface-elevated rounded-md border border-border shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-text-secondary">
                Employment Type
              </h3>
              <p className="mt-1 text-base text-text-primary">
                {job.employmentType}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">
                Openings
              </h3>
              <p className="mt-1 text-base text-text-primary">{job.openings}</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-medium text-text-secondary">
              Description
            </h3>
            <p className="mt-2 text-base text-text-primary whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-text-secondary">
                Requirements
              </h3>
              <ul className="mt-2 list-disc list-inside space-y-1 text-base text-text-primary">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Close Job"
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Are you sure you want to close this job? This will mark it as
            inactive. Candidates will no longer be able to apply.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isClosing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleCloseJob}
              isLoading={isClosing}
            >
              Confirm Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
