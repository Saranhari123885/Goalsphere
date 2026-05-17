import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import AchievementOrb from '@/three/AchievementOrb'
import { Target, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react'
import api from '../api/client'

export default function EmployeeDashboard() {
  const [completionPercent, setCompletionPercent] = useState(0)
  const [goals, setGoals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [employeeName, setEmployeeName] = useState('Employee')
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, atRisk: 0 })

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const res = await api.get(`/goals/employee/${userId}`);
        const fetchedGoals = res.data;
        
        if (fetchedGoals.length > 0 && fetchedGoals[0].employee) {
          setEmployeeName(fetchedGoals[0].employee.name);
        }

        setGoals(fetchedGoals);

        // Calculate Stats
        const total = fetchedGoals.length;
        let completed = 0;
        let inProgress = 0;
        let atRisk = 0;
        let totalProgress = 0;

        fetchedGoals.forEach((g: any) => {
          const prog = g.progressPercent || 0;
          totalProgress += prog;
          
          if (prog === 100) completed++;
          else if (prog > 0 && prog < 100) inProgress++;
          else if (prog === 0) atRisk++;
        });

        setStats({ total, completed, inProgress, atRisk });
        setCompletionPercent(total > 0 ? Math.round(totalProgress / total) : 0);

      } catch (err) {
        console.error("Failed to fetch dashboard goals", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome & 3D Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-brand-900/50 to-slate-900/50">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Target className="w-32 h-32 text-brand-300" />
          </div>
          <CardHeader>
            <CardTitle className="text-3xl font-display font-bold">Welcome back, {employeeName}</CardTitle>
            <CardDescription className="text-slate-300 text-lg">Q3 Performance Cycle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Goal Progress</span>
                <span className="text-sm font-bold text-brand-300">{completionPercent}%</span>
              </div>
              <Progress value={completionPercent} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-slate-400">Total Goals</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                <div className="text-xs text-slate-400">Completed</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
                <div className="text-xs text-slate-400">In Progress</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-2xl font-bold text-red-400">{stats.atRisk}</div>
                <div className="text-xs text-slate-400">At Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Orb Card */}
        <Card className="flex flex-col items-center justify-center min-h-[300px]">
          <CardHeader className="text-center pb-0">
            <CardTitle className="text-sm text-slate-400 font-medium tracking-wider uppercase">Performance Orb</CardTitle>
          </CardHeader>
          <CardContent className="w-full flex-1 p-0">
            <AchievementOrb progress={completionPercent} />
          </CardContent>
        </Card>
      </div>

      {/* Goal Status Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-brand-400" />
          Active Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
          ) : goals.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-10">No active goals found. Click 'Create Goals' to get started.</div>
          ) : goals.map((goal) => (
            <Card key={goal.id} className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-brand-500/20 text-brand-300">
                    {goal.thrustArea || 'General'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Q3 Cycle
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-400">Progress: {goal.achievement || 0} / {goal.target || 0}</span>
                      <span className={`text-xs font-medium ${goal.progressPercent >= 100 ? 'text-green-400' : goal.progressPercent > 0 ? 'text-yellow-400' : 'text-slate-400'}`}>
                        {goal.progressPercent || 0}%
                      </span>
                    </div>
                    <Progress value={goal.progressPercent || 0} className="h-1.5" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded">
                    <AlertCircle className="w-4 h-4 text-brand-400" />
                    Weightage: {goal.weightage}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
