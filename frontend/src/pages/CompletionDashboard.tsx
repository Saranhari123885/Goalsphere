import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Download, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const pieData = [
  { name: 'Completed', value: 400 },
  { name: 'Pending Approvals', value: 300 },
  { name: 'At Risk', value: 300 },
  { name: 'Not Started', value: 200 },
]
const COLORS = ['#22c55e', '#eab308', '#ef4444', '#64748b']

export default function CompletionDashboard() {
  const exportCsv = () => {
    // Hits the ReportController /api/reports/export endpoint
    window.location.href = "http://localhost:8080/api/reports/export";
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Organization Completion</h1>
          <p className="text-slate-400">Quarterly Tracking & Exports</p>
        </div>
        <Button onClick={exportCsv} className="bg-brand-600 hover:bg-brand-500 text-white">
          <Download className="w-4 h-4 mr-2" /> Export CSV Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Progress Heatmap</CardTitle>
            <CardDescription>Average completion percentage across the org</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-1"><span className="text-sm">Engineering</span><span className="text-sm font-bold">85%</span></div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><span className="text-sm">Sales</span><span className="text-sm font-bold">92%</span></div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><span className="text-sm">Marketing</span><span className="text-sm font-bold">64%</span></div>
              <Progress value={64} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><span className="text-sm">Human Resources</span><span className="text-sm font-bold">78%</span></div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-white/5">
             <CardContent className="p-6 flex items-center gap-4">
                 <div className="p-4 rounded-full bg-brand-500/20"><Users className="text-brand-400 w-8 h-8"/></div>
                 <div>
                     <p className="text-sm text-slate-400">Total Employees Tracking</p>
                     <p className="text-3xl font-bold text-white">1,204</p>
                 </div>
             </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-white/5">
             <CardContent className="p-6 flex items-center gap-4">
                 <div className="p-4 rounded-full bg-green-500/20"><CheckCircle className="text-green-400 w-8 h-8"/></div>
                 <div>
                     <p className="text-sm text-slate-400">Company-wide Goal Approvals</p>
                     <p className="text-3xl font-bold text-white">89%</p>
                 </div>
             </CardContent>
          </Card>
      </div>

    </div>
  )
}
