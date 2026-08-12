import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { candidatesApi } from "../../api/candidates.api";
import { applicationsApi } from "../../api/applications.api";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/shared/ErrorState";

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [noteText, setNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const fetchCandidateData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await candidatesApi.getCandidate(id);
      setCandidate(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load candidate details",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCandidateData();
  }, [fetchCandidateData]);

  const handleAddNote = async (applicationId) => {
    if (!noteText.trim()) return;

    setIsSubmittingNote(true);

    // Optimistically update UI
    const optimisticNote = {
      text: noteText,
      author: user?.name || "You",
      createdAt: new Date().toISOString(),
      _id: "temp-" + Date.now(),
    };

    const previousCandidateState = { ...candidate };

    setCandidate((prev) => {
      const newCandidate = { ...prev };
      const appIndex = newCandidate.applications.findIndex(
        (a) => a._id === applicationId,
      );
      if (appIndex !== -1) {
        newCandidate.applications[appIndex].notes = [
          ...newCandidate.applications[appIndex].notes,
          optimisticNote,
        ];
      }
      return newCandidate;
    });

    const textToSubmit = noteText;
    setNoteText("");

    try {
      await applicationsApi.addNote(applicationId, { text: textToSubmit });
      fetchCandidateData(); // refresh to get real IDs and author info from backend
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add note");
      // Revert optimistic update on failure
      setCandidate(previousCandidateState);
      setNoteText(textToSubmit);
    } finally {
      setIsSubmittingNote(false);
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

  if (error || !candidate) {
    return (
      <ErrorState
        description={error || "Candidate not found"}
        onRetry={fetchCandidateData}
      />
    );
  }

  // Assuming single primary application for simplicity per the UI spec
  const primaryApp = candidate.applications?.[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            {candidate.name}
          </h1>
          <div className="mt-1 flex items-center space-x-3 text-sm text-text-secondary">
            <span>{candidate.email}</span>
            {candidate.phone && (
              <>
                <span>•</span>
                <span>{candidate.phone}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="ghost" onClick={() => navigate("/candidates")}>
            Back to List
          </Button>
        </div>
      </div>

      {primaryApp ? (
        <div className="space-y-6 flex-1 flex flex-col min-h-0">
          {/* Application Status Card */}
          <div className="bg-surface-elevated rounded-md border border-border shadow-sm overflow-hidden flex-shrink-0">
            <div className="px-6 py-4 border-b border-border bg-surface flex justify-between items-center">
              <h2 className="text-lg font-medium text-text-primary">
                Current Application
              </h2>
              <Badge status={primaryApp.currentStage || "default"} />
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-text-secondary">
                    Applied For
                  </h3>
                  <p className="mt-1 text-base text-text-primary">
                    {primaryApp.job?.title || "Unknown Job"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-secondary">
                    Date Applied
                  </h3>
                  <p className="mt-1 text-base text-text-primary">
                    {new Date(primaryApp.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-surface-elevated rounded-md border border-border shadow-sm flex flex-col flex-1 min-h-0">
            <div className="px-6 py-4 border-b border-border bg-surface flex-shrink-0">
              <h2 className="text-lg font-medium text-text-primary">
                Recruitment Notes
              </h2>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-gray-50/50">
              {!primaryApp.notes || primaryApp.notes.length === 0 ? (
                <div className="text-center py-8 text-text-secondary text-sm">
                  No notes yet. Be the first to leave a comment.
                </div>
              ) : (
                [...primaryApp.notes]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((note) => (
                  <div
                    key={note._id}
                    className="bg-surface p-4 rounded-md border border-border shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm text-text-primary">
                        {note.author}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary whitespace-pre-wrap">
                      {note.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Note Input */}
            <div className="p-4 border-t border-border bg-surface flex flex-col space-y-3 flex-shrink-0">
              <textarea
                className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-surface-elevated h-[80px] text-sm resize-none"
                placeholder="Leave a note about this candidate..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => handleAddNote(primaryApp._id)}
                  isLoading={isSubmittingNote}
                  disabled={!noteText.trim()}
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-elevated p-12 rounded-md border border-border text-center flex-shrink-0">
          <p className="text-text-secondary">
            This candidate has no active applications.
          </p>
        </div>
      )}
    </div>
  );
}
