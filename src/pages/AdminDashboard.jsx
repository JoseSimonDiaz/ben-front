import { getAdminStats } from '../api/index.js'
import useApi from '../hooks/useApi.js'

function StatCard({ statCard, index, statCards }) {
  if (!statCard || index >= statCards.length) return null
  const borderColors = ['hover:border-primary/50', 'hover:border-secondary/50', 'hover:border-tertiary/50']
  const badgeColors = ['bg-primary/10 text-primary', 'bg-secondary/10 text-secondary', 'bg-tertiary/10 text-tertiary']
  return (
    <>
      <div className={`glass-card p-lg rounded-2xl flex flex-col justify-between group ${borderColors[index]} transition-colors`}>
        <div className="flex justify-between items-start">
          <div className={`p-3 ${badgeColors[index]} rounded-xl`}>
            <span className="material-symbols-outlined">{statCard.icon}</span>
          </div>
        </div>
        <div className="mt-lg">
          <h3 className="text-on-surface-variant text-sm font-medium">{statCard.label}</h3>
          <p className="text-4xl font-headline-xl mt-1 tracking-tight">{statCard.value}</p>
        </div>
      </div>
      <StatCard statCard={statCards[index + 1]} index={index + 1} statCards={statCards} />
    </>
  )
}

export default function AdminDashboard() {
  const { data: stats, loading, error } = useApi(() => getAdminStats(), [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex items-center gap-2 animate-pulse">
          <span className="text-on-surface-variant">Cargando estadísticas...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
        <p className="text-on-surface-variant">No se pudieron cargar las estadísticas: {error}</p>
      </div>
    )
  }

  const statCards = [
    { icon: 'quiz', label: 'Total Preguntas', value: stats?.totalQuestions || 0 },
    { icon: 'school', label: 'Total Carreras', value: stats?.totalCareers || 0 },
    { icon: 'account_balance', label: 'Total Facultades', value: stats?.totalFaculties || 0 },
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <StatCard statCard={statCards[0]} index={0} statCards={statCards} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 glass-card rounded-2xl p-lg flex flex-col">
          <h3 className="font-headline-lg text-xl mb-lg">Tests realizados</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl font-extrabold text-primary">{stats?.totalSessions || 0}</span>
              <p className="text-on-surface-variant mt-2">sesiones de test completadas</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-lg flex flex-col justify-between overflow-hidden relative">
          <div className="z-10">
            <h3 className="font-headline-lg text-xl mb-4">Resumen</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Carreras</span>
                <span className="text-xs font-bold text-primary">{stats?.totalCareers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Facultades</span>
                <span className="text-xs font-bold text-secondary">{stats?.totalFaculties || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Preguntas</span>
                <span className="text-xs font-bold text-tertiary">{stats?.totalQuestions || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Tests</span>
                <span className="text-xs font-bold text-on-surface">{stats?.totalSessions || 0}</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
        </div>
      </div>
    </>
  )
}
