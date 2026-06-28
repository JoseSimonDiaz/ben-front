import { useState, useCallback } from 'react'

export default function useForm(initialValues, { transform, onSubmit } = {}) {
  const [values, setValues] = useState(initialValues)
  const [submitting, setSubmitting] = useState(false)

  const field = useCallback((fieldName) => ({
    value: values[fieldName],
    onChange(e) {
      setValues((previous) => ({ ...previous, [fieldName]: e.target.value }))
    },
  }), [values])

  const setField = useCallback((fieldName, fieldValue) => {
    setValues((previous) => ({ ...previous, [fieldName]: fieldValue }))
  }, [])

  const reset = useCallback(() => setValues(initialValues), [])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    if (!onSubmit) return
    setSubmitting(true)
    try {
      const payload = transform ? transform(values) : values
      await onSubmit(payload)
    } finally {
      setSubmitting(false)
    }
  }, [values, transform, onSubmit])

  return { values, field, setField, reset, handleSubmit, submitting }
}
