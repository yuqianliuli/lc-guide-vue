<script setup>
import { computed } from 'vue'
import ChromatogramChart from '../components/ChromatogramChart.vue'
import { state, currentProject, playChime, showToast } from '../store/lcStore'

const selectedPeak = computed(
  () => currentProject.value.peaks.find((p) => p.name === state.selPeakName) || currentProject.value.peaks[0]
)

const calPoints = [
  [64, 127],
  [110, 101],
  [164, 70],
  [212, 43],
  [246, 24]
]

function approveBatch() {
  state.batchApproved = true
  playChime('ok')
  showToast('已完成批次定量审核并电子签批')
}
</script>

<template>
  <div class="banner">
    <div>
      <h1>处理数据</h1>
      <p>点击色谱峰区可联动高亮定量表，审核通过后生成电子签批记录。</p>
    </div>
    <div style="display: flex; gap: 8px; align-items: center">
      <select v-model="state.selProjId" class="select" style="width: 220px">
        <option v-for="p in state.projects" :key="p.id" :value="p.id">{{ p.displayName }}</option>
      </select>
      <button class="btn btn-primary" @click="approveBatch">
        {{ state.batchApproved ? '✓ 已审核签批' : '审核通过并签批' }}
      </button>
    </div>
  </div>

  <div class="grid-2" style="grid-template-columns: 1.5fr 1fr">
    <div class="card" style="margin: 0">
      <div class="card-title">
        <span>积分色谱图（点击峰区联动）</span>
        <span class="badge b-ready">自动基线</span>
      </div>
      <ChromatogramChart
        :project="currentProject"
        :progress-time="currentProject.runTime"
        :show-pressure="false"
        :show-integration="true"
        :selected-peak="selectedPeak?.name || ''"
        @select-peak="(name) => (state.selPeakName = name)"
      />
    </div>

    <div class="card" style="margin: 0">
      <div class="card-title">
        <span>标准曲线 · {{ selectedPeak?.name }}</span>
        <span class="badge b-muted mono">R² = 0.9998</span>
      </div>
      <div class="chart-box">
        <svg viewBox="0 0 280 175" class="chart-svg">
          <line x1="34" y1="14" x2="34" y2="146" stroke="var(--cds-border-strong)" />
          <line x1="34" y1="146" x2="262" y2="146" stroke="var(--cds-border-strong)" />
          <line x1="34" y1="144" x2="250" y2="22" stroke="var(--cds-text-accent)" stroke-width="1.8" />
          <circle
            v-for="([x, y], i) in calPoints"
            :key="i"
            :cx="x"
            :cy="y"
            r="4"
            fill="var(--brand)"
            stroke="var(--cds-surface-2)"
            stroke-width="1.5"
          />
          <text x="148" y="168" text-anchor="middle" fill="var(--cds-text-muted)" font-size="10">
            浓度 Concentration (μg/mL)
          </text>
          <text x="46" y="32" fill="var(--cds-text-secondary)" font-size="10.5" class="mono">
            y = 26,410x + 812
          </text>
        </svg>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 12.5px">
        <span class="hint">1/x 加权线性回归</span>
        <span>实测：<b class="mono">{{ selectedPeak?.conc }}</b></span>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 14px">
    <div class="card-title">
      <span>定量积分结果表</span>
      <span class="hint">共 {{ currentProject.peaks.length }} 个目标峰</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>化合物</th>
            <th>保留时间 (min)</th>
            <th>峰面积</th>
            <th>塔板数 N</th>
            <th>拖尾因子 T</th>
            <th>分离度 Rs</th>
            <th>浓度</th>
            <th>判定</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="pk in currentProject.peaks"
            :key="pk.name"
            :class="{ 'is-sel': selectedPeak?.name === pk.name }"
            style="cursor: pointer"
            @click="state.selPeakName = pk.name"
          >
            <td><b>{{ pk.name }}</b></td>
            <td class="mono">{{ pk.rt.toFixed(2) }}</td>
            <td class="mono">{{ pk.area.toLocaleString() }}</td>
            <td class="mono">{{ pk.plates.toLocaleString() }}</td>
            <td class="mono">{{ pk.tail.toFixed(2) }}</td>
            <td class="mono">{{ pk.rs ? pk.rs.toFixed(2) : '—' }}</td>
            <td class="mono"><b>{{ pk.conc }}</b></td>
            <td><span class="badge b-ready">合格</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
