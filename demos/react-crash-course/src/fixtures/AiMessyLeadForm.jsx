/**
 * EXERCISE 10 — messy "AI-generated" component. Do NOT copy patterns.
 * Find: missing keys, mutating props, setState in render, unsafe HTML, etc.
 * Rewrite cleanly as CleanLeadForm.jsx and test it.
 */
export function AiMessyLeadForm({ onSubmit }) {
  let name = ''
  // anti-pattern: local let instead of useState

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // mutates and uses DOM directly
        const amount = document.getElementById('amt').value
        onSubmit({ name, loan_amount: amount })
      }}
    >
      <h3>AI form (broken)</h3>
      {[1, 2, 3].map((n) => (
        <div>Lead tip {n}</div>
      ))}
      <input
        onChange={(e) => {
          name = e.target.value
        }}
        placeholder="Name"
      />
      <input id="amt" placeholder="Amount" />
      <div dangerouslySetInnerHTML={{ __html: '<img src=x onerror=alert(1) />' }} />
      <button type="submit">Send</button>
    </form>
  )
}
