import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { applicationsApi } from "../../api/applications.api";
import { fetchJobs } from "../../features/jobs/jobsSlice";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/shared/ErrorState";

const STAGE_ORDER = ["applied", "screening", "interview", "offer", "hired"];

const STAGE_LABELS = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
};

export default function PipelineBoard() {
  const dispatch = useDispatch();
  const { items: jobs, status: jobsStatus } = useSelector(
    (state) => state.jobs,
  );

  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [boardError, setBoardError] = useState(null);

  // 1. Fetch active jobs for the dropdown
  useEffect(() => {
    dispatch(fetchJobs({ status: "open" }));
  }, [dispatch]);

  // Default select the first job if none is selected once jobs load
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedJobId(jobs[0]._id);
    }
  }, [jobs, selectedJobId]);

  // 2. Fetch applications when job changes
  const fetchBoardData = async (jobId) => {
    if (!jobId) {
      setApplications([]);
      setBoardError(null);
      return;
    }

    setIsLoading(true);
    setBoardError(null);
    try {
      // ONE API call fetches all relevant applications
      const data = await applicationsApi.getApplications({ jobId });
      setApplications(data);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load pipeline data";
      setBoardError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBoardData(selectedJobId);
  }, [selectedJobId]);

  // 3. Group by stage client-side
  const groupedApps = useMemo(() => {
    const groups = {
      applied: [],
      screening: [],
      interview: [],
      offer: [],
      hired: [],
    };

    applications.forEach((app) => {
      // Only show applications that aren't rejected on the main board
      const stage = app.currentStage || "applied";
      if (groups[stage]) {
        groups[stage].push(app);
      }
    });

    return groups;
  }, [applications]);

  // 4. Handle Stage Change (Move to next stage)
  const handleNextStage = async (app) => {
    const currentIdx = STAGE_ORDER.indexOf(app.currentStage || "applied");
    if (currentIdx === -1 || currentIdx === STAGE_ORDER.length - 1) return;

    const nextStage = STAGE_ORDER[currentIdx + 1];

    // Optimistic Update
    const prevApps = [...applications];
    setApplications((apps) =>
      apps.map((a) =>
        a._id === app._id ? { ...a, currentStage: nextStage } : a,
      ),
    );

    try {
      await applicationsApi.updateStage(app._id, { stage: nextStage });
      toast.success(`Moved to ${STAGE_LABELS[nextStage]}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to move candidate");
      setApplications(prevApps); // Revert
    }
  };

  const handleReject = async (app) => {
    // Optimistic Update
    const prevApps = [...applications];
    setApplications((apps) => apps.filter((a) => a._id !== app._id)); // Removing from board

    try {
      await applicationsApi.updateStage(app._id, { stage: "rejected" });
      toast.success("Candidate rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject candidate");
      setApplications(prevApps); // Revert
    }
  };

  const jobOptions = jobs.map((j) => ({ label: j.title, value: j._id }));

  if (jobsStatus === "failed") {
    return <ErrorState description="Failed to load jobs" onRetry={() => dispatch(fetchJobs({ status: "open" }))} />;
  }

  if (boardError) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
          <h1 className="text-2xl font-display font-bold text-text-primary">
            Pipeline Board
          </h1>
          <div className="w-full sm:w-64">
            <Select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              options={
                jobOptions.length > 0
                  ? jobOptions
                  : [{ label: "No open jobs", value: "" }]
              }
              disabled={jobsStatus === "loading"}
            />
          </div>
        </div>
        <ErrorState description={boardError} onRetry={() => fetchBoardData(selectedJobId)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <h1 className="text-2xl font-display font-bold text-text-primary">
          Pipeline Board
        </h1>
        <div className="w-full sm:w-64">
          <Select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            options={
              jobOptions.length > 0
                ? jobOptions
                : [{ label: "No open jobs", value: "" }]
            }
            disabled={jobsStatus === "loading"}
          />
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        {isLoading && applications.length === 0 ? (
          <div className="flex gap-4 h-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-80 flex-shrink-0 bg-surface-elevated border border-border rounded-lg flex flex-col p-4 space-y-4"
              >
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        ) : !selectedJobId ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-border rounded-lg bg-surface-elevated/50 text-text-secondary">
            Select a job to view its pipeline
          </div>
        ) : (
          <div className="flex gap-6 h-full items-start">
            {STAGE_ORDER.map((stage) => (
              <div
                key={stage}
                className="w-80 flex-shrink-0 bg-surface-elevated/50 border border-border rounded-xl flex flex-col max-h-full overflow-hidden"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-border bg-surface-elevated sticky top-0 flex justify-between items-center shadow-sm z-10">
                  <h3 className="font-display font-bold text-text-primary">
                    {STAGE_LABELS[stage]}
                  </h3>
                  <span className="bg-surface text-text-secondary text-xs px-2 py-1 rounded-full border border-border font-medium">
                    {groupedApps[stage].length}
                  </span>
                </div>

                {/* Column Content */}
                <div className="p-4 overflow-y-auto flex-1 space-y-3 min-h-[150px]">
                  {groupedApps[stage].map((app) => (
                    <div
                      key={app._id}
                      className="bg-surface border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col cursor-default"
                    >
                      <div
                        className="font-medium text-text-primary truncate"
                        title={app.candidateId?.name}
                      >
                        {app.candidateId?.name || "Unknown Candidate"}
                      </div>
                      <div
                        className="text-xs text-text-secondary mt-1 truncate"
                        title={app.candidateId?.email}
                      >
                        {app.candidateId?.email}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-border flex justify-between items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger hover:text-danger hover:bg-danger/10 px-2"
                          onClick={() => handleReject(app)}
                        >
                          Reject
                        </Button>
                        {stage !== "hired" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="px-3"
                            onClick={() => handleNextStage(app)}
                          >
                            Move to{" "}
                            {
                              STAGE_LABELS[
                                STAGE_ORDER[STAGE_ORDER.indexOf(stage) + 1]
                              ]
                            }{" "}
                            →
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {groupedApps[stage].length === 0 && (
                    <div className="text-center py-6 text-sm text-text-muted border-2 border-dashed border-border rounded-lg">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
