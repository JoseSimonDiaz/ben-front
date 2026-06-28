function OptionList({ options, index }) {
  if (!options || index >= options.length) return null
  const option = options[index]
  return (
    <>
      <option value={option.value}>{option.label}</option>
      <OptionList options={options} index={index + 1} />
    </>
  )
}

export default function Input({ label, type = 'text', placeholder, required, field, options, className = '' }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-on-surface-variant">{label}</label>
      )}
      {type === 'select' ? (
        <select
          required={required}
          value={field.value}
          onChange={field.onChange}
          className={`w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors ${className}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          <OptionList options={options} index={0} />
        </select>
      ) : type === 'textarea' ? (
        <textarea
          required={required}
          value={field.value}
          onChange={field.onChange}
          placeholder={placeholder}
          rows={5}
          className={`w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors text-on-surface placeholder:text-on-surface-variant/50 resize-none ${className}`}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={field.value}
          onChange={field.onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors text-on-surface placeholder:text-on-surface-variant/50 ${className}`}
        />
      )}
    </div>
  )
}
