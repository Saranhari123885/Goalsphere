import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings, Bell, FileText, Users, Target, Activity, CheckCircle, Database, Loader2, Check, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import api from '../api/client'

interface DynamicModulePageProps {
  title: string;
  description: string;
  type: 'grid' | 'table' | 'list' | 'settings';
}

const mockGridData = [
  { id: 1, title: 'Increase Q3 Sales Pipeline', desc: 'Expand outreach to Enterprise accounts.', progress: 75, status: 'On Track', color: 'bg-blue-500' },
  { id: 2, title: 'Deploy New HR Portal', desc: 'Complete backend integration for employee portal.', progress: 90, status: 'Ahead', color: 'bg-green-500' },
  { id: 3, title: 'Reduce Churn Rate', desc: 'Implement automated check-ins for at-risk clients.', progress: 40, status: 'At Risk', color: 'bg-red-500' },
  { id: 4, title: 'Launch Marketing Campaign', desc: 'Q3 brand awareness campaign across LinkedIn.', progress: 15, status: 'Started', color: 'bg-yellow-500' },
  { id: 5, title: 'Hire 3 Senior Engineers', desc: 'Fill the critical roles for the backend team.', progress: 66, status: 'On Track', color: 'bg-blue-500' },
]

const mockTableData = [
  { id: '1042', identifier: 'Sarah Connor', status: 'Active', updated: '2 hours ago', action: 'Review', color: 'text-brand-300 bg-brand-500/20' },
  { id: '1043', identifier: 'John Smith', status: 'Pending', updated: '1 day ago', action: 'Approve', color: 'text-yellow-300 bg-yellow-500/20' },
  { id: '1044', identifier: 'Alex Johnson', status: 'Blocked', updated: '3 days ago', action: 'Resolve', color: 'text-red-300 bg-red-500/20' },
  { id: '1045', identifier: 'Maria Garcia', status: 'Active', updated: '5 hours ago', action: 'Review', color: 'text-brand-300 bg-brand-500/20' },
  { id: '1046', identifier: 'David Chen', status: 'Completed', updated: '1 week ago', action: 'View', color: 'text-green-300 bg-green-500/20' },
]

const mockListData = [
  { id: 1, title: 'Pending Approval Required', subtitle: 'John Smith submitted Q3 goals for review.', time: '10m ago', unread: true },
  { id: 2, title: 'System Maintenance Alert', subtitle: 'Scheduled downtime this weekend for 2 hours.', time: '1h ago', unread: true },
  { id: 3, title: 'Goal Completed', subtitle: 'Maria Garcia completed "Deploy New HR Portal".', time: '3h ago', unread: false },
  { id: 4, title: 'Weekly Digest', subtitle: 'Your team completed 12 tasks this week.', time: '2d ago', unread: false },
]

export default function DynamicModulePage({ title, description, type }: DynamicModulePageProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('General')
  
  // Dynamic Data States
  const [isLoading, setIsLoading] = useState(false)
  const [gridData, setGridData] = useState<any[]>([])
  const [tableData, setTableData] = useState<any[]>([])
  const [listData, setListData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        
        if (title === 'My Goals' && userId) {
          const res = await api.get(`/goals/employee/${userId}`);
          setGridData(res.data.map((g: any) => ({
            id: g.id,
            title: g.title,
            desc: g.thrustArea,
            progress: g.progressPercent || 0,
            status: g.status || 'Active',
            color: 'bg-blue-500'
          })));
        } else if (title === 'Team Goals Overview' || title === 'Goal Approvals') {
          const res = await api.get(`/goals/team`);
          const formattedData = res.data.map((g: any) => ({
            id: g.id.toString(),
            identifier: g.employee ? g.employee.name : 'Unknown User',
            title: g.title,
            desc: g.thrustArea,
            progress: g.progressPercent || 0,
            status: g.status || 'Active',
            updated: 'Just now',
            action: 'Review',
            color: 'text-brand-300 bg-brand-500/20'
          }));
          setGridData(formattedData);
          setTableData(formattedData);
        } else if (title === 'User Management') {
          const res = await api.get(`/admin/users`);
          setTableData(res.data.map((u: any) => ({
            id: u.id.toString(),
            identifier: u.name,
            status: u.role,
            updated: u.email,
            action: 'Edit',
            color: 'text-green-300 bg-green-500/20'
          })));
        } else if (title === 'System Audit Logs') {
          const res = await api.get(`/admin/audit-logs`);
          setTableData(res.data.map((l: any) => ({
            id: l.id.toString(),
            identifier: l.action,
            status: 'Logged',
            updated: l.timestamp,
            action: 'View',
            color: 'text-slate-300 bg-slate-500/20'
          })));
        } else if (title === 'Notifications' && userId) {
          const res = await api.get(`/notifications/user/${userId}`);
          setListData(res.data.map((n: any) => ({
            id: n.id.toString(),
            title: n.title || 'System Notification',
            subtitle: n.message,
            time: 'Just now',
            unread: !n.read
          })));
        } else if (title === '1-on-1 Check-ins') {
          const res = await api.get(`/manager/check-ins`);
          setListData(res.data.map((c: any) => ({
            id: c.id.toString(),
            title: `Check-in: ${c.employee ? c.employee.name : 'Employee'}`,
            subtitle: c.notes || 'No notes provided',
            time: c.date,
            unread: false
          })));
        } else if (title === 'Shared KPIs') {
          const res = await api.get(`/manager/shared-goals`);
          setGridData(res.data.map((s: any) => ({
            id: s.id.toString(),
            title: s.sourceGoal ? s.sourceGoal.title : 'Shared KPI',
            desc: `Assigned to: ${s.assignedUser ? s.assignedUser.name : 'Team'}`,
            progress: s.sourceGoal ? s.sourceGoal.progressPercent : 0,
            status: 'Active',
            color: 'bg-purple-500'
          })));
        } else if (title === 'Cycle Configuration') {
          const res = await api.get(`/admin/cycle-configs`);
          setTableData(res.data.map((c: any) => ({
            id: c.id.toString(),
            identifier: c.quarter,
            status: c.active ? 'Active' : 'Closed',
            updated: `${c.startDate} to ${c.endDate}`,
            action: 'Configure',
            color: c.active ? 'text-green-300 bg-green-500/20' : 'text-slate-300 bg-slate-500/20'
          })));
        } else if (title === 'Goal Unlock Requests') {
          const res = await api.get(`/admin/unlock-requests`);
          setTableData(res.data.map((g: any) => ({
            id: g.id.toString(),
            identifier: g.employee ? g.employee.name : 'Unknown User',
            status: 'Locked',
            updated: g.title,
            action: 'Unlock',
            color: 'text-red-300 bg-red-500/20'
          })));
        } else if (title === 'Managerial Reports' || title === 'Global Analytics Reports') {
          const res = await api.get(`/reports/summary`);
          const formatted = res.data.map((g: any) => ({
            id: g.id.toString(),
            identifier: g.title,
            status: g.status,
            updated: `${g.progressPercent || 0}%`,
            action: 'View',
            color: 'text-blue-300 bg-blue-500/20'
          }));
          setTableData(formatted);
          setGridData(formatted.map((f: any) => ({
             id: f.id, title: f.identifier, desc: 'Analytics Summary', progress: parseInt(f.updated), status: f.status, color: 'bg-indigo-500'
          })));
        } else {
          // Fallbacks for other pages
          setGridData(mockGridData);
          setTableData(mockTableData);
          setListData(mockListData);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        // Fallback on failure
        setGridData(mockGridData);
        setTableData(mockTableData);
        setListData(mockListData);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [title]);
  
  // Settings Form State
  const [name, setName] = useState('Demo User')
  const [email, setEmail] = useState('user@goalsphere.com')
  const [role, setRole] = useState('Standard Access')
  
  const [theme, setTheme] = useState(localStorage.getItem('themePreference') || 'Dark Mode (Default)')
  const [timezone, setTimezone] = useState('UTC (Universal Time)')
  
  // Theme Toggle Effect
  useEffect(() => {
    if (theme === 'Light Mode') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('themePreference', theme);
  }, [theme]);
  
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushAlerts, setPushAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  
  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }
  
  const getIcon = () => {
    const t = title.toLowerCase();
    if (t.includes('setting') || t.includes('profile') || t.includes('cycle')) return <Settings className="w-8 h-8 text-brand-400" />
    if (t.includes('notification')) return <Bell className="w-8 h-8 text-yellow-400" />
    if (t.includes('user') || t.includes('team')) return <Users className="w-8 h-8 text-blue-400" />
    if (t.includes('goal') || t.includes('kpi')) return <Target className="w-8 h-8 text-red-400" />
    if (t.includes('report') || t.includes('log')) return <FileText className="w-8 h-8 text-fuchsia-400" />
    if (t.includes('approval') || t.includes('check-in')) return <CheckCircle className="w-8 h-8 text-green-400" />
    return <Database className="w-8 h-8 text-brand-400" />
  }

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
          {getIcon()} {title}
        </h1>
        <p className="text-slate-400">{description}</p>
      </div>

      {type === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
          ) : gridData.map(item => (
            <Card key={item.id} className="glass-card bg-slate-900/40 border-white/5 hover:border-brand-500/30 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-md flex items-center justify-center">
                    <Target className="w-5 h-5 text-brand-400" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/5`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{item.desc}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className={`h-2`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {type === 'table' && (
        <Card className="glass-card overflow-hidden border-white/5">
          <CardContent className="p-0">
            <div className="w-full">
              <div className="grid grid-cols-4 p-4 border-b border-white/10 text-sm font-bold text-slate-300 bg-slate-950/50">
                <div>Identifier</div>
                <div>Status</div>
                <div>Last Updated</div>
                <div>Action</div>
              </div>
              {isLoading ? (
                <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
              ) : tableData.map(row => (
                <div key={row.id} className="grid grid-cols-4 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                      {row.id.substring(row.id.length - 2)}
                    </div>
                    <span className="font-medium text-slate-200">{row.identifier}</span>
                  </div>
                  <div><span className={`px-2 py-1 text-xs rounded font-medium ${row.color}`}>{row.status}</span></div>
                  <div className="text-sm text-slate-400 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {row.updated}
                  </div>
                  <div>
                    <button className="px-3 py-1.5 bg-slate-800 rounded-md hover:bg-brand-600 transition cursor-pointer flex items-center justify-center text-xs text-slate-300 hover:text-white">
                      {row.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {type === 'list' && (
        <div className="space-y-4 max-w-4xl">
          {isLoading ? (
            <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
          ) : listData.map(item => (
            <Card key={item.id} className={`bg-slate-900/40 border-white/5 hover:border-brand-500/30 transition-colors ${item.unread ? 'border-l-4 border-l-brand-500' : ''}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${item.unread ? 'bg-brand-500/20' : 'bg-slate-800'}`}>
                   <Bell className={`w-5 h-5 ${item.unread ? 'text-brand-400' : 'text-slate-500'}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-base ${item.unread ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.subtitle}</p>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {item.time}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {type === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            {['General', 'Security', 'Preferences', 'Notifications'].map((tab) => (
              <div 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`h-10 w-full px-4 flex items-center rounded-md cursor-pointer transition ${activeTab === tab ? 'bg-brand-500/20 text-brand-300 font-medium' : 'hover:bg-white/5 text-slate-400'}`}
              >
                {tab}
              </div>
            ))}
          </div>
          <Card className="glass-card md:col-span-2 border-white/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg">{activeTab} Settings</CardTitle>
              <CardDescription>Manage your {activeTab.toLowerCase()} preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              {activeTab === 'General' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Name / Identifier</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Primary Role</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors">
                      <option value="Standard Access" className="bg-slate-900">Standard Access</option>
                      <option value="Elevated Privileges" className="bg-slate-900">Elevated Privileges</option>
                      <option value="Restricted" className="bg-slate-900">Restricted</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'Security' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-950/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">New Password</label>
                    <input type="password" placeholder="Leave blank to keep current" className="w-full bg-slate-950/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-400">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition rounded text-xs font-medium text-white">Enable 2FA</button>
                  </div>
                </div>
              )}

              {activeTab === 'Preferences' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Theme</label>
                    <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors">
                      <option value="Dark Mode (Default)" className="bg-slate-900">Dark Mode (Default)</option>
                      <option value="Light Mode" className="bg-slate-900">Light Mode</option>
                      <option value="System Preference" className="bg-slate-900">System Preference</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Timezone</label>
                    <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors">
                      <option value="UTC (Universal Time)" className="bg-slate-900">UTC (Universal Time)</option>
                      <option value="EST (Eastern Standard)" className="bg-slate-900">EST (Eastern Standard)</option>
                      <option value="PST (Pacific Standard)" className="bg-slate-900">PST (Pacific Standard)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'Notifications' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} className="w-4 h-4 rounded border-white/10 bg-slate-950/50 text-brand-500 focus:ring-brand-500" />
                      <div>
                        <div className="text-sm font-medium text-slate-200">Email Alerts</div>
                        <div className="text-xs text-slate-400">Receive critical updates via email.</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={pushAlerts} onChange={e => setPushAlerts(e.target.checked)} className="w-4 h-4 rounded border-white/10 bg-slate-950/50 text-brand-500 focus:ring-brand-500" />
                      <div>
                        <div className="text-sm font-medium text-slate-200">Push Notifications</div>
                        <div className="text-xs text-slate-400">Browser alerts for goal approvals.</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={weeklyDigest} onChange={e => setWeeklyDigest(e.target.checked)} className="w-4 h-4 rounded border-white/10 bg-slate-950/50 text-brand-500 focus:ring-brand-500" />
                      <div>
                        <div className="text-sm font-medium text-slate-200">Weekly Digest</div>
                        <div className="text-xs text-slate-400">A weekly summary of team progress.</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-4 py-2 transition rounded-md text-sm font-medium text-white shadow-lg flex items-center ${saveSuccess ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20' : 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/20'} disabled:opacity-50`}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {!isSaving && saveSuccess && <Check className="w-4 h-4 mr-2" />}
                  {saveSuccess ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  )
}
