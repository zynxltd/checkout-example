<script setup>
const step = ref(0)
const answers = ref([])
const results = ref(null)
const cart = useState('cart', () => [])

const questions = [
  {
    id: 'light',
    prompt: 'How much sun does the spot get?',
    options: [
      { id: 'full', label: 'Full sun' },
      { id: 'part', label: 'Part shade' },
      { id: 'shade', label: 'Mostly shade' },
    ],
  },
  {
    id: 'goal',
    prompt: 'What do you want most?',
    options: [
      { id: 'fruit', label: 'Edible harvest' },
      { id: 'colour', label: 'Colour / flowers' },
      { id: 'wildlife', label: 'Wildlife friendly' },
    ],
  },
  {
    id: 'effort',
    prompt: 'How much care are you happy with?',
    options: [
      { id: 'low', label: 'Low maintenance' },
      { id: 'med', label: 'Happy to tend weekly' },
      { id: 'high', label: 'Enthusiast' },
    ],
  },
  {
    id: 'space',
    prompt: 'Where will it live?',
    options: [
      { id: 'pot', label: 'Pot / balcony' },
      { id: 'bed', label: 'Garden bed' },
      { id: 'both', label: 'Either' },
    ],
  },
]

async function choose(optionId) {
  answers.value[step.value] = optionId
  if (step.value < questions.length - 1) {
    step.value += 1
    return
  }
  results.value = await $fetch('/api/quiz/score', {
    method: 'POST',
    body: { answers: answers.value },
  })
}

function addToCart(product) {
  const existing = cart.value.find((l) => l.id === product.id)
  if (existing) existing.qty += 1
  else cart.value.push({ ...product, qty: 1 })
}

function reset() {
  step.value = 0
  answers.value = []
  results.value = null
}

const cartCount = computed(() => cart.value.reduce((n, l) => n + l.qty, 0))
const cartTotal = computed(() =>
  cart.value.reduce((n, l) => n + l.price * l.qty, 0),
)
</script>

<template>
  <div>
    <main>
      <p class="pill">Node.js + Nuxt · P0</p>
      <h1>Product quiz → cart</h1>
      <p class="muted">Answer four questions. Nitro scores matches. Add the top pick to cart.</p>

      <section v-if="!results" class="card">
        <p class="muted">Step {{ step + 1 }} / {{ questions.length }}</p>
        <h2>{{ questions[step].prompt }}</h2>
        <button
          v-for="opt in questions[step].options"
          :key="opt.id"
          class="option"
          type="button"
          @click="choose(opt.id)"
        >
          {{ opt.label }}
        </button>
      </section>

      <section v-else class="card">
        <h2>Your matches</h2>
        <div v-for="item in results.matches" :key="item.id" class="result">
          <div>
            <strong>{{ item.name }}</strong>
            <div class="muted">£{{ item.price.toFixed(2) }} · {{ item.reason }}</div>
          </div>
          <button class="primary" type="button" @click="addToCart(item)">Add</button>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
          <button class="ghost" type="button" @click="reset">Retake quiz</button>
          <NuxtLink v-if="results.shareId" class="muted" :to="`/?share=${results.shareId}`">
            Shareable result id: {{ results.shareId }}
          </NuxtLink>
        </div>
      </section>
    </main>

    <div class="cart-bar">
      <span>Cart · {{ cartCount }} items</span>
      <strong>£{{ cartTotal.toFixed(2) }}</strong>
    </div>
  </div>
</template>
