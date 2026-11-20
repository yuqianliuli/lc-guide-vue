<script setup>
import { state, startPurge, runLampCheck, runNeedleWash } from '../store/lcStore'

const channels = ['A', 'B', 'C', 'D']
</script>

<template>
  <div class="banner">
    <div>
      <h1>维护系统</h1>
      <p>遵循向导安全执行流动相灌注排气泡 (Purge)、光学自检与进样针清洗。</p>
    </div>
  </div>

  <div class="card">
    <div class="card-title">
      <span>1. 四元泵流动相灌注排气泡 (Purge)</span>
      <span class="badge" :class="state.purging ? 'b-run' : 'b-muted'">
        {{ state.purging ? `进行中 ${state.purgePct}%` : '待执行' }}
      </span>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <label
          v-for="ch in channels"
          :key="ch"
          :style="{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 11px',
            borderRadius: '999px',
            cursor: 'pointer',
            background: state.purgeCh[ch] ? 'var(--cds-clay-soft)' : 'var(--cds-surface-1)',
            color: state.purgeCh[ch] ? 'var(--brand)' : 'inherit',
            border: `1px solid ${state.purgeCh[ch] ? 'var(--cds-clay-border)' : 'var(--cds-border-subtle)'}`
          }"
        >
          <input v-model="state.purgeCh[ch]" type="checkbox" />
          通道 {{ ch }}
        </label>
      </div>

      <button class="btn btn-primary" :disabled="state.purging" @click="startPurge">
        {{ state.purging ? '灌注中...' : '开始排气泡 (3.0 mL/min)' }}
      </button>
    </div>

    <div v-if="state.purgePct > 0" class="progress-track">
      <div class="progress-fill" :style="{ width: `${state.purgePct}%` }"></div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card" style="margin: 0">
      <div class="card-title"><span>2. UV / DAD 氘灯能量自检</span></div>
      <div style="background: var(--cds-surface-1); padding: 10px 12px; border-radius: 8px; font-size: 12.5px; margin-bottom: 12px">
        {{ state.lampDiag }}
      </div>
      <button class="btn" @click="runLampCheck">执行光学自检</button>
    </div>

    <div class="card" style="margin: 0">
      <div class="card-title"><span>3. 自动进样针深度清洗</span></div>
      <div style="background: var(--cds-surface-1); padding: 10px 12px; border-radius: 8px; font-size: 12.5px; margin-bottom: 12px">
        {{ state.needleDiag }}
      </div>
      <button class="btn" @click="runNeedleWash">立即清洗进样针</button>
    </div>
  </div>
</template>
