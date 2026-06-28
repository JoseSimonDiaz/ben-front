import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import RadarChart from '../components/RadarChart.jsx'
import Button from '../components/Button.jsx'
import { getCareerStats } from '../api/index.js'
import useApi from '../hooks/useApi.js'
import { ROUTES, careerDetail } from '../constants/routes.js'
import { SKILL_LABELS } from '../constants/domain.js'

function buildDefaultSkills(skillLabels, index = 0, result = []) {
  if (!skillLabels || index >= skillLabels.length) return result
  result.push({ label: skillLabels[index].label, value: 5 })
  return buildDefaultSkills(skillLabels, index + 1, result)
}

const defaultSkills = buildDefaultSkills(SKILL_LABELS)

export default function CareerDetail() {
  const { id } = useParams()
  const { data: stats, loading } = useApi(() => getCareerStats(id), [id])

  return (
    <div className="mx-auto max-w-4xl px-margin-mobile pt-24 pb-28">
      <Link to={ROUTES.CAREERS} className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-lg">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Todas las carreras
      </Link>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex items-center gap-2 animate-pulse">
            <span className="text-on-surface-variant">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-lg mb-lg animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl text-primary">school</span>
            </div>
            <div>
              <h1 className="font-headline-lg text-headline-lg md:text-headline-xl mb-2">{stats?.careerName || 'Carrera'}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Estadísticas de egresados
                </span>
              </div>
            </div>
          </div>

          {stats?.statistics && !stats.statistics.insufficientData && (
            <div className="grid md:grid-cols-2 gap-lg glass-panel rounded-2xl p-lg mb-lg animate-scale-in">
              <div>
                <h3 className="font-label-md text-label-md text-primary font-bold mb-3 uppercase tracking-widest">Información</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-secondary mt-0.5 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span><strong>Total de experiencias:</strong> {stats.statistics.totalExperiences}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-secondary mt-0.5 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span><strong>Tasa de deserción percibida:</strong> {stats.statistics.averageDropoutRate}%</span>
                  </div>
                  {stats.statistics.topDifficultSubjects?.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-sm text-secondary mt-0.5 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span><strong>Materias difíciles:</strong> {stats.statistics.topDifficultSubjects.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-label-md text-label-md text-primary font-bold mb-md text-center uppercase tracking-widest">Habilidades</h3>
                <RadarChart data={defaultSkills} max={10} size={220} />
              </div>
            </div>
          )}

          {(!stats?.statistics || stats.statistics.insufficientData) && (
            <div className="glass-panel rounded-2xl p-lg mb-lg text-center animate-scale-in">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">info</span>
              <p className="text-on-surface-variant">Todavía no hay suficientes datos de egresados para esta carrera.</p>
            </div>
          )}

          <section className="glass-panel rounded-2xl p-lg text-center">
            <h3 className="font-headline-lg-mobile font-bold mb-2">¿Te interesa esta carrera?</h3>
            <p className="text-sm text-on-surface-variant mb-lg">Hacé el test vocacional para ver qué tan compatible es con tu perfil.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to={ROUTES.QUIZ}><Button>Hacer el test</Button></Link>
              <Link to={ROUTES.EXPERIENCE}><Button variant="secondary">Compartir mi experiencia</Button></Link>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
