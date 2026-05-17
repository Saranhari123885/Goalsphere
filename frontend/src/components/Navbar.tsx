import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Target, BarChart2, Users, LayoutDashboard, ShieldAlert, CheckCircle2, LogOut, FileText, Bell, User as UserIcon, Settings, Lock } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const role = localStorage.getItem('role') || 'employee'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  // Navigation config per role
  const roleNavItems = {
    employee: [
      { name: 'Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: 'Create Goals', path: '/employee/create-goals', icon: <Target className="w-4 h-4" /> },
      { name: 'My Goals', path: '/employee/my-goals', icon: <FileText className="w-4 h-4" /> },
      { name: 'Quarter Updates', path: '/employee/completion', icon: <CheckCircle2 className="w-4 h-4" /> },
      { name: 'Notifications', path: '/employee/notifications', icon: <Bell className="w-4 h-4" /> },
      { name: 'Profile', path: '/employee/profile', icon: <UserIcon className="w-4 h-4" /> },
    ],
    manager: [
      { name: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: 'Approvals', path: '/manager/approvals', icon: <CheckCircle2 className="w-4 h-4" /> },
      { name: 'Team Goals', path: '/manager/team-goals', icon: <Users className="w-4 h-4" /> },
      { name: 'Check-ins', path: '/manager/check-ins', icon: <Target className="w-4 h-4" /> },
      { name: 'Shared Goals', path: '/manager/shared-goals', icon: <FileText className="w-4 h-4" /> },
      { name: 'Reports', path: '/manager/reports', icon: <BarChart2 className="w-4 h-4" /> },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: <ShieldAlert className="w-4 h-4" /> },
      { name: 'User Mgt', path: '/admin/user-mgt', icon: <Users className="w-4 h-4" /> },
      { name: 'Cycle Mgt', path: '/admin/cycle-mgt', icon: <Settings className="w-4 h-4" /> },
      { name: 'Unlock Goals', path: '/admin/unlock-goals', icon: <Lock className="w-4 h-4" /> },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: <FileText className="w-4 h-4" /> },
      { name: 'Analytics', path: '/admin/analytics', icon: <BarChart2 className="w-4 h-4" /> },
      { name: 'Reports', path: '/admin/reports', icon: <FileText className="w-4 h-4" /> },
      { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    ]
  }

  const navItems = roleNavItems[role as keyof typeof roleNavItems] || roleNavItems.employee

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to={`/${role}/dashboard`} className="flex items-center gap-2">
              <span className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-fuchsia-400">
                GoalSphere AI
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-brand-300 uppercase font-medium tracking-wider">
              {role}
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
