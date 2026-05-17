import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeDashboard from './pages/EmployeeDashboard';
import GoalCreation from './pages/GoalCreation';
import ManagerDashboard from './pages/ManagerDashboard';
import Analytics from './pages/Analytics';
import Auth from './pages/Auth';
import CompletionDashboard from './pages/CompletionDashboard';
import ExecutiveCommandCenter from './pages/ExecutiveCommandCenter';
import DynamicModulePage from './pages/DynamicModulePage';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

const RootRedirect = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (token && userRole) {
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'manager') return <Navigate to="/manager/dashboard" replace />;
    return <Navigate to="/employee/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-brand-500/30">
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-900/40 via-slate-950 to-slate-950"></div>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Routes wrapped in Navbar Layout */}
          <Route element={<MainLayout />}>
            
            {/* Employee Routes */}
            <Route element={<ProtectedRoute allowedRoles={['employee', 'manager', 'admin']} />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/create-goals" element={<GoalCreation />} />
              <Route path="/employee/completion" element={<CompletionDashboard />} />
              <Route path="/employee/my-goals" element={<DynamicModulePage title="My Goals" description="Track and manage your individual performance objectives" type="grid" />} />
              <Route path="/employee/notifications" element={<DynamicModulePage title="Notifications" description="Recent alerts and system updates" type="list" />} />
              <Route path="/employee/profile" element={<DynamicModulePage title="User Profile" description="Manage your account settings and preferences" type="settings" />} />
            </Route>

            {/* Manager Routes */}
            <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/approvals" element={<DynamicModulePage title="Goal Approvals" description="Review and approve goal changes from your team" type="table" />} />
              <Route path="/manager/team-goals" element={<DynamicModulePage title="Team Goals Overview" description="High-level tracking of all direct reports' objectives" type="grid" />} />
              <Route path="/manager/check-ins" element={<DynamicModulePage title="1-on-1 Check-ins" description="Schedule and document recurring performance syncs" type="list" />} />
              <Route path="/manager/shared-goals" element={<DynamicModulePage title="Shared KPIs" description="Cross-departmental collaborative objectives" type="grid" />} />
              <Route path="/manager/reports" element={<DynamicModulePage title="Managerial Reports" description="Generate performance and completion reports" type="table" />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<ExecutiveCommandCenter />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/user-mgt" element={<DynamicModulePage title="User Management" description="Add, remove, or modify employee access controls" type="table" />} />
              <Route path="/admin/cycle-mgt" element={<DynamicModulePage title="Cycle Configuration" description="Manage global OKR and review cycle timelines" type="settings" />} />
              <Route path="/admin/unlock-goals" element={<DynamicModulePage title="Goal Unlock Requests" description="Review escalations for locked goals" type="table" />} />
              <Route path="/admin/audit-logs" element={<DynamicModulePage title="System Audit Logs" description="Immutable record of system changes and access" type="table" />} />
              <Route path="/admin/reports" element={<DynamicModulePage title="Global Analytics Reports" description="Export org-wide performance data" type="grid" />} />
              <Route path="/admin/settings" element={<DynamicModulePage title="Platform Settings" description="Global platform configurations and integrations" type="settings" />} />
            </Route>
            
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
