import { Card, CardContent } from '@/components/ui/card'
import { HardHat } from 'lucide-react'

export default function PlaceholderPage() {
  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
      <Card className="bg-slate-900/40 border-white/5 p-12 text-center max-w-md w-full shadow-2xl">
        <CardContent className="flex flex-col items-center pt-6">
          <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mb-6">
            <HardHat className="w-10 h-10 text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Under Construction</h2>
          <p className="text-slate-400">
            This module is currently being developed and will be available in the next release.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
