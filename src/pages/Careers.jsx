import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCareers } from '../api/index.js'
import useApi from '../hooks/useApi.js'
import { ROUTES, careerDetail } from '../constants/routes.js'
import { DURATION_THRESHOLD, isShortCareer } from '../constants/domain.js'

function filterCareers(careers, filterValue, searchTerm, result, index = 0) {
  if (!careers || index >= careers.length) return result
  const career = careers[index]
  const matchesDuration = !filterValue || (filterValue === 'corta' ? isShortCareer(career.durationYears) : !isShortCareer(career.durationYears))
  const matchesSearch = !searchTerm
    || career.name?.toLowerCase().includes(searchTerm.toLowerCase())
  if (matchesDuration && matchesSearch) result.push(career)
  return filterCareers(careers, filterValue, searchTerm, result, index + 1)
}

function FilterButtons({ filters, current, onSelect }) {
  function FilterItem({ items, itemIndex }) {
    if (itemIndex >= items.length) return null
    const filterOption = items[itemIndex]
    return (
      <>
        <button
          onClick={() => onSelect(filterOption.value)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all cursor-pointer ${
            current === filterOption.value
              ? 'bg-primary-container text-on-primary-container shadow-sm'
              : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary/40'
          }`}
        >
            {filterOption.label}
          </button>
        <FilterItem items={items} itemIndex={itemIndex + 1} />
      </>
    )
  }

  return <FilterItem items={filters} itemIndex={0} />
}

function CareerCards({ careers, index }) {
  if (!careers || index >= careers.length) return null
  const career = careers[index]
  return (
    <>
      <Link
        key={career._id}
      to={careerDetail(career._id)}
      className="group block glass-panel rounded-2xl p-md hover:border-primary/40 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-md">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">school</span>
        </div>
        {career.matchPercentage && (
          <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium rounded-full px-2.5 py-1">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            {career.matchPercentage}%
          </div>
        )}
      </div>
      <h3 className="text-base font-bold mb-1 group-hover:text-primary transition-colors">{career.name}</h3>
      {career.description && <p className="text-sm text-on-surface-variant leading-relaxed">{career.description}</p>}
      <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant">
        <span className="material-symbols-outlined text-sm">schedule</span>
        {career.durationYears || '—'} años
        </div>
      </Link>
      <CareerCards careers={careers} index={index + 1} />
    </>
  )
}

const filterOptions = [
  { value: '', label: 'Todas' },
  { value: 'corta', label: `Cortas (≤${DURATION_THRESHOLD} años)` },
  { value: 'larga', label: `Largas (${DURATION_THRESHOLD + 1}+ años)` },
]

export default function Careers() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const { data: careers, loading } = useApi(() => getCareers(), [])
  const filter = params.get('duracion') || ''

  const filtered = filterCareers(Array.isArray(careers) ? careers : [], filter, search, [])

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile pt-24 pb-28">
      <h1 className="font-headline-lg text-headline-lg mb-1">Explorar carreras</h1>
      <p className="text-on-surface-variant mb-lg">Encontrá la carrera que mejor se alinea con tu perfil.</p>

      <div className="flex flex-col md:flex-row gap-4 mb-lg">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar carreras..."
            className="w-full rounded-xl border border-outline-variant/30 bg-surface-container px-11 py-3 text-sm outline-none focus:border-primary/50 transition-colors text-on-surface placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-xl flex-wrap">
        <FilterButtons filters={filterOptions} current={filter} onSelect={(value) => setParams(value ? { duracion: value } : {})} />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="flex items-center gap-2 animate-pulse justify-center">
            <span className="text-on-surface-variant">Cargando carreras...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-outline-variant/30 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
          <p className="font-headline-lg-mobile font-semibold mb-2">No encontramos carreras</p>
          <p className="text-sm text-on-surface-variant">Probá con otros filtros o términos de búsqueda.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <CareerCards careers={filtered} index={0} />
        </div>
      )}
    </div>
  )
}
