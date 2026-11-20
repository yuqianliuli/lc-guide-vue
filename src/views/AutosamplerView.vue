<script setup>
import { computed } from 'vue'
import { state, playChime, showToast } from '../store/lcStore'

const typeMap = {
  empty: '空位',
  blank: '空白',
  std: '标准品',
  qc: '质控 QC',
  sample: '未知样品'
}

const selectedVial = computed(
  () => state.vials.find((v) => v.pos === state.selVialPos) || state.vials[0]
)

function saveVial() {
  playChime('ok')
  showToast(`已更新瓶位 ${selectedVial.value.pos} 配置`)
}
</script>

<template>
  <div class="banner">
    <div>
      <h1>自动进样器</h1>
      <p>点击 48 位标准样品盘任意孔位查看或分配样品类型与进样体积。</p>
    </div>
    <span class="badge b-ready mono">样品盘恒温 {{ state.inst.trayTemp.toFixed(1) }} °C</span>
  </div>

  <div class="grid-2" style="grid-template-columns: 1.4fr 1fr">
    <div class="card" style="margin: 0">
      <div class="card-title">
        <span>48 位进样盘 (2 mL 样品瓶)</span>
        <span class="hint">橙=样品 · 蓝=标品 · 绿=质控</span>
      </div>
      <div class="vial-grid">
        <button
          v-for="v in state.vials"
          :key="v.pos"
          class="vial mono"
          :class="[`v-${v.type}`, { 'is-sel': v.pos === selectedVial.pos }]"
          :title="`${v.pos}: ${v.name || '空位'}`"
          @click="state.selVialPos = v.pos"
        >
          {{ v.pos }}
        </button>
      </div>
    </div>

    <div class="card" style="margin: 0">
      <div class="card-title">
        <span>瓶位详情 · <span class="mono">{{ selectedVial.pos }}</span></span>
        <span class="badge b-muted">{{ typeMap[selectedVial.type] }}</span>
      </div>
      <div class="field">
        <label class="label">样品类型</label>
        <select v-model="selectedVial.type" class="select">
          <option v-for="(label, key) in typeMap" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
      <div class="field">
        <label class="label">样品名称</label>
        <input v-model="selectedVial.name" class="input" placeholder="输入样品标识" />
      </div>
      <div class="field">
        <label class="label">进样体积 (μL)</label>
        <input v-model.number="selectedVial.vol" type="number" class="input mono" />
      </div>
      <button class="btn btn-primary" style="width: 100%" @click="saveVial">保存当前瓶位</button>
    </div>
  </div>
</template>
