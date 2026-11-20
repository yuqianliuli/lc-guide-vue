<script setup>
import { state, runSstCheck } from '../store/lcStore'
</script>

<template>
  <div class="banner">
    <div>
      <h1>系统适配性测试 (SST)</h1>
      <p>依据药典标准校验柱效、对称性、分离度与连续进样重现性。</p>
    </div>
    <button class="btn btn-primary" @click="runSstCheck">运行 SST 校验</button>
  </div>

  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px">
    <span class="badge b-ready">全部指标合格 · 允许例行运行</span>
    <span class="hint mono">上次验证：{{ state.sstLast }}</span>
  </div>

  <div class="grid-2">
    <div v-for="m in state.sstMetrics" :key="m.label" class="card" style="margin: 0">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px">
        <span class="hint" style="font-weight: 600">{{ m.label }}</span>
        <span class="badge b-ready">合格</span>
      </div>
      <div style="font-size: 26px; font-weight: 600; margin-bottom: 6px" class="mono">{{ m.val }}</div>
      <div style="font-size: 12.5px">标准限值：<b class="mono">{{ m.limit }}</b></div>
      <div class="hint" style="margin-top: 2px">{{ m.note }}</div>
    </div>
  </div>
</template>
