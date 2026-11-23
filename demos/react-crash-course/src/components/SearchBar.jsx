/**
 * EXERCISE 3 — controlled search input (Vue v-model ≈ value + onChange).
 */
export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <label className="search">
      <span className="sr-only">Search</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        // TODO EXERCISE 3 (optional): clear button when value length > 0
      />
    </label>
  )
}
