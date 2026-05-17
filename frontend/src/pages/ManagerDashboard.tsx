import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Clock, Users, Search, Filter, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../api/client'

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const [isFiltering, setIsFiltering] = useState(false)
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null)
  
  const [stats, setStats] = useState({ pending: 0, teamSize: 0, avgCompletion: 0, delayed: 0 })
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await api.get('/goals/team');
        const goals = res.data;
        
        let pending = 0;
        let delayed = 0;
        let totalProgress = 0;
        const employeeMap = new Map<number, any>();

        goals.forEach((g: any) => {
          if (g.status === 'Submitted') pending++;
          if ((g.progressPercent || 0) < 30) delayed++;
          totalProgress += (g.progressPercent || 0);

          if (g.employee) {
            const empId = g.employee.id;
            if (!employeeMap.has(empId)) {
              employeeMap.set(empId, {
                id: empId,
                name: g.employee.name || 'Unknown',
                initials: (g.employee.name || 'U').substring(0, 2).toUpperCase(),
                role: 'Employee',
                totalProgress: 0,
                goalCount: 0,
                color: 'from-blue-400 to-cyan-400'
              });
            }
            const emp = employeeMap.get(empId);
            emp.totalProgress += (g.progressPercent || 0);
            emp.goalCount++;
          }
        });

        const members = Array.from(employeeMap.values()).map(emp => ({
          ...emp,
          progress: emp.goalCount > 0 ? Math.round(emp.totalProgress / emp.goalCount) : 0
        }));

        setStats({
          pending,
          teamSize: members.length,
          avgCompletion: goals.length > 0 ? Math.round(totalProgress / goals.length) : 0,
          delayed
        });
        setTeamMembers(members);
      } catch (err) {
        console.error("Failed to fetch team goals", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamData();
  }, []);

  const handleReview = async (id: number) => {
    setActiveReviewId(id)
    await new Promise(r => setTimeout(r, 600))
    setActiveReviewId(null)
    navigate('/employee/dashboard')
  }

  const handleFilter = async () => {
    setIsFiltering(true)
    await new Promise(r => setTimeout(r, 500))
    setIsFiltering(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Team Overview</h1>
          <p className="text-slate-400">Quarterly Performance & Approvals</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleFilter} disabled={isFiltering} className="border-white/10 text-white w-28">
            {isFiltering ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Filter className="w-4 h-4 mr-2" /> Filter</>}
          </Button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9 w-[250px]" placeholder="Search team members..." />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card bg-brand-900/20 border-brand-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-500/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pending Approvals</p>
                <h3 className="text-2xl font-bold text-white">{isLoading ? '-' : stats.pending}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Team Size</p>
                <h3 className="text-2xl font-bold text-white">{isLoading ? '-' : stats.teamSize}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Avg Completion</p>
                <h3 className="text-2xl font-bold text-white">{isLoading ? '-' : `${stats.avgCompletion}%`}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card bg-red-900/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Delayed Goals</p>
                <h3 className="text-2xl font-bold text-white">{isLoading ? '-' : stats.delayed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Progress List */}
      <Card className="glass-card border-white/5">
        <CardHeader>
          <CardTitle>Direct Reports</CardTitle>
          <CardDescription>Click on an employee to view their detailed dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
               <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
            ) : teamMembers.length === 0 ? (
               <div className="text-center py-10 text-slate-400">No active team members with goals found.</div>
            ) : teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-900/40 border border-white/5 hover:bg-slate-800/60 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4 w-1/3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center font-bold text-white`}>
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="text-xs text-slate-400">{member.role}</p>
                  </div>
                </div>
                
                <div className="w-1/3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-400">Q3 Progress</span>
                    <span className="text-xs font-medium text-white">{member.progress}%</span>
                  </div>
                  <Progress value={member.progress} className="h-1.5" />
                </div>
                
                <div className="w-1/4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleReview(member.id)}
                    disabled={activeReviewId === member.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border-white/10 text-white hover:bg-slate-800 w-32"
                  >
                    {activeReviewId === member.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Review Goals'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
