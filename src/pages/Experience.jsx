import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Input from '../components/ui/Input.jsx'
import { getCareers, submitExperience } from '../api/index.js'
import useApi from '../hooks/useApi.js'
import useForm from '../hooks/useForm.js'
import { ROUTES } from '../constants/routes.js'

function buildCareerOptions(careers, index = 0, result = []) {
  if (!careers || index >= careers.length) return result
  result.push({ value: careers[index]._id, label: careers[index].name })
  return buildCareerOptions(careers, index + 1, result)
}

function splitAndClean(inputString, index = 0, result = []) {
  if (!inputString) return result
  const parts = inputString.split(',')
  if (index >= parts.length) return result
  const trimmed = parts[index].trim()
  if (trimmed) result.push(trimmed)
  return splitAndClean(inputString, index + 1, result)
}

function StarRating({ value, onChange }) {
  function StarButton({ current, starIndex }) {
    if (starIndex > 5) return null
    const filled = starIndex <= value
    return (
      <>
        <button
          type="button"
          onClick={() => onChange(starIndex)}
          className={`text-2xl transition-all active:scale-90 cursor-pointer ${filled ? 'text-amber-400' : 'text-outline-variant'}`}
        >
          {filled ? '★' : '☆'}
        </button>
        <StarButton current={current} starIndex={starIndex + 1} />
      </>
    )
  }
  return (
    <div className="flex gap-1">
      <StarButton starIndex={1} />
    </div>
  )
}

function RadioGroup({ name, options, value, onChange }) {
  function OptionItem({ items, itemIndex }) {
    if (!items || itemIndex >= items.length) return null
    const opt = items[itemIndex]
    const selected = value === opt.value
    return (
      <>
        <button
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
            selected
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-outline-variant/30 bg-surface-container hover:border-primary/40'
          }`}
        >
          {opt.label}
        </button>
        <OptionItem items={items} itemIndex={itemIndex + 1} />
      </>
    )
  }
  return (
    <div className="flex gap-3">
      <OptionItem items={options} itemIndex={0} />
    </div>
  )
}

function CheckboxGroup({ options, selected, onChange, max }) {
  function OptionItem({ items, itemIndex }) {
    if (!items || itemIndex >= items.length) return null
    const opt = items[itemIndex]
    const checked = selected.includes(opt.value)
    const atLimit = !checked && selected.length >= max
    return (
      <>
        <button
          type="button"
          onClick={() => {
            if (checked) {
              onChange(selected.filter((v) => v !== opt.value))
            } else if (!atLimit) {
              onChange([...selected, opt.value])
            }
          }}
          className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
            checked
              ? 'border-primary bg-primary/10 text-primary'
              : atLimit
                ? 'border-outline-variant/30 opacity-40 cursor-not-allowed'
                : 'border-outline-variant/30 bg-surface-container hover:border-primary/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
              {checked && (
                <span className="material-symbols-outlined text-xs text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              )}
            </div>
            {opt.label}
          </div>
        </button>
        <OptionItem items={items} itemIndex={itemIndex + 1} />
      </>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <OptionItem items={options} itemIndex={0} />
    </div>
  )
}

const skillsOptions = [
  { value: 'Lógica y razonamiento', label: 'Lógica y razonamiento' },
  { value: 'Creatividad e innovación', label: 'Creatividad e innovación' },
  { value: 'Comunicación oral y escrita', label: 'Comunicación oral y escrita' },
  { value: 'Trabajo en equipo', label: 'Trabajo en equipo' },
  { value: 'Pensamiento crítico', label: 'Pensamiento crítico' },
  { value: 'Habilidades técnicas/prácticas', label: 'Habilidades técnicas/prácticas' },
  { value: 'Organización y planificación', label: 'Organización y planificación' },
  { value: 'Resolución de problemas', label: 'Resolución de problemas' },
  { value: 'Liderazgo', label: 'Liderazgo' },
  { value: 'Análisis de datos', label: 'Análisis de datos' },
  { value: 'Atención al detalle', label: 'Atención al detalle' },
  { value: 'Habilidades manuales', label: 'Habilidades manuales' },
]

export default function Experience() {
  const [step, setStep] = useState(1)
  const [sent, setSent] = useState(false)
  const [skills, setSkills] = useState([])
  const [hardestSubjects, setHardestSubjects] = useState(['', '', ''])
  const [bestAspects, setBestAspects] = useState(['', '', ''])
  const [worstAspects, setWorstAspects] = useState(['', '', ''])
  const { data: careers } = useApi(() => getCareers(), [])

  const { field, handleSubmit, submitting } = useForm(
    {
      careerId: '',
      collaboratorName: '',
      collaboratorEmail: '',
      university: '',
      graduated: '',
      recommendationRating: 0,
      difficultyRating: 5,
      jobMarketRating: 3,
      foundRelatedJob: '',
      reviewText: '',
    },
    {
      transform(formValues) {
        return {
          careerId: formValues.careerId,
          collaboratorName: formValues.collaboratorName,
          collaboratorEmail: formValues.collaboratorEmail,
          university: formValues.university,
          graduated: formValues.graduated || undefined,
          recommendationRating: formValues.recommendationRating || undefined,
          difficultyRating: formValues.difficultyRating,
          jobMarketRating: formValues.jobMarketRating,
          foundRelatedJob: formValues.foundRelatedJob || undefined,
          reviewText: formValues.reviewText,
          importantSkills: skills,
          hardestSubjects: hardestSubjects.filter((s) => s.trim()),
          bestAspects: bestAspects.filter((s) => s.trim()),
          worstAspects: worstAspects.filter((s) => s.trim()),
        }
      },
      onSubmit(payload) {
        return submitExperience(payload).then(() => setSent(true))
      },
    }
  )

  if (sent) {
    return (
      <div className="mx-auto max-w-lg px-margin-mobile pt-24 pb-28 text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-lg animate-scale-in">
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg mb-2">¡Gracias por compartir!</h2>
        <p className="text-on-surface-variant mb-2">Tu experiencia ayuda a futuros estudiantes a decidir mejor su carrera.</p>
        <p className="text-sm text-on-surface-variant mb-lg">Los testimonios serán revisados y publicados pronto.</p>
        <Link to={ROUTES.HOME}><Button>Volver al inicio</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-margin-mobile pt-24 pb-28">
      <div className="text-center mb-xl animate-fade-up">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">forum</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg mb-2">Compartí tu experiencia</h1>
        <p className="text-on-surface-variant">Ayudá a quienes están por elegir su carrera con tu testimonio real.</p>
      </div>

      <div className="flex justify-center gap-2 mb-xl">
        <div className={`w-20 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-outline-variant'}`} />
        <div className={`w-20 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-outline-variant'}`} />
        <div className={`w-20 h-1.5 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-outline-variant'}`} />
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-5 animate-fade-up">
            <div className="glass-panel rounded-2xl p-lg">
              <h2 className="font-headline-lg-mobile font-bold mb-lg">Datos del egresado</h2>

              <div className="space-y-5">
                <Input
                  label="¿Qué carrera estudiaste?"
                  type="select"
                  required
                  field={field('careerId')}
                  options={buildCareerOptions(Array.isArray(careers) ? careers : [])}
                  placeholder="Seleccionar..."
                />

                <Input
                  label="¿En qué universidad?"
                  field={field('university')}
                  placeholder="Ej: Universidad de Buenos Aires"
                />

                <div>
                  <label className="block text-sm font-medium mb-3 text-on-surface-variant">¿Terminaste la carrera?</label>
                  <RadioGroup
                    name="graduated"
                    options={[
                      { value: 'yes', label: 'Sí' },
                      { value: 'no', label: 'No' },
                      { value: 'in_progress', label: 'En curso' },
                    ]}
                    value={field('graduated').value}
                    onChange={(v) => field('graduated').onChange({ target: { value: v } })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={() => setStep(2)}>
                Siguiente
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-up">
            <div className="glass-panel rounded-2xl p-lg">
              <h2 className="font-headline-lg-mobile font-bold mb-lg">Tu experiencia en la carrera</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-on-surface-variant">¿Volverías a elegirla?</label>
                <StarRating
                  value={field('recommendationRating').value}
                  onChange={(v) => field('recommendationRating').onChange({ target: { value: v } })}
                />
                <p className="text-xs text-on-surface-variant mt-1">1 = No la recomiendo · 5 = La elegiría de nuevo sin dudas</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-on-surface-variant">¿Qué tan difícil fue?</label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-on-surface-variant w-16">Muy fácil</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={field('difficultyRating').value}
                    onChange={(e) => field('difficultyRating').onChange({ target: { value: e.target.value } })}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-xs text-on-surface-variant w-16 text-right">Muy difícil</span>
                </div>
                <p className="text-center text-sm font-bold text-primary mt-1">{field('difficultyRating').value}/10</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-on-surface-variant">¿Qué habilidades usabas más? (elegir hasta 5)</label>
                <CheckboxGroup
                  options={skillsOptions}
                  selected={skills}
                  onChange={setSkills}
                  max={5}
                />
                <p className="text-xs text-on-surface-variant mt-1">{skills.length}/5 seleccionadas</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-on-surface-variant">¿Qué materias predominaban? (hasta 3)</label>
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <input
                      key={i}
                      type="text"
                      value={hardestSubjects[i] || ''}
                      onChange={(e) => {
                        const updated = [...hardestSubjects]
                        updated[i] = e.target.value
                        setHardestSubjects(updated)
                      }}
                      placeholder={`Materia ${i + 1}`}
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-on-surface-variant">¿Cómo es la salida laboral?</label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-on-surface-variant w-20">Muy baja</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={field('jobMarketRating').value}
                    onChange={(e) => field('jobMarketRating').onChange({ target: { value: e.target.value } })}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-xs text-on-surface-variant w-20 text-right">Muy buena</span>
                </div>
                <p className="text-center text-sm font-bold text-primary mt-1">{field('jobMarketRating').value}/5</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-on-surface-variant">¿Conseguiste trabajo relacionado?</label>
                <RadioGroup
                  name="foundRelatedJob"
                  options={[
                    { value: 'yes', label: 'Sí' },
                    { value: 'no', label: 'No' },
                    { value: 'partial', label: 'Parcialmente' },
                  ]}
                  value={field('foundRelatedJob').value}
                  onChange={(v) => field('foundRelatedJob').onChange({ target: { value: v } })}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} disabled={submitting}>
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Anterior
              </Button>
              <Button type="button" onClick={() => setStep(3)}>
                Siguiente
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-up">
            <div className="glass-panel rounded-2xl p-lg">
              <h2 className="font-headline-lg-mobile font-bold mb-lg">Balance general</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-on-surface-variant">¿Qué es lo mejor de la carrera? (hasta 3)</label>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="mb-2">
                    <input
                      type="text"
                      value={bestAspects[i] || ''}
                      onChange={(e) => {
                        const updated = [...bestAspects]
                        updated[i] = e.target.value
                        setBestAspects(updated)
                      }}
                      placeholder={i === 0 ? 'Ej: Salida laboral' : `Aspecto positivo ${i + 1}`}
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-on-surface-variant">¿Qué es lo peor? (hasta 3)</label>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="mb-2">
                    <input
                      type="text"
                      value={worstAspects[i] || ''}
                      onChange={(e) => {
                        const updated = [...worstAspects]
                        updated[i] = e.target.value
                        setWorstAspects(updated)
                      }}
                      placeholder={i === 0 ? 'Ej: Mucha carga teórica' : `Aspecto negativo ${i + 1}`}
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <Input
                  label="Consejos para futuros estudiantes (opcional)"
                  type="textarea"
                  field={field('reviewText')}
                  placeholder="¿Qué te hubiera gustado saber antes de empezar la carrera?"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setStep(2)} disabled={submitting}>
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Anterior
              </Button>
              <Button type="submit" disabled={submitting}>
                <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                {submitting ? 'Enviando...' : 'Enviar experiencia'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
