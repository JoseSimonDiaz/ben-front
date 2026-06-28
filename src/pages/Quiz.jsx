import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import Button from '../components/Button.jsx'
import { getQuestions, submitQuiz } from '../api/index.js'
import { useQuizResult } from '../context/QuizContext.jsx'
import useApi from '../hooks/useApi.js'
import { ROUTES } from '../constants/routes.js'
import { DURATION } from '../constants/domain.js'

function OptionButtons({ options, index, selected, onSelect, disabled }) {
  if (!options || index >= options.length) return null
  const isSelected = selected === index
  const isOther = selected !== null && selected !== index

  return (
    <>
      <button
        onClick={() => onSelect(index)}
        disabled={disabled}
        className={`w-full text-left rounded-xl border px-5 py-4 text-sm font-medium transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'border-primary bg-primary/10 text-primary'
            : isOther
              ? 'border-transparent opacity-40'
              : 'border-outline-variant/30 bg-surface-container hover:border-primary/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
            {isSelected && (
              <span className="material-symbols-outlined text-sm text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            )}
          </div>
          {options[index].text || options[index]}
        </div>
      </button>
      <OptionButtons options={options} index={index + 1} selected={selected} onSelect={onSelect} disabled={disabled} />
    </>
  )
}

function DurationOptions({ selected, onSelect }) {
  const options = [
    { key: DURATION.SHORT, icon: 'timer', label: 'Carreras cortas' },
    { key: DURATION.LONG, icon: 'timelapse', label: 'Carreras largas' },
  ]

  function DurationItem({ items, itemIndex }) {
    if (itemIndex >= items.length) return null
    const durationOption = items[itemIndex]
    return (
      <>
        <button
          onClick={() => onSelect(durationOption.key)}
          className={`flex-1 rounded-xl border px-5 py-3 text-sm font-medium transition-all cursor-pointer ${
            selected === durationOption.key
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-outline-variant/30 bg-surface-container hover:border-primary/40'
          }`}
        >
          <span className="material-symbols-outlined text-lg align-middle mr-1">{durationOption.icon}</span>
          {durationOption.label}
        </button>
        <DurationItem items={items} itemIndex={itemIndex + 1} />
      </>
    )
  }

  return <DurationItem items={options} itemIndex={0} />
}

export default function Quiz() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [duration, setDuration] = useState(DURATION.SHORT)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { setResult } = useQuizResult()
  const { data: questions, loading } = useApi(() => getQuestions('student'), [])

  function handleSelect(optionIndex) {
    if (selected !== null || submitting) return
    setSelected(optionIndex)
    const updated = [...answers, { questionId: questions[current]._id, selectedOptionIndex: optionIndex }]
    setAnswers(updated)

    if (current < questions.length - 1) {
      setTimeout(() => {
        setCurrent(current + 1)
        setSelected(null)
      }, 300)
    } else {
      setSubmitting(true)
      submitQuiz(updated, duration).then((result) => {
        setResult(result)
        navigate(ROUTES.RESULT)
      }).catch(() => {
        setSubmitting(false)
        setSelected(null)
      })
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-margin-mobile pt-24 pb-28 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 animate-pulse">
          <span className="text-on-surface-variant">Cargando preguntas...</span>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-margin-mobile pt-24 pb-28 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">quiz</span>
        <p className="text-on-surface-variant">No hay preguntas disponibles. Configurá el test desde el panel admin.</p>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="mx-auto max-w-2xl px-margin-mobile pt-24 pb-28">
      <div className="mb-lg animate-fade-up" key={`progress-${current}`}>
        <ProgressBar current={current + 1} total={questions.length} />
      </div>

      {current === 0 && (
        <div className="glass-panel rounded-2xl p-lg mb-lg animate-fade-up">
          <label className="block text-sm font-medium mb-3 text-on-surface-variant">Preferencia de duración</label>
          <div className="flex gap-3">
            <DurationOptions selected={duration} onSelect={setDuration} />
          </div>
        </div>
      )}

      <div className="glass-panel rounded-2xl p-lg animate-scale-in" key={current}>
        <span className="font-label-md text-label-md text-on-surface-variant uppercase">
          Dimensión {current + 1} de {questions.length}
        </span>

        <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-lg mt-sm mb-lg leading-relaxed">
          {q.text}
        </h2>

        <div className="flex flex-col gap-3">
          <OptionButtons options={q.options} index={0} selected={selected} onSelect={handleSelect} disabled={selected !== null || submitting} />
        </div>
      </div>

      <div className="mt-lg flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => {
            if (current > 0) {
              setCurrent(current - 1)
              setSelected(null)
            }
          }}
          className={current === 0 ? 'invisible' : ''}
        >
          <span className="material-symbols-outlined mr-1">arrow_back</span>
          Anterior
        </Button>

        <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-primary" />
          {answers.length} de {questions.length} respondidas
        </div>
      </div>
    </div>
  )
}
