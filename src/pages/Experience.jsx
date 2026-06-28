import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Input from '../components/ui/Input.jsx'
import { getCareers, submitExperience } from '../api/index.js'
import useApi from '../hooks/useApi.js'
import useForm from '../hooks/useForm.js'
import { ROUTES } from '../constants/routes.js'

function splitAndClean(inputString, index = 0, result = []) {
  if (!inputString) return result
  const parts = inputString.split(',')
  if (index >= parts.length) return result
  const trimmed = parts[index].trim()
  if (trimmed) result.push(trimmed)
  return splitAndClean(inputString, index + 1, result)
}

function buildCareerOptions(careers, index = 0, result = []) {
  if (!careers || index >= careers.length) return result
  result.push({ value: careers[index]._id, label: careers[index].name })
  return buildCareerOptions(careers, index + 1, result)
}

export default function Experience() {
  const [step, setStep] = useState(1)
  const [slider, setSlider] = useState(50)
  const [sent, setSent] = useState(false)
  const { data: careers } = useApi(() => getCareers(), [])

  const { field, handleSubmit, submitting } = useForm(
    {
      careerId: '',
      collaboratorName: '',
      collaboratorEmail: '',
      graduationYear: '',
      actualCompletionTime: '',
      hardestSubjects: '',
      jobProspects: '',
      reviewText: '',
    },
    {
      transform(formValues) {
        return {
          careerId: formValues.careerId,
          collaboratorName: formValues.collaboratorName,
          collaboratorEmail: formValues.collaboratorEmail,
          graduationYear: Number(formValues.graduationYear),
          actualCompletionTime: formValues.actualCompletionTime,
          perceivedDropoutRate: slider,
          hardestSubjects: splitAndClean(v.hardestSubjects),
          jobProspects: splitAndClean(v.jobProspects),
          reviewText: v.reviewText,
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
        <div className={`w-24 h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-outline-variant'}`} />
        <div className={`w-24 h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-outline-variant'}`} />
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-5 animate-fade-up">
            <div className="glass-panel rounded-2xl p-lg">
              <h2 className="font-headline-lg-mobile font-bold mb-lg">Información personal</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Input label="Nombre completo" required field={field('collaboratorName')} />
                <Input label="Email" type="email" required field={field('collaboratorEmail')} />
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-lg">
              <h2 className="font-headline-lg-mobile font-bold mb-lg">Información académica</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="Carrera cursada"
                  type="select"
                  required
                  field={field('careerId')}
                  options={buildCareerOptions(Array.isArray(careers) ? careers : [])}
                  placeholder="Seleccionar..."
                />
                <Input label="Año de graduación" type="number" field={field('graduationYear')} placeholder="Ej: 2022" />
              </div>
              <div className="mt-5">
                <Input label="Duración real de la cursada" field={field('actualCompletionTime')} placeholder="Ej: 6 años" />
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
              <h2 className="font-headline-lg-mobile font-bold mb-lg">Tu experiencia</h2>

              <div className="mb-lg">
                <label className="block text-sm font-medium mb-3 text-on-surface-variant">Porcentaje de deserción percibido</label>
                <div className="flex items-center gap-4">
                  <input type="range" min="0" max="100" value={slider} onChange={(e) => setSlider(e.target.value)} className="flex-1 accent-primary" />
                  <span className="text-sm font-bold text-primary w-12 text-right">{slider}%</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                  <span>0% (nadie abandona)</span>
                  <span>100% (todos abandonan)</span>
                </div>
              </div>

              <div className="mb-5">
                <Input label="Materias más difíciles (separadas por coma)" field={field('hardestSubjects')} placeholder="Ej: Álgebra, Estructura de Datos, Física" />
              </div>

              <div className="mb-5">
                <Input label="Salidas laborales (separadas por coma)" field={field('jobProspects')} placeholder="Ej: Desarrollador full-stack, Consultor IT" />
              </div>

              <div>
                <Input label="Reseña / Consejos para futuros estudiantes" type="textarea" field={field('reviewText')} placeholder="Compartí tu experiencia, qué te hubiera gustado saber antes de empezar..." />
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
