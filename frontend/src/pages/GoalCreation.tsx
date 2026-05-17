import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react'
import api from '../api/client'

type GoalType = 'Numeric' | 'Percentage' | 'Timeline' | 'Zero Based'

interface GoalDraft {
  id: number
  title: string
  thrustArea: string
  type: GoalType
  weightage: number
}

export default function GoalCreation() {
  const [goals, setGoals] = useState<GoalDraft[]>([
    { id: 1, title: '', thrustArea: '', type: 'Numeric', weightage: 0 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const totalWeightage = useMemo(() => {
    return goals.reduce((sum, goal) => sum + (Number(goal.weightage) || 0), 0)
  }, [goals])

  const isValid = useMemo(() => {
    return totalWeightage === 100 && goals.every(g => g.weightage >= 10 && g.title.trim() !== '') && goals.length <= 8
  }, [totalWeightage, goals])

  const addGoal = () => {
    if (goals.length < 8) {
      setGoals([...goals, { id: Date.now(), title: '', thrustArea: '', type: 'Numeric', weightage: 0 }])
    }
  }

  const removeGoal = (id: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter(g => g.id !== id))
    }
  }

  const updateGoal = (id: number, field: keyof GoalDraft, value: any) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error("No user ID found. Please log in again.");
      
      const payload = goals.map(g => ({
        title: g.title,
        thrustArea: g.thrustArea,
        type: g.type,
        weightage: g.weightage,
        status: 'Submitted'
      }));

      // Submit goals for Q3-2024
      await api.post(`/goals/employee/${userId}/quarter/Q3-2024`, payload);
      
      setIsSubmitting(false);
      navigate('/employee/dashboard');
    } catch (error) {
      console.error("Error submitting goals:", error);
      setIsSubmitting(false);
      alert("Failed to submit goals. Please check the console.");
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Create Quarterly Goals</h1>
        <p className="text-slate-400">Define your objectives for Q2. Total weightage must equal exactly 100%.</p>
      </div>

      {/* Progress Validation Card */}
      <Card className="glass sticky top-6 z-10 border-brand-500/30">
        <CardContent className="pt-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <Label className="text-slate-200">Total Weightage Progress</Label>
              <div className="text-sm text-slate-400 mt-1">
                {goals.length}/8 Goals Maximum
              </div>
            </div>
            <div className={`text-2xl font-bold transition-colors ${totalWeightage === 100 ? 'text-green-400' : totalWeightage > 100 ? 'text-red-400' : 'text-yellow-400'}`}>
              {totalWeightage}% / 100%
            </div>
          </div>
          
          <Progress 
            value={totalWeightage > 100 ? 100 : totalWeightage} 
            className="h-3"
          />
          
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {totalWeightage !== 100 && (
              <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded text-xs">
                <AlertCircle className="w-4 h-4" />
                Must equal exactly 100% to submit
              </div>
            )}
            {goals.some(g => g.weightage > 0 && g.weightage < 10) && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1.5 rounded text-xs">
                <AlertCircle className="w-4 h-4" />
                Minimum 10% per goal required
              </div>
            )}
            {isValid && (
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1.5 rounded text-xs">
                <CheckCircle2 className="w-4 h-4" />
                Ready for submission
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goal Forms */}
      <div className="space-y-6">
        {goals.map((goal, index) => (
          <Card key={goal.id} className="glass-card relative">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 text-sm">
                    {index + 1}
                  </span>
                  Goal Definition
                </CardTitle>
                {goals.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeGoal(goal.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-2">
                  <Label>Goal Title</Label>
                  <Input 
                    placeholder="e.g. Launch new HR portal features"
                    value={goal.title}
                    onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Thrust Area</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={goal.thrustArea}
                      onChange={(e) => updateGoal(goal.id, 'thrustArea', e.target.value)}
                    >
                      <option value="">Select Area...</option>
                      <option value="Innovation">Innovation</option>
                      <option value="Customer Success">Customer Success</option>
                      <option value="Operational Excellence">Operational Excellence</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={goal.type}
                      onChange={(e) => updateGoal(goal.id, 'type', e.target.value as GoalType)}
                    >
                      <option value="Numeric">Numeric</option>
                      <option value="Percentage">Percentage</option>
                      <option value="Timeline">Timeline</option>
                      <option value="Zero Based">Zero Based</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-center bg-slate-900/30 p-4 rounded-xl border border-white/5">
                <Label className="text-center mb-4 text-lg">Weightage (%)</Label>
                <div className="flex items-center justify-center">
                  <Input 
                    type="number"
                    min="10"
                    max="100"
                    className="w-24 text-center text-2xl font-bold h-16 bg-white/5 border-white/20"
                    value={goal.weightage || ''}
                    onChange={(e) => updateGoal(goal.id, 'weightage', parseInt(e.target.value) || 0)}
                  />
                </div>
                {goal.weightage > 0 && goal.weightage < 10 && (
                  <p className="text-red-400 text-xs text-center mt-2">Min 10%</p>
                )}
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button 
          variant="outline" 
          onClick={addGoal}
          disabled={goals.length >= 8}
          className="bg-slate-900/50 hover:bg-slate-800 text-white border-white/20"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Goal
        </Button>

        <Button 
          variant="default" 
          size="lg"
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit}
          className={`transition-all ${isValid ? 'shadow-lg shadow-brand-500/25' : 'opacity-50 cursor-not-allowed'}`}
        >
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Goals'}
        </Button>
      </div>

    </div>
  )
}
