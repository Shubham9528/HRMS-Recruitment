import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, setFilters } from '../../features/jobs/jobsSlice';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ErrorState from '../../components/shared/ErrorState';

export default function JobList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error, filters } = useSelector((state) => state.jobs);
  
  // Local state for immediate typing, synced to Redux via debounce
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounce search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== localSearch) {
        dispatch(setFilters({ search: localSearch }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch, filters.search]);

  // Fetch jobs when filters change
  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [filters, dispatch]);

  const handleStatusChange = (e) => {
    dispatch(setFilters({ status: e.target.value }));
  };

  const columns = [
    {
      key: 'title',
      label: 'Job Title',
      render: (value, row) => (
        <div>
          <div className="font-medium text-text-primary">{value}</div>
          <div className="text-xs text-text-secondary">{row.location} • {row.employmentType}</div>
        </div>
      ),
    },
    { key: 'department', label: 'Department' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge status={value} />,
    },
    { key: 'openings', label: 'Openings' },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${row._id}`)}>
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${row._id}/edit`)}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  if (status === 'failed') {
    return <ErrorState description={error} onRetry={() => dispatch(fetchJobs(filters))} />;
  }

  const emptyAction = (
    <Button onClick={() => navigate('/jobs/new')}>Create your first job</Button>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-bold text-text-primary">Jobs</h1>
        <Button onClick={() => navigate('/jobs/new')}>+ Create Job</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface-elevated p-4 rounded-md border border-border">
        <div className="flex-1">
          <Input
            name="search"
            placeholder="Search jobs..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            name="status"
            value={filters.status}
            onChange={handleStatusChange}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Open', value: 'open' },
              { label: 'Closed', value: 'closed' },
              { label: 'Archived', value: 'archived' },
            ]}
          />
        </div>
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        data={items}
        isLoading={status === 'loading'}
        emptyMessage="No jobs match your current filters."
        emptyAction={emptyAction}
      />
    </div>
  );
}
