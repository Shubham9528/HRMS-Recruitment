import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

import { createJob, updateJob } from "../../features/jobs/jobsSlice";
import { jobSchema } from "./job.schema";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function JobForm({ mode = "create", defaultValues }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { items: jobs } = useSelector((state) => state.jobs);

  // Find the job if we are in edit mode
  const jobToEdit = mode === "edit" ? jobs.find((j) => j._id === id) : null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      employmentType: "full-time",
      status: "open",
      description: "",
      requirements: "",
      openings: 1,
    },
  });

  // Re-initialize form if defaultValues or jobToEdit arrive asynchronously
  useEffect(() => {
    const dataToLoad = defaultValues || jobToEdit;
    if (dataToLoad) {
      const vals = { ...dataToLoad };
      // Transform array back to multiline string for the textarea
      if (Array.isArray(vals.requirements)) {
        vals.requirements = vals.requirements.join("\n");
      }
      reset(vals);
    }
  }, [defaultValues, jobToEdit, reset]);

  // Fallback: If we hit this page directly, fetch the job
  useEffect(() => {
    if (mode === "edit" && !jobToEdit && !defaultValues) {
      import("../../api/jobs.api").then(({ jobsApi }) => {
        jobsApi
          .getJob(id)
          .then((job) => {
            const vals = { ...job };
            if (Array.isArray(vals.requirements)) {
              vals.requirements = vals.requirements.join("\n");
            }
            reset(vals);
          })
          .catch((err) => {
            toast.error(err.message || "Failed to fetch job details");
          });
      });
    }
  }, [mode, id, jobToEdit, defaultValues, reset]);

  const onSubmit = async (data) => {
    // Transform textarea string into an array of strings
    const payload = {
      ...data,
      requirements: data.requirements
        .split("\n")
        .filter((r) => r.trim() !== ""),
      openings: Number(data.openings),
    };

    try {
      if (mode === "edit") {
        const action = await dispatch(updateJob({ id, payload }));
        if (updateJob.rejected.match(action)) throw new Error(action.payload);
        toast.success("Job updated successfully");
      } else {
        const action = await dispatch(createJob(payload));
        if (createJob.rejected.match(action)) throw new Error(action.payload);
        toast.success("Job created successfully");
      }
      navigate("/jobs");
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text-primary">
          {mode === "edit" ? "Edit Job" : "Create New Job"}
        </h1>
        <Button variant="ghost" onClick={() => navigate("/jobs")}>
          Cancel
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface-elevated p-6 rounded-md shadow-card border border-border space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                label="Job Title"
                error={errors.title?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <Input
                label="Department"
                error={errors.department?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input
                label="Location"
                error={errors.location?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <Select
                label="Employment Type"
                error={errors.employmentType?.message}
                options={[
                  { label: "Full-time", value: "full-time" },
                  { label: "Part-time", value: "part-time" },
                  { label: "Contract", value: "contract" },
                  { label: "Internship", value: "internship" },
                ]}
                {...field}
              />
            )}
          />
          <Controller
            name="openings"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                label="Openings"
                error={errors.openings?.message}
                {...field}
              />
            )}
          />
          {mode === "edit" && (
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  label="Status"
                  error={errors.status?.message}
                  options={[
                    { label: "Open", value: "open" },
                    { label: "Closed", value: "closed" },
                    { label: "Archived", value: "archived" },
                  ]}
                  {...field}
                />
              )}
            />
          )}
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-text-primary">
                Description
              </label>
              <textarea
                className={`px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-surface-elevated min-h-[120px] ${errors.description ? "border-danger focus:ring-danger focus:border-danger" : "border-border"}`}
                {...field}
              ></textarea>
              {errors.description && (
                <span className="mt-1 text-sm text-danger">
                  {errors.description.message}
                </span>
              )}
            </div>
          )}
        />

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-text-primary">
                Requirements (one per line)
              </label>
              <textarea
                className={`px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-surface-elevated min-h-[120px] ${errors.requirements ? "border-danger focus:ring-danger focus:border-danger" : "border-border"}`}
                {...field}
              ></textarea>
              {errors.requirements && (
                <span className="mt-1 text-sm text-danger">
                  {errors.requirements.message}
                </span>
              )}
            </div>
          )}
        />

        <div className="pt-4 border-t border-border flex justify-end space-x-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/jobs")}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {mode === "edit" ? "Save Changes" : "Create Job"}
          </Button>
        </div>
      </form>
    </div>
  );
}

JobForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
  defaultValues: PropTypes.object,
};
