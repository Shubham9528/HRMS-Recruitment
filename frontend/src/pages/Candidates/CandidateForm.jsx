import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { createCandidate } from '../../features/candidates/candidatesSlice';
import { applicationsApi } from '../../api/applications.api';
import { fetchJobs } from '../../features/jobs/jobsSlice';
import { candidateSchema } from './candidate.schema';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

export default function CandidateForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: jobs, status: jobsStatus } = useSelector((state) => state.jobs);
  
  useEffect(() => {
    // We only want to populate the dropdown with jobs that are actively open
    dispatch(fetchJobs({ status: 'open' }));
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      jobId: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // Step 1: Create the base candidate object
      const candidatePayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      
      const candidateAction = await dispatch(createCandidate(candidatePayload));
      if (createCandidate.rejected.match(candidateAction)) {
        throw new Error(candidateAction.payload);
      }
      
      const candidateId = candidateAction.payload._id;
      
      // Step 2: Automatically create the joining application to the selected job
      await applicationsApi.createApplication({
        candidateId,
        jobId: data.jobId,
      });
      
      toast.success('Candidate and application created successfully');
      navigate('/candidates');
    } catch (error) {
      toast.error(error.message || 'An error occurred during submission');
    }
  };

  const jobOptions = [
    { label: 'Select a Job...', value: '' },
    ...jobs.map(job => ({ label: job.title, value: job._id }))
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text-primary">Add Candidate</h1>
        <Button variant="ghost" onClick={() => navigate('/candidates')}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-elevated p-6 rounded-md shadow-card border border-border space-y-6">
        <div className="space-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input label="Full Name" error={errors.name?.message} {...field} />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input type="email" label="Email Address" error={errors.email?.message} {...field} />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input label="Phone Number (Optional)" error={errors.phone?.message} {...field} />
            )}
          />
          <Controller
            name="jobId"
            control={control}
            render={({ field }) => (
              <Select
                label="Apply for Job"
                error={errors.jobId?.message}
                options={jobOptions}
                disabled={jobsStatus === 'loading'}
                {...field}
              />
            )}
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end space-x-3">
          <Button variant="ghost" onClick={() => navigate('/candidates')} type="button">Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>
            Add Candidate
          </Button>
        </div>
      </form>
    </div>
  );
}
