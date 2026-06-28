import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { ROUTES } from '../constants/routes.js'

const steps = [
  {
    number: '1',
    title: 'Quiz Vocacional',
    desc: 'Respondé preguntas diseñadas por expertos para identificar tus fortalezas, intereses y valores fundamentales.',
    icon: 'quiz',
    color: 'text-primary',
  },
  {
    number: '2',
    title: 'Chat con Ben',
    desc: 'Profundizá en tus resultados con nuestro asistente IA. Consultá sobre salarios, demanda laboral y formación necesaria.',
    icon: 'forum',
    color: 'text-secondary',
  },
  {
    number: '3',
    title: 'Explorá tu Camino',
    desc: 'Accedé a una hoja de ruta detallada con cursos, universidades y empresas líderes que buscan perfiles como el tuyo.',
    icon: 'map',
    color: 'text-tertiary',
  },
]

function StepCards({ steps, stepIndex }) {
  if (!steps || stepIndex >= steps.length) return null
  const stepData = steps[stepIndex]
  return (
    <>
      <div key={stepData.number} className="group relative p-8 rounded-3xl bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-all duration-300">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-container text-on-primary-container flex items-center justify-center rounded-xl font-bold shadow-lg">
          {stepData.number}
        </div>
        <div className="mb-lg">
          <span className={`material-symbols-outlined text-5xl ${stepData.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{stepData.icon}</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-sm">{stepData.title}</h3>
        <p className="text-on-surface-variant leading-relaxed">{stepData.desc}</p>
      </div>
      <StepCards steps={steps} stepIndex={stepIndex + 1} />
    </>
  )
}

export default function Landing() {
  return (
    <>
      <section className="relative min-h-[751px] flex flex-col justify-center items-center px-margin-mobile md:px-margin-desktop hero-gradient overflow-hidden pt-16">
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-primary/20 text-primary-container font-label-md text-label-md animate-pulse">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Potenciado por Inteligencia Artificial</span>
          </div>
          <h1 className="font-headline-xl text-4xl md:text-headline-xl leading-tight text-on-background">
            Descubrí qué carrera <br className="hidden md:block" /> se adapta a vos
          </h1>
          <p className="text-on-surface-variant font-body-md text-lg max-w-2xl mx-auto leading-relaxed">
            Nuestra plataforma utiliza análisis de datos avanzado y psicometría moderna para trazar tu hoja de ruta profesional perfecta.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-md pt-md">
            <Link to={ROUTES.QUIZ}>
              <Button>
                Comenzar test vocacional
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </Button>
            </Link>
            <Link to={ROUTES.CHAT}>
              <Button variant="secondary">
                <span className="material-symbols-outlined mr-2">smart_toy</span>
                Chatear con el asistente IA
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-xl w-full max-w-5xl mx-auto grid grid-cols-4 md:grid-cols-12 gap-md relative z-10">
          <div className="col-span-4 md:col-span-6 glass-panel rounded-2xl p-sm overflow-hidden h-48 md:h-64 group">
            <div className="w-full h-full rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:scale-105 transition-transform duration-500">
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-5xl text-primary">dashboard</span>
                <span className="font-label-md text-label-md">Career Analytics Dashboard</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-3 glass-panel rounded-2xl p-sm flex flex-col justify-between h-48 md:h-64">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-secondary-container/20 rounded-lg">
                <span className="material-symbols-outlined text-secondary">trending_up</span>
              </div>
              <span className="text-secondary font-label-md">+24%</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-label-md">Oportunidad</p>
              <h3 className="text-headline-lg-mobile font-bold">Tech Lead</h3>
            </div>
          </div>
          <div className="col-span-2 md:col-span-3 glass-panel rounded-2xl p-sm flex flex-col justify-center items-center text-center h-48 md:h-64">
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center relative mb-xs">
              <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
              <div className="absolute inset-0 border-2 border-primary rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-on-surface font-bold">98% Match</p>
            <p className="text-on-surface-variant text-xs">Perfil Analítico</p>
          </div>
        </div>
      </section>

      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
        <div className="text-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-xs">Cómo funciona</h2>
          <div className="w-24 h-1 bg-primary-container mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <StepCards steps={steps} stepIndex={0} />
        </div>
      </section>

      <section className="py-xl px-margin-mobile md:px-margin-desktop">
        <div className="glass-panel max-w-5xl mx-auto rounded-[2.5rem] p-lg flex flex-wrap justify-around items-center gap-lg text-center">
          <div className="space-y-xs">
            <div className="text-4xl font-extrabold text-primary">+50k</div>
            <div className="text-on-surface-variant font-label-md text-sm uppercase tracking-widest">Estudiantes</div>
          </div>
          <div className="h-12 w-[1px] bg-outline-variant/50 hidden md:block" />
          <div className="space-y-xs">
            <div className="text-4xl font-extrabold text-secondary">200+</div>
            <div className="text-on-surface-variant font-label-md text-sm uppercase tracking-widest">Carreras</div>
          </div>
          <div className="h-12 w-[1px] bg-outline-variant/50 hidden md:block" />
          <div className="space-y-xs">
            <div className="text-4xl font-extrabold text-tertiary">15ms</div>
            <div className="text-on-surface-variant font-label-md text-sm uppercase tracking-widest">Respuesta IA</div>
          </div>
        </div>
      </section>

      <section className="py-xl px-margin-mobile md:px-margin-desktop text-center">
        <div className="max-w-3xl mx-auto space-y-md">
          <h2 className="font-headline-lg text-headline-lg">¿Listo para tomar el control?</h2>
          <p className="text-on-surface-variant">Unite a miles de profesionales que ya encontraron su verdadera vocación.</p>
          <div className="pt-sm">
            <Link to={ROUTES.QUIZ}>
              <Button>
                Empieza Gratis Ahora
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
