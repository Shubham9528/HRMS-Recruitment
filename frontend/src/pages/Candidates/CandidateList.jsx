import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCandidates, setFilters } from '../../features/candidates/candidatesSlice';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/shared/ErrorState';

export default function CandidateList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error, filters } = useSelector((state) => state.candidates);
  
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Reusing the exact debounced search pattern from JobList
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== localSearch) {
        dispatch(setFilters({ search: localSearch }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch, filters.search]);

  useEffect(() => {
    dispatch(fetchCandidates(filters));
  }, [filters, dispatch]);

  const columns = [
    {
      key: 'name',
      label: 'Candidate',
      render: (value, row) => (
        <div>
          <div className="font-medium text-text-primary">{value}</div>
          <div className="text-xs text-text-secondary">{row.email} {row.phone ? `• ${row.phone}` : ''}</div>
        </div>
      ),
    },
    {
      key: 'applications',
      label: 'Active Applications',
      render: (value) => value ? value.length : 0,
    },
    {
      key: 'createdAt',
      label: 'Added',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/candidates/${row._id}`)}>
            View Profile
          </Button>
        </div>
      ),
    },
  ];

  if (status === 'failed') {
    return <ErrorState description={error} onRetry={() => dispatch(fetchCandidates(filters))} />;
  }

  const emptyAction = (
    <Button onClick={() => navigate('/candidates/new')}>Add your first candidate</Button>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-bold text-text-primary">Candidates</h1>
        <Button onClick={() => navigate('/candidates/new')}>+ Add Candidate</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface-elevated p-4 rounded-md border border-border">
        <div className="flex-1">
          <Input
            name="search"
            placeholder="Search candidates by name or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        data={items}
        isLoading={status === 'loading'}
        emptyMessage="No candidates match your current search."
        emptyAction={emptyAction}
      />
    </div>
  );
}
