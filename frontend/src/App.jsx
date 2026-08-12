import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import JobList from "./pages/Jobs/JobList";
import JobForm from "./pages/Jobs/JobForm";
import JobDetail from "./pages/Jobs/JobDetail";

import CandidateList from "./pages/Candidates/CandidateList";
import CandidateForm from "./pages/Candidates/CandidateForm";
import CandidateDetail from "./pages/Candidates/CandidateDetail";

import PipelineBoard from "./pages/Pipeline/PipelineBoard";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route element={<GuestRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Jobs Routes */}
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/new" element={<JobForm mode="create" />} />
            <Route path="/jobs/:id/edit" element={<JobForm mode="edit" />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Candidates Routes */}
            <Route path="/candidates" element={<CandidateList />} />
            <Route path="/candidates/new" element={<CandidateForm />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />

            {/* Pipeline Route */}
            <Route path="/pipeline" element={<PipelineBoard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
