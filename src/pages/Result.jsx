import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RadarChart from '../components/RadarChart.jsx'
import Button from '../components/Button.jsx'
import { getCareerStats } from '../api/index.js'
import { useQuizResult } from '../context/QuizContext.jsx'
import { ROUTES } from '../constants/routes.js'
import { SKILL_LABELS } from '../constants/domain.js'

function buildDefaultProfile(skillLabels, index = 0, result = []) {
  if (!skillLabels || index >= skillLabels.length) return result
  result.push({ label: skillLabels[index].label, value: 0 })
  return buildDefaultProfile(skillLabels, index + 1, result)
}

let profileCache = null
function getDefaultProfile() {
  if (!profileCache) profileCache = buildDefaultProfile(SKILL_LABELS)
  return profileCache
}

export default function Result() {
  const { result } = useQuizResult()
  const [count, setCount] = useState(0)
  const [stats, setStats] = useState(null)

  const careerId = result?.careerId
  const careerName = result?.careerName || 'Carrera recomendada'
  const matchPercentage = result?.matchPercentage || 0
  const circumference = 552.92
  const offset = circumference - (count / 100) * circumference

  useEffect(() => {
    if (count < matchPercentage) {
      const timer = setTimeout(() => setCount(count + 1), 20)
      return () => clearTimeout(timer)
    }
  }, [count, matchPercentage])

  useEffect(() => {
    if (!careerId) return
    getCareerStats(careerId).then(setStats).catch(() => {})
  }, [careerId])

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-margin-mobile text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">quiz</span>
        <p className="text-on-surface-variant mb-lg">No hay resultados. Completá el test primero.</p>
        <Link to={ROUTES.QUIZ}><Button>Hacer el test</Button></Link>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-28 px-margin-mobile max-w-[1280px] mx-auto">
      <section className="mb-lg animate-fade-up">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant/50 p-sm md:p-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-lg">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                <circle cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8" className="text-surface-container-highest" />
                <circle cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-primary-container transition-all duration-100" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-xl text-headline-xl text-primary leading-none">{count}%</span>
                <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Match</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md text-label-md mb-xs border border-primary/20">
                RECOMENDACIÓN IDEAL
              </span>
              <h2 className="font-headline-lg text-headline-lg md:text-headline-xl mb-base">{careerName}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Basado en tus respuestas, esta carrera es la que mejor se alinea con tu perfil.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
        <div className="md:col-span-7 glass-panel rounded-2xl p-md flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-md">
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile">Mapa de Habilidades</h3>
            <span className="material-symbols-outlined text-primary">analytics</span>
          </div>
          <RadarChart data={getDefaultProfile()} max={10} size={280} />
        </div>
        <div className="md:col-span-5 glass-panel rounded-2xl p-md flex flex-col">
          <div className="flex items-center gap-xs mb-sm">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile">Insight de IA</h3>
          </div>
          <div className="flex-1 space-y-md">
            <div className="bg-surface-container-highest/40 p-sm rounded-lg border-l-4 border-secondary">
              <p className="font-body-sm text-body-sm italic">
                &ldquo;{careerName} se adapta muy bien a tu perfil. Te recomendamos hablar con la IA para profundizar en esta opción.&rdquo;
              </p>
            </div>
            {stats && !stats.insufficientData && (
              <div className="grid grid-cols-2 gap-sm">
                <div className="p-sm bg-surface-container rounded-lg border border-outline-variant/30">
                  <div className="font-label-md text-label-md text-secondary mb-1">EXPERIENCIAS</div>
                  <div className="font-body-sm text-body-sm font-bold">{stats.totalExperiences}</div>
                </div>
                <div className="p-sm bg-surface-container rounded-lg border border-outline-variant/30">
                  <div className="font-label-md text-label-md text-tertiary mb-1">DURACIÓN MEDIA</div>
                  <div className="font-body-sm text-body-sm font-bold">{stats.averageDropoutRate ? `${stats.averageDropoutRate}%` : '—'}</div>
                </div>
              </div>
            )}
          </div>
          <Link to={ROUTES.CHAT}>
            <Button className="mt-md w-full">
              <span className="material-symbols-outlined mr-2">smart_toy</span>
              Hablar con la IA
            </Button>
          </Link>
        </div>

        <div className="md:col-span-12 glass-panel rounded-2xl overflow-hidden group">
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface z-10 hidden md:block" />
              <div className="w-full h-full bg-surface-container-highest flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                <span className="material-symbols-outlined text-6xl text-primary">explore</span>
              </div>
            </div>
            <div className="md:w-2/3 p-md flex flex-col justify-center">
              <h4 className="font-headline-lg text-headline-lg mb-xs">Explorá más opciones</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                Conocé otras carreras y compará sus perfiles requeridos con el tuyo.
              </p>
              <div className="flex flex-wrap gap-sm">
                <Link to={ROUTES.EXPERIENCE}><Button variant="secondary">Compartir experiencia</Button></Link>
                <Link to={ROUTES.CAREERS}><Button variant="secondary">Ver más carreras</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
