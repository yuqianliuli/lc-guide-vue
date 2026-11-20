<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: { type: Array, required: true }
})

const W = 500
const H = 172
const P = { t: 16, r: 18, b: 28, l: 40 }
const pw = W - P.l - P.r
const ph = H - P.t - P.b

const sorted = computed(() =>
  [...props.steps]
    .map((s) => ({ t: Number(s.t) || 0, b: Math.max(0, Math.min(100, Number(s.b) || 0)) }))
    .sort((a, b) => a.t - b.t)
)

const maxT = computed(() => Math.max(1, sorted.value[sorted.value.length - 1]?.t || 8))

function sx(t) {
  return P.l + (t / maxT.value) * pw
}

function sy(b) {
  return P.t + ph - (b / 100) * ph
}

const linePath = computed(() =>
  sorted.value.map((s, i) => `${i === 0 ? 'M' : 'L'}${sx(s.t).toFixed(1)},${sy(s.b).toFixed(1)}`).join(' ')
)

const areaPath = computed(() => {
  if (!sorted.value.length) return ''
  const first = sorted.value[0]
  const last = sorted.value[sorted.value.length - 1]
  return `${linePath.value} L${sx(last.t).toFixed(1)},${sy(0).toFixed(1)} L${sx(first.t).toFixed(1)},${sy(0).toFixed(1)} Z`
})

const dots = computed(() =>
  sorted.value.map((s, i) => ({
    key: `${i}-${s.t}-${s.b}`,
    cx: sx(s.t).toFixed(1),
    cy: sy(s.b).toFixed(1)
  }))
)
</script>

<template>
  <div class="chart-box">
    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px">
      <span style="font-weight: 600; color: var(--cds-text-secondary)">流动相梯度曲线 (%B 有机相比例)</span>
      <span class="mono hint">总时长 {{ maxT.toFixed(1) }} min</span>
    </div>

    <svg :viewBox="`0 0 ${W} ${H}`" class="chart-svg">
      <g v-for="p in [0, 50, 100]" :key="p">
        <line
          :x1="P.l"
          :x2="W - P.r"
          :y1="sy(p)"
          :y2="sy(p)"
          stroke="var(--cds-border-subtle)"
          stroke-dasharray="2 3"
        />
        <text :x="P.l - 6" :y="sy(p) + 3.5" text-anchor="end" fill="var(--cds-text-muted)" font-size="10" class="mono">
          {{ p }}%
        </text>
      </g>

      <line :x1="P.l" :y1="P.t" :x2="P.l" :y2="H - P.b" stroke="var(--cds-border-strong)" />
      <line :x1="P.l" :y1="H - P.b" :x2="W - P.r" :y2="H - P.b" stroke="var(--cds-border-strong)" />

      <text :x="P.l" :y="H - 7" fill="var(--cds-text-muted)" font-size="10" class="mono">0.0 min</text>
      <text :x="P.l + pw / 2" :y="H - 7" text-anchor="middle" fill="var(--cds-text-muted)" font-size="10" class="mono">
        {{ (maxT / 2).toFixed(1) }} min
      </text>
      <text :x="W - P.r" :y="H - 7" text-anchor="end" fill="var(--cds-text-muted)" font-size="10" class="mono">
        {{ maxT.toFixed(1) }} min
      </text>

      <path :d="areaPath" fill="var(--cds-accent-soft)" />
      <path :d="linePath" fill="none" stroke="var(--cds-text-accent)" stroke-width="2" />

      <circle
        v-for="dot in dots"
        :key="dot.key"
        :cx="dot.cx"
        :cy="dot.cy"
        r="3.4"
        fill="var(--cds-surface-2)"
        stroke="var(--cds-text-accent)"
        stroke-width="2"
      />
    </svg>
  </div>
</template>
