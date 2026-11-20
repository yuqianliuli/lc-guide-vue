<script setup>
import { computed } from 'vue'
import { state, playChime, showToast } from '../store/lcStore'

const cfgMeta = {
  'user-profile': ['用户简介', '操作员身份、锁屏超时与电子签名策略。'],
  'processing-params': ['处理参数', '默认积分阈值、保留时间识别窗口与校准加权方式。'],
  sharing: ['共享与实验室同步', '导出加密检测项目包 (.lcpkg) 或与 LIMS 双向同步。'],
  archive: ['归档存档', '检索历史只读色谱归档包与 SHA-256 完整性指纹。'],
  features: ['功能与硬件模块', '查看已连接的液相色谱硬件固件与软件授权。']
}

const header = computed(() => cfgMeta[state.view] || ['系统配置', '液相色谱工作站参数管理。'])

function saveConfig() {
  playChime('ok')
  showToast(`已保存「${header.value[0]}」设置`)
}
</script>

<template>
  <div class="banner">
    <div>
      <h1>{{ header[0] }}</h1>
      <p>{{ header[1] }}</p>
    </div>
    <button class="btn btn-primary" @click="saveConfig">保存配置</button>
  </div>

  <div class="card">
    <div v-if="state.view === 'user-profile'" class="grid-2">
      <div class="field">
        <label class="label">操作员姓名</label>
        <input v-model="state.operator.name" class="input" />
      </div>
      <div class="field">
        <label class="label">账号 ID</label>
        <input v-model="state.operator.id" class="input mono" />
      </div>
      <div class="field">
        <label class="label">角色权限</label>
        <select v-model="state.operator.role" class="select">
          <option>方法管理员 / QC</option>
          <option>例行分析操作员</option>
        </select>
      </div>
      <div class="field">
        <label class="label">自动锁屏 (分钟)</label>
        <input v-model.number="state.operator.autoLock" type="number" class="input mono" />
      </div>
    </div>

    <div v-else-if="state.view === 'processing-params'" class="grid-2">
      <div class="field">
        <label class="label">最小峰面积 (mAU·s)</label>
        <input v-model.number="state.procParams.minArea" type="number" class="input mono" />
      </div>
      <div class="field">
        <label class="label">最小峰高 (mAU)</label>
        <input v-model.number="state.procParams.minHeight" type="number" step="0.1" class="input mono" />
      </div>
      <div class="field">
        <label class="label">保留时间窗口 (± min)</label>
        <input v-model.number="state.procParams.rtWin" type="number" step="0.01" class="input mono" />
      </div>
      <div class="field">
        <label class="label">校准加权</label>
        <select v-model="state.procParams.weight" class="select">
          <option>1/x 加权线性回归</option>
          <option>1/x² 加权线性回归</option>
        </select>
      </div>
    </div>

    <div v-else-if="state.view === 'archive'" class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>归档编号</th>
            <th>关联项目</th>
            <th>批次数</th>
            <th>大小</th>
            <th>SHA-256 指纹</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="mono"><b>ARC-20261119-A</b></td>
            <td class="mono">pesticides_test</td>
            <td class="mono">12 批</td>
            <td class="mono">48.2 MB</td>
            <td class="mono hint">sha256:8f91…c32d</td>
          </tr>
          <tr>
            <td class="mono"><b>ARC-20261116-B</b></td>
            <td class="mono">analgesic_assay</td>
            <td class="mono">9 批</td>
            <td class="mono">31.7 MB</td>
            <td class="mono hint">sha256:4a12…9e07</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>模块 / 服务</th>
            <th>版本 / 地址</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>四元高压梯度泵 (Q-Pump 3000)</b></td>
            <td class="mono">v4.12.0</td>
            <td><span class="badge b-ready">在线 · 就绪</span></td>
          </tr>
          <tr>
            <td><b>自动进样器 (48/96 位控温)</b></td>
            <td class="mono">v3.8.5</td>
            <td><span class="badge b-ready">15.0 °C 稳定</span></td>
          </tr>
          <tr>
            <td><b>UV / DAD 二极管阵列检测器</b></td>
            <td class="mono">v5.0.3</td>
            <td><span class="badge b-ready">氘灯已点亮</span></td>
          </tr>
          <tr>
            <td><b>LIMS 实验室双向同步服务</b></td>
            <td class="mono">lims.lab.internal</td>
            <td><span class="badge b-ready">已连接</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
