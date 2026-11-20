<script setup>
import { computed } from 'vue'
import { state, jumpTo } from '../store/lcStore'

const enabledCount = computed(() => state.projects.filter((p) => p.enabled).length)
</script>

<template>
  <div class="banner">
    <div>
      <h1>欢迎使用 LC-Guide® 液相色谱例行分析工作站</h1>
      <p>左侧遵循 AB SCIEX Cliquid® 任务向导式分层导航，融合 Open Claude UI 温润纸感 / 暗调体系。</p>
    </div>
    <div style="display: flex; gap: 8px">
      <button class="btn btn-primary" @click="jumpTo('run-samples')">立即运行样品</button>
      <button class="btn" @click="jumpTo('create-project')">创建检测项目</button>
    </div>
  </div>

  <div class="grid-4" style="margin-bottom: 14px">
    <div class="metric">
      <div style="display: flex; justify-content: space-between">
        <span class="hint">四元梯度泵</span>
        <span class="badge b-ready">稳定</span>
      </div>
      <div class="metric-val mono">{{ state.inst.pressure.toFixed(1) }} <span class="hint">bar</span></div>
      <div class="hint mono">流速 {{ state.inst.flow.toFixed(2) }} mL/min · A{{ state.inst.pA }}/B{{ state.inst.pB }}</div>
    </div>

    <div class="metric">
      <div style="display: flex; justify-content: space-between">
        <span class="hint">柱温箱</span>
        <span class="badge b-ready">恒温</span>
      </div>
      <div class="metric-val mono">{{ state.inst.colTemp.toFixed(1) }} <span class="hint">°C</span></div>
      <div class="hint">波动 ±0.05 °C · 控温稳定</div>
    </div>

    <div class="metric">
      <div style="display: flex; justify-content: space-between">
        <span class="hint">UV / DAD 检测器</span>
        <span class="badge b-ready">就绪</span>
      </div>
      <div class="metric-val mono">{{ state.inst.wl }} <span class="hint">nm</span></div>
      <div class="hint">氘灯能量 {{ state.inst.lampEnergy }}% · 基线正常</div>
    </div>

    <div class="metric">
      <div style="display: flex; justify-content: space-between">
        <span class="hint">检测项目库</span>
        <span class="badge b-muted">共 {{ state.projects.length }} 项</span>
      </div>
      <div class="metric-val mono">{{ enabledCount }} <span class="hint">项启用</span></div>
      <div class="hint">进样盘恒温 {{ state.inst.trayTemp.toFixed(1) }} °C</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">
      <span>常用导航流程</span>
      <span class="hint">点击即可进入对应分步向导</span>
    </div>
    <div class="grid-3">
      <div class="guide-card" @click="jumpTo('run-samples')">
        <span style="font-size: 11.5px; font-weight: 600; color: var(--brand)">01 · 例行采集</span>
        <b>运行样品批次</b>
        <span class="hint">选择项目、核对样品序列并实时查看 UV 色谱图与泵压。</span>
        <span style="font-size: 12.5px; font-weight: 600; color: var(--cds-text-accent)">进入运行向导 →</span>
      </div>

      <div class="guide-card" @click="jumpTo('create-project')">
        <span style="font-size: 11.5px; font-weight: 600; color: var(--brand)">02 · 项目管理</span>
        <b>创建或修改检测项目</b>
        <span class="hint">左侧切换为「检测项目」二级菜单，四步向导完成命名与梯度曲线配置。</span>
        <span style="font-size: 12.5px; font-weight: 600; color: var(--cds-text-accent)">打开检测项目向导 →</span>
      </div>

      <div class="guide-card" @click="jumpTo('sst')">
        <span style="font-size: 11.5px; font-weight: 600; color: var(--brand)">03 · 合规验证</span>
        <b>系统适配性测试 (SST)</b>
        <span class="hint">一键校验理论塔板数 N、拖尾因子 T、分离度 Rs 与峰面积 RSD%。</span>
        <span style="font-size: 12.5px; font-weight: 600; color: var(--cds-text-accent)">运行适配性检查 →</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">
      <span>近期分析批次</span>
      <button class="btn btn-sm" @click="jumpTo('process-data')">进入数据处理</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>批次编号</th>
            <th>检测项目</th>
            <th>样品数</th>
            <th>操作员</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="mono">BATCH-20261119-01</td>
            <td>
              <b>果蔬多农残快速筛查</b>
              <div class="hint mono">pesticides_test</div>
            </td>
            <td class="mono">12 针</td>
            <td>陈明远</td>
            <td><span class="badge b-ready">已完成 · 通过</span></td>
            <td><button class="btn btn-sm" @click="jumpTo('process-data')">查看谱图</button></td>
          </tr>
          <tr>
            <td class="mono">BATCH-20261119-02</td>
            <td>
              <b>解热镇痛复方制剂含量测定</b>
              <div class="hint mono">analgesic_assay</div>
            </td>
            <td class="mono">8 针</td>
            <td>陈明远</td>
            <td><span class="badge b-warn">待数据复核</span></td>
            <td><button class="btn btn-sm" @click="jumpTo('process-data')">复核积分</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
