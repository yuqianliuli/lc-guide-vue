<script setup>
import { state, playChime, showToast } from '../store/lcStore'

const exportFormats = ['PDF + CSV', '仅加密 PDF', 'LIMS XML + PDF']

function saveTemplate() {
  playChime('ok')
  showToast('已保存报告格式模板')
}
</script>

<template>
  <div class="banner">
    <div>
      <h1>报告格式</h1>
      <p>定制 COA 检测报告版式与导出内容，右侧提供实时预览。</p>
    </div>
    <button class="btn btn-primary" @click="saveTemplate">保存模板</button>
  </div>

  <div class="grid-2">
    <div class="card" style="margin: 0">
      <div class="card-title"><span>模板选项</span></div>
      <div class="field">
        <label class="label">实验室抬头</label>
        <input v-model="state.report.lab" class="input" />
      </div>
      <div class="field">
        <label class="label">导出格式</label>
        <select v-model="state.report.fmt" class="select">
          <option v-for="f in exportFormats" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>
      <label style="display: flex; gap: 8px; margin-top: 8px; cursor: pointer">
        <input v-model="state.report.chrom" type="checkbox" />
        附带高分辨率 UV 色谱图
      </label>
      <label style="display: flex; gap: 8px; margin-top: 8px; cursor: pointer">
        <input v-model="state.report.cal" type="checkbox" />
        附带标准曲线与 R²
      </label>
      <label style="display: flex; gap: 8px; margin-top: 8px; cursor: pointer">
        <input v-model="state.report.sst" type="checkbox" />
        附带系统适配性 (SST) 摘要
      </label>
    </div>

    <div class="card" style="margin: 0">
      <div class="card-title">
        <span>报告版式实时预览</span>
        <span class="badge b-muted">A4</span>
      </div>
      <div
        style="background: var(--cds-surface-1); padding: 15px; border-radius: 10px; border: 1px solid var(--cds-border-subtle); display: flex; flex-direction: column; gap: 8px"
      >
        <div class="hint" style="border-bottom: 1px solid var(--cds-border-subtle); padding-bottom: 6px">
          {{ state.report.lab }}
        </div>
        <div class="editorial" style="font-size: 16px; font-weight: 600">
          高效液相色谱定量分析报告 (COA)
        </div>
        <div class="hint mono">项目：pesticides_test · 波长：254 nm · 导出：{{ state.report.fmt }}</div>
        <div
          style="background: var(--cds-surface-2); border: 1px dashed var(--cds-border-strong); border-radius: 6px; padding: 8px 10px; font-size: 12px"
        >
          定量表：多菌灵 12.45 · 吡虫啉 24.80 · 啶虫脒 9.86 μg/mL
        </div>
        <div
          v-if="state.report.chrom"
          style="background: var(--cds-surface-2); border: 1px dashed var(--cds-border-strong); border-radius: 6px; padding: 8px 10px; font-size: 12px"
        >
          [ 嵌入式 UV 254 nm 积分色谱图区域 ]
        </div>
        <div
          v-if="state.report.cal"
          style="background: var(--cds-surface-2); border: 1px dashed var(--cds-border-strong); border-radius: 6px; padding: 8px 10px; font-size: 12px"
        >
          [ 校准曲线图 · R² = 0.9998 ]
        </div>
        <div
          v-if="state.report.sst"
          style="background: var(--cds-surface-2); border: 1px dashed var(--cds-border-strong); border-radius: 6px; padding: 8px 10px; font-size: 12px"
        >
          [ SST 校验：N=11,240 · T=1.04 · RSD=0.28% · 合格 ]
        </div>
      </div>
    </div>
  </div>
</template>
