import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Target, Users, CheckCircle2, Clock, ShieldAlert, FileText, Zap, Loader2 } from 'lucide-react'
import ExecutiveGlobe from '@/three/ExecutiveGlobe'
import { useState, useEffect } from 'react'
import api from '../api/client'

export default function ExecutiveCommandCenter() {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  
  const [stats, setStats] = useState({ totalGoals: 0, employees: 0, pending: 0, escalations: 0, avgCompletion: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const [goalsRes, usersRes] = await Promise.all([
          api.get('/reports/summary'),
          api.get('/admin/users')
        ]);
        
        const goals = goalsRes.data;
        const users = usersRes.data;

        let pending = 0;
        let totalProgress = 0;
        let escalations = 0;

        goals.forEach((g: any) => {
          if (g.status === 'Submitted') pending++;
          if ((g.progressPercent || 0) < 20) escalations++;
          totalProgress += (g.progressPercent || 0);
        });

        setStats({
          totalGoals: goals.length,
          employees: users.length,
          pending,
          escalations,
          avgCompletion: goals.length > 0 ? Math.round(totalProgress / goals.length) : 0
        });

      } catch (err) {
        console.error("Failed to fetch executive data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrgData();
  }, []);

  const handleAdminAction = async (action: string) => {
    setActiveAction(action)
    await new Promise(resolve => setTimeout(resolve, 800))
    setActiveAction(null)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Executive Command Center</h1>
        <p className="text-slate-400">Global HR Intelligence & Administrative Controls</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="glass-card bg-slate-900/40">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Target className="w-8 h-8 text-brand-400 mb-2" />
            <p className="text-xs text-slate-400">Total Goals</p>
            <h3 className="text-2xl font-bold text-white">{isLoading ? '-' : stats.totalGoals}</h3>
          </CardContent>
        </Card>
        <Card className="glass-card bg-slate-900/40">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Users className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-xs text-slate-400">Active Employees</p>
            <h3 className="text-2xl font-bold text-white">{isLoading ? '-' : stats.employees}</h3>
          </CardContent>
        </Card>
        <Card className="glass-card bg-slate-900/40">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Clock className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-xs text-slate-400">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-white">{isLoading ? '-' : stats.pending}</h3>
          </CardContent>
        </Card>
        <Card className="glass-card bg-slate-900/40">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-xs text-slate-400">Escalations</p>
            <h3 className="text-2xl font-bold text-white">{isLoading ? '-' : stats.escalations}</h3>
          </CardContent>
        </Card>
        <Card className="glass-card bg-slate-900/40">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-xs text-slate-400">Org Completion</p>
            <h3 className="text-2xl font-bold text-white">{isLoading ? '-' : `${stats.avgCompletion}%`}</h3>
          </CardContent>
        </Card>
        <Card className="glass-card bg-slate-900/40">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <FileText className="w-8 h-8 text-fuchsia-400 mb-2" />
            <p className="text-xs text-slate-400">Cycle Status</p>
            <h3 className="text-lg font-bold text-white">Q3 Active</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <ExecutiveGlobe />
        </div>
        
        <div className="space-y-6">
          <Card className="glass-card border-brand-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-400" />
                AI Insights Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-sm">
                <span className="font-bold text-red-400">Alert: </span>
                Completion dropped 15% from Q1 in the Sales department.
              </div>
              <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20 text-sm">
                <span className="font-bold text-yellow-400">Warning: </span>
                Three key managers have significantly delayed approvals.
              </div>
              <div className="p-3 rounded bg-green-500/10 border border-green-500/20 text-sm">
                <span className="font-bold text-green-400">Success: </span>
                Engineering is 12% ahead of schedule on Q2 deliverables.
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
             <CardHeader>
                <CardTitle>Administrative Controls</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
                <button 
                  onClick={() => handleAdminAction('cycles')}
                  disabled={activeAction !== null}
                  className="w-full flex items-center justify-between text-left px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 transition text-sm disabled:opacity-50"
                >
                  Manage Cycle Windows
                  {activeAction === 'cycles' && <Loader2 className="w-4 h-4 animate-spin" />}
                </button>
                <button 
                  onClick={() => handleAdminAction('unlock')}
                  disabled={activeAction !== null}
                  className="w-full flex items-center justify-between text-left px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 transition text-sm disabled:opacity-50"
                >
                  Unlock Employee Goals
                  {activeAction === 'unlock' && <Loader2 className="w-4 h-4 animate-spin" />}
                </button>
                <button 
                  onClick={() => handleAdminAction('audit')}
                  disabled={activeAction !== null}
                  className="w-full flex items-center justify-between text-left px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 transition text-sm disabled:opacity-50"
                >
                  View Audit Logs
                  {activeAction === 'audit' && <Loader2 className="w-4 h-4 animate-spin" />}
                </button>
                <button 
                  onClick={() => handleAdminAction('kpi')}
                  disabled={activeAction !== null}
                  className="w-full flex items-center justify-between text-left px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 transition text-sm text-brand-400 disabled:opacity-50"
                >
                  Configure Shared KPIs
                  {activeAction === 'kpi' && <Loader2 className="w-4 h-4 animate-spin" />}
                </button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
