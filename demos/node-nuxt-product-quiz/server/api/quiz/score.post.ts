const CATALOG = [
  {
    id: 'strawberry',
    name: 'Strawberry Collection',
    price: 14.99,
    tags: { light: ['full', 'part'], goal: ['fruit'], effort: ['med', 'high'], space: ['pot', 'bed', 'both'] },
  },
  {
    id: 'rose',
    name: 'Patio Rose',
    price: 18.5,
    tags: { light: ['full'], goal: ['colour'], effort: ['med', 'high'], space: ['pot', 'bed', 'both'] },
  },
  {
    id: 'fern',
    name: 'Shade Fern Mix',
    price: 12.0,
    tags: { light: ['shade', 'part'], goal: ['wildlife', 'colour'], effort: ['low', 'med'], space: ['bed', 'both'] },
  },
  {
    id: 'feeder',
    name: 'Wildlife Feeder Kit',
    price: 9.99,
    tags: { light: ['full', 'part', 'shade'], goal: ['wildlife'], effort: ['low'], space: ['pot', 'bed', 'both'] },
  },
  {
    id: 'herb',
    name: 'Balcony Herb Trio',
    price: 11.5,
    tags: { light: ['full', 'part'], goal: ['fruit'], effort: ['low', 'med'], space: ['pot', 'both'] },
  },
]

const KEYS = ['light', 'goal', 'effort', 'space']

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const answers = body?.answers ?? []

  const scored = CATALOG.map((product) => {
    let score = 0
    const reasons = []
    KEYS.forEach((key, i) => {
      const answer = answers[i]
      if (answer && product.tags[key].includes(answer)) {
        score += 1
        reasons.push(key)
      }
    })
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      score,
      reason: reasons.length
        ? `Matches ${reasons.join(', ')}`
        : 'Closest available pick',
    }
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const shareId = Buffer.from(JSON.stringify(answers)).toString('base64url')

  return { matches: scored, shareId }
})
