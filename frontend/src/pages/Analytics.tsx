import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'
import ExecutiveGlobe from '@/three/ExecutiveGlobe'

const trendData = [
  { name: 'Jan', completion: 45, target: 50 },
  { name: 'Feb', completion: 52, target: 55 },
  { name: 'Mar', completion: 68, target: 65 },
  { name: 'Apr', completion: 74, target: 75 },
  { name: 'May', completion: 82, target: 85 },
  { name: 'Jun', completion: 91, target: 95 },
]

const deptData = [
  { name: 'Engineering', score: 85 },
  { name: 'Marketing', score: 72 },
  { name: 'Sales', score: 91 },
  { name: 'HR', score: 68 },
]

export default function Analytics() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Executive Analytics</h1>
        <p className="text-slate-400">Organization-wide performance visibility</p>
      </div>

      {/* 3D Network Globe */}
      <ExecutiveGlobe />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Company Trajectory</CardTitle>
            <CardDescription>Overall completion vs target over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8da2fb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8da2fb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="completion" stroke="#8da2fb" fillOpacity={1} fill="url(#colorCompletion)" />
                <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Average goal completion score by department</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Bar dataKey="score" fill="#c084fc" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
