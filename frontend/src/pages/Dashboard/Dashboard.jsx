import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';

const STAGE_COLORS = {
  applied: '#6B7280', // text-secondary
  screening: '#A67C3D', // accent
  interview: '#D97706', // warning
  offer: '#2B3A67', // primary
  hired: '#16A34A', // success
  rejected: '#DC2626', // danger
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/summary');
        setData(response.data.data);
      } catch (err) {
        setError('Failed to load dashboard summary');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center py-10 font-medium">{error}</div>;
  }

  // Transform pipelineCounts into array for Recharts
  const pipelineData = Object.entries(data?.pipelineCounts || {}).map(([stage, count]) => ({
    name: stage.charAt(0).toUpperCase() + stage.slice(1),
    count,
    fill: STAGE_COLORS[stage] || '#9CA3AF'
  }));

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text-primary">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-elevated rounded-xl border border-border p-6 shadow-card hover:shadow-md transition-shadow flex flex-col justify-center">
          <div className="text-sm font-medium text-text-secondary mb-1">Total Jobs</div>
          <div className="text-4xl font-display font-bold text-text-primary">{data?.jobStats?.total || 0}</div>
        </div>
        <div className="bg-surface-elevated rounded-xl border border-border p-6 shadow-card hover:shadow-md transition-shadow flex flex-col justify-center">
          <div className="text-sm font-medium text-text-secondary mb-1">Open Jobs</div>
          <div className="text-4xl font-display font-bold text-primary">{data?.jobStats?.open || 0}</div>
        </div>
        <div className="bg-surface-elevated rounded-xl border border-border p-6 shadow-card hover:shadow-md transition-shadow flex flex-col justify-center">
          <div className="text-sm font-medium text-text-secondary mb-1">Closed Jobs</div>
          <div className="text-4xl font-display font-bold text-text-secondary">{data?.jobStats?.closed || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Chart */}
        <div className="bg-surface-elevated rounded-xl border border-border p-6 shadow-card hover:shadow-md transition-shadow">
          <h2 className="text-lg font-display font-semibold text-text-primary mb-6">Application Pipeline</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '12px' }} 
                  itemStyle={{ color: '#18181B', fontWeight: 500 }}
                  labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-elevated rounded-xl border border-border p-6 shadow-card hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold text-text-primary">Recent Activity</h2>
            <Link to="/pipeline" className="text-sm font-medium text-primary hover:text-accent transition-colors">
              View Pipeline
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[300px]">
            {data?.recentActivity?.length > 0 ? (
              data.recentActivity.map((app) => (
                <div key={app._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface transition-colors border border-transparent hover:border-border">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {app.candidateId?.name} applied for {app.jobId?.title}
                    </p>
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      {new Date(app.createdAt).toLocaleDateString()} at {new Date(app.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <Badge status={app.currentStage} />
                </div>
              ))
            ) : (
              <div className="text-center text-text-secondary py-12">
                No recent activity found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
