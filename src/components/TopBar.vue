<script setup>
import { TOP_TABS } from '../config/navConfig'
import { state, selectTopTab } from '../store/lcStore'

function isTabActive(id) {
  return (id === 'home' && state.view === 'home' && !state.drill) || id === state.view
}
</script>

<template>
  <header class="top-bar">
    <div style="display: flex; align-items: center; gap: 8px">
      <button class="btn btn-sm mobile-btn" @click="state.mobileOpen = !state.mobileOpen">
        ☰ 菜单
      </button>
      <div class="segmented">
        <button
          v-for="tab in TOP_TABS"
          :key="tab.id"
          class="seg-btn"
          :class="{ 'is-active': isTabActive(tab.id) }"
          @click="selectTopTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="telemetry" title="点击查看仪器实时流路" @click="selectTopTab('monitor')">
      <span class="badge" :class="state.inst.status === 'running' ? 'b-run' : 'b-ready'">
        <span
          class="b-dot"
          :class="state.inst.status === 'running' ? 'dot-pulse' : 'dot-breathe'"
        ></span>
        {{ state.inst.statusText }}
      </span>
      <span>
        <span class="t-lbl">泵压</span>
        <b class="mono">{{ state.inst.pressure.toFixed(1) }}</b>
        <span class="t-unit">bar</span>
      </span>
      <span class="t-sep"></span>
      <span>
        <span class="t-lbl">流速</span>
        <b class="mono">{{ state.inst.flow.toFixed(2) }}</b>
        <span class="t-unit">mL/min</span>
      </span>
      <span class="t-sep"></span>
      <span>
        <span class="t-lbl">柱温</span>
        <b class="mono">{{ state.inst.colTemp.toFixed(1) }}</b>
        <span class="t-unit">°C</span>
      </span>
      <span class="t-sep"></span>
      <span>
        <span class="t-lbl">UV</span>
        <b class="mono">{{ state.inst.wl }}</b>
        <span class="t-unit">nm</span>
      </span>
    </div>
  </header>
</template>
