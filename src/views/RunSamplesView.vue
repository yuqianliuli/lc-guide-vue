<script setup>
import { computed } from 'vue'
import ChromatogramChart from '../components/ChromatogramChart.vue'
import {
  state,
  currentProject,
  jumpTo,
  startRun,
  pauseRun,
  stopRun
} from '../store/lcStore'

const enabledProjects = computed(() => state.projects.filter((p) => p.enabled))
const stepLabels = ['选择检测项目', '配置样品序列', '实时采集与谱图']
const statusLabels = { done: '已完成', running: '采集中', ready: '下一针', queued: '队列中' }

function statusBadgeClass(status) {
  if (status === 'done') return 'b-ready'
  if (status === 'running') return 'b-run'
  if (status === 'ready') return 'b-warn'
  return 'b-muted'
}
</script>

<template>
  <div class="banner">
    <div>
      <h1>运行样品</h1>
      <p>三步引导流程：选择检测项目 → 核对自动进样序列 → 实时色谱采集监控。</p>
    </div>
    <div style="display: flex; gap: 8px">
      <button v-if="!state.running" class="btn btn-primary" @click="startRun">▶ 启动当前进样</button>
      <template v-else>
        <button class="btn" @click="pauseRun">暂停</button>
        <button class="btn btn-danger" @click="stopRun(false)">停止</button>
      </template>
    </div>
  </div>

  <div class="stepper">
    <template v-for="(label, idx) in stepLabels" :key="label">
      <span v-if="idx > 0" class="hint">›</span>
      <div
        class="step-item"
        :class="{ 'is-active': state.runStep === idx + 1, 'is-done': state.runStep > idx + 1 }"
        @click="state.runStep = idx + 1"
      >
        <span class="step-num">{{ idx + 1 }}</span>
        {{ label }}
      </div>
    </template>
  </div>

  <!-- Step 1 -->
  <div v-if="state.runStep === 1" class="card">
    <div class="card-title">
      <span>第一步：选择要运行的液相色谱检测项目</span>
      <span class="hint">仅展示已启用项目</span>
    </div>
    <div class="grid-2">
      <div
        v-for="p in enabledProjects"
        :key="p.id"
        class="proj-opt"
        :class="{ 'is-sel': state.selProjId === p.id }"
        @click="state.selProjId = p.id"
      >
        <div style="display: flex; justify-content: space-between; gap: 8px; margin-bottom: 6px">
          <div>
            <b>{{ p.displayName }}</b>
            <div class="hint mono">{{ p.name }} · {{ p.code }}</div>
          </div>
          <span class="badge b-ready">已启用</span>
        </div>
        <div class="hint">{{ p.column }}</div>
        <div class="hint mono" style="margin-top: 3px">
          流速 {{ p.flow }} mL/min · 柱温 {{ p.colTemp }}°C · UV {{ p.wl }} nm
        </div>
      </div>
    </div>
    <div class="wiz-foot">
      <button class="btn" @click="jumpTo('create-project')">新建检测项目</button>
      <button class="btn btn-primary" @click="state.runStep = 2">下一步：配置样品序列 →</button>
    </div>
  </div>

  <!-- Step 2 -->
  <div v-if="state.runStep === 2" class="card">
    <div class="card-title">
      <span>第二步：核对自动进样序列（{{ currentProject.displayName }}）</span>
      <button class="btn btn-sm" @click="jumpTo('autosampler')">查看样品盘</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>瓶位</th>
            <th>样品名称</th>
            <th>类型</th>
            <th>进样量</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(s, idx) in state.sequence"
            :key="s.vial"
            :class="{ 'is-sel': s.status === 'running' }"
          >
            <td class="mono">{{ idx + 1 }}</td>
            <td class="mono"><b>{{ s.vial }}</b></td>
            <td>{{ s.name }}</td>
            <td><span class="badge b-muted">{{ s.type }}</span></td>
            <td class="mono">{{ s.vol }} μL</td>
            <td>
              <span class="badge" :class="statusBadgeClass(s.status)">
                {{ statusLabels[s.status] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="wiz-foot">
      <button class="btn" @click="state.runStep = 1">← 上一步</button>
      <button class="btn btn-primary" @click="startRun">开始执行序列并查看实时谱图 →</button>
    </div>
  </div>

  <!-- Step 3 -->
  <div v-if="state.runStep === 3" class="card">
    <div class="card-title">
      <span>
        实时色谱监控 · {{ currentProject.displayName }}
        <span class="hint mono" style="margin-left: 6px">瓶位 {{ state.inst.activeVial }}</span>
      </span>
      <div style="display: flex; gap: 10px; align-items: center">
        <label style="font-size: 12.5px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer">
          <input v-model="state.showPressure" type="checkbox" />
          叠加泵压
        </label>
        <button class="btn btn-sm" @click="jumpTo('process-data')">前往数据处理</button>
      </div>
    </div>

    <ChromatogramChart
      :project="currentProject"
      :progress-time="state.runProgress > 0 ? state.runProgress : currentProject.runTime"
      :show-pressure="state.showPressure"
      :show-integration="false"
    />

    <div
      style="display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 11px; padding-top: 10px; border-top: 1px solid var(--cds-border-subtle); font-size: 12.5px"
    >
      <span><span class="hint">流动相 A：</span>{{ currentProject.phaseA }}</span>
      <span><span class="hint">流动相 B：</span>{{ currentProject.phaseB }}</span>
      <span><span class="hint">流速：</span><b class="mono">{{ currentProject.flow.toFixed(2) }} mL/min</b></span>
      <span><span class="hint">柱温：</span><b class="mono">{{ currentProject.colTemp }} °C</b></span>
    </div>
  </div>
</template>
