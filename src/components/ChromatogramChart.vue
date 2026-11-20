<script setup>
import { computed } from 'vue'

const props = defineProps({
  project: { type: Object, required: true },
  progressTime: { type: Number, required: true },
  showPressure: { type: Boolean, default: false },
  showIntegration: { type: Boolean, default: false },
  selectedPeak: { type: String, default: '' }
})

const emit = defineEmits(['select-peak'])

const W = 720
const H = 240
const P = { t: 24, r: 36, b: 32, l: 48 }
const pw = W - P.l - P.r
const ph = H - P.t - P.b

const total = computed(() => props.project.runTime || 8.0)
const maxT = computed(() => Math.min(total.value, Math.max(0.05, props.progressTime)))

function sx(t) {
  return P.l + (t / total.value) * pw
}

function sy(y) {
  return P.t + ph - ((Math.max(-2, Math.min(110, y)) + 2) / 112) * ph
}

function evalY(t) {
  let y =
    1.6 +
    0.45 * Math.sin(t * 0.9) +
    (t / total.value) * 1.8 +
    11 * Math.exp(-Math.pow((t - 0.68) / 0.08, 2))
  for (const pk of props.project.peaks) {
    y += pk.h * Math.exp(-Math.pow((t - pk.rt) / (pk.w || 0.14), 2))
  }
  return y
}

const signalPath = computed(() => {
  let d = ''
  for (let i = 0; i <= 240; i++) {
    const t = (i / 240) * maxT.value
    d += (i === 0 ? 'M' : 'L') + sx(t).toFixed(1) + ',' + sy(evalY(t)).toFixed(1)
  }
  return d
})

const pressurePath = computed(() => {
  if (!props.showPressure) return ''
  let d = ''
  for (let i = 0; i <= 90; i++) {
    const t = (i / 90) * maxT.value
    const pY = 58 + 20 * Math.sin((t / total.value) * Math.PI) + 1.4 * Math.cos(t * 3)
    d += (i === 0 ? 'M' : 'L') + sx(t).toFixed(1) + ',' + sy(pY).toFixed(1)
  }
  return d
})

const integrationAreas = computed(() => {
  if (!props.showIntegration) return []
  return props.project.peaks
    .filter((pk) => pk.rt <= maxT.value)
    .map((pk) => {
      const t0 = Math.max(0, pk.rt - pk.w * 2.5)
      const t1 = Math.min(total.value, pk.rt + pk.w * 2.5)
      let d = `M${sx(t0).toFixed(1)},${sy(evalY(t0)).toFixed(1)}`
      for (let i = 0; i <= 28; i++) {
        const t = t0 + (i / 28) * (t1 - t0)
        d += `L${sx(t).toFixed(1)},${sy(evalY(t)).toFixed(1)}`
      }
      d += `L${sx(t1).toFixed(1)},${sy(evalY(t1)).toFixed(1)} Z`
      return {
        name: pk.name,
        d,
        fill: pk.name === props.selectedPeak ? 'rgba(217,119,87,0.3)' : 'rgba(217,119,87,0.13)'
      }
    })
})

const peakMarkers = computed(() =>
  props.project.peaks
    .filter((pk) => pk.rt <= maxT.value + 0.04)
    .map((pk) => {
      const cx = sx(pk.rt)
      const cy = sy(evalY(pk.rt))
      return {
        name: pk.name,
        rt: pk.rt,
        cx: cx.toFixed(1),
        cy: cy.toFixed(1),
        yName: Math.max(14, cy - 11).toFixed(1),
        yRt: Math.max(24, cy - 1).toFixed(1),
        selected: pk.name === props.selectedPeak
      }
    })
)

const yTicks = [0, 25, 50, 75, 100]
const xTicks = computed(() => Array.from({ length: Math.floor(total.value) + 1 }, (_, t) => t))
</script>

<template>
  <div class="chart-box">
    <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--cds-text-secondary); margin-bottom: 5px">
      <div style="display: flex; gap: 14px">
        <span><b style="color: var(--brand)">━</b> UV {{ project.wl }} nm (mAU)</span>
        <span v-if="showPressure"><b style="color: var(--cds-text-accent)">┄</b> 系统泵压 (bar)</span>
      </div>
      <span class="mono hint">t = {{ maxT.toFixed(2) }} / {{ total.toFixed(1) }} min</span>
    </div>

    <svg :viewBox="`0 0 ${W} ${H}`" class="chart-svg">
      <g v-for="v in yTicks" :key="v">
        <line
          :x1="P.l"
          :x2="W - P.r"
          :y1="sy(v)"
          :y2="sy(v)"
          stroke="var(--cds-border-subtle)"
          stroke-dasharray="2 3"
        />
        <text :x="P.l - 8" :y="sy(v) + 3.5" text-anchor="end" fill="var(--cds-text-muted)" font-size="10" class="mono">
          {{ v }}
        </text>
      </g>

      <line :x1="P.l" :y1="P.t" :x2="P.l" :y2="H - P.b" stroke="var(--cds-border-strong)" />
      <line :x1="P.l" :y1="H - P.b" :x2="W - P.r" :y2="H - P.b" stroke="var(--cds-border-strong)" />

      <text
        v-for="t in xTicks"
        :key="t"
        :x="sx(t)"
        :y="H - P.b + 16"
        text-anchor="middle"
        fill="var(--cds-text-muted)"
        font-size="10"
        class="mono"
      >
        {{ t.toFixed(1) }}
      </text>

      <text :x="P.l + pw / 2" :y="H - 4" text-anchor="middle" fill="var(--cds-text-muted)" font-size="10">
        保留时间 Retention Time (min)
      </text>

      <path
        v-for="area in integrationAreas"
        :key="area.name"
        :d="area.d"
        :fill="area.fill"
        style="cursor: pointer"
        @click="emit('select-peak', area.name)"
      />

      <path
        v-if="showPressure"
        :d="pressurePath"
        fill="none"
        stroke="var(--cds-text-accent)"
        stroke-width="1.25"
        stroke-dasharray="4 3"
        opacity="0.55"
      />

      <path :d="signalPath" fill="none" stroke="var(--brand)" stroke-width="1.9" stroke-linecap="round" />

      <line
        v-if="maxT < total"
        :x1="sx(maxT)"
        :x2="sx(maxT)"
        :y1="P.t"
        :y2="H - P.b"
        stroke="var(--cds-clay)"
        stroke-dasharray="3 3"
      />

      <g
        v-for="mk in peakMarkers"
        :key="mk.name"
        style="cursor: pointer"
        @click="emit('select-peak', mk.name)"
      >
        <circle
          :cx="mk.cx"
          :cy="mk.cy"
          :r="mk.selected ? 4.2 : 3.2"
          :fill="mk.selected ? 'var(--brand)' : 'var(--cds-surface-2)'"
          stroke="var(--brand)"
          stroke-width="1.8"
        />
        <text
          :x="mk.cx"
          :y="mk.yName"
          text-anchor="middle"
          fill="var(--cds-text-primary)"
          font-size="10.5"
          font-weight="600"
        >
          {{ mk.name }}
        </text>
        <text
          :x="mk.cx"
          :y="mk.yRt"
          text-anchor="middle"
          fill="var(--cds-text-muted)"
          font-size="9.5"
          class="mono"
        >
          {{ mk.rt.toFixed(2) }} min
        </text>
      </g>
    </svg>
  </div>
</template>
