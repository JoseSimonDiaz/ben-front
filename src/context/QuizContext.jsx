import { createContext, useContext, useState, useMemo } from 'react'

const QuizContext = createContext(null)

export function QuizProvider({ children }) {
  const [result, setResultState] = useState(() => {
    try {
      const saved = localStorage.getItem('quizResult')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const value = useMemo(() => ({
    result,
    setResult(r) {
      setResultState(r)
      try {
        if (r) {
          localStorage.setItem('quizResult', JSON.stringify(r))
        } else {
          localStorage.removeItem('quizResult')
        }
      } catch {}
    },
    clearResult() {
      setResultState(null)
      try { localStorage.removeItem('quizResult') } catch {}
    },
  }), [result])

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuizResult() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuizResult must be used within QuizProvider')
  return ctx
}
