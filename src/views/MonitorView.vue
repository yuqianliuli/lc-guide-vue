<script setup>
import { state, jumpTo } from '../store/lcStore'
</script>

<template>
  <div class="banner">
    <div>
      <h1>仪器实时监控</h1>
      <p>HPLC 四元梯度流路拓扑与模块实时遥测。</p>
    </div>
    <button class="btn" @click="jumpTo('maintenance')">进入系统维护</button>
  </div>

  <div class="card">
    <div class="card-title">
      <span>实时液相流路图</span>
      <span class="badge b-ready">
        <span class="b-dot dot-breathe"></span>
        流路密闭正常
      </span>
    </div>

    <div class="flow-row">
      <div class="flow-node">
        <div class="hint">流动相储液瓶</div>
        <b class="mono">A{{ state.inst.pA }}% · B{{ state.inst.pB }}%</b>
        <div class="hint">真空脱气中</div>
      </div>
      <span>→</span>
      <div class="flow-node hi">
        <div class="hint">四元梯度泵</div>
        <b class="mono">{{ state.inst.pressure.toFixed(1) }} bar</b>
        <div class="hint mono">{{ state.inst.flow.toFixed(2) }} mL/min</div>
      </div>
      <span>→</span>
      <div class="flow-node">
        <div class="hint">自动进样器</div>
        <b class="mono">{{ state.inst.trayTemp.toFixed(1) }} °C</b>
        <div class="hint mono">瓶位 {{ state.inst.activeVial }}</div>
      </div>
      <span>→</span>
      <div class="flow-node">
        <div class="hint">柱温箱</div>
        <b class="mono">{{ state.inst.colTemp.toFixed(1) }} °C</b>
        <div class="hint">C18 反相柱</div>
      </div>
      <span>→</span>
      <div class="flow-node hi">
        <div class="hint">UV/DAD 检测器</div>
        <b class="mono">{{ state.inst.wl }} nm</b>
        <div class="hint mono">能量 {{ state.inst.lampEnergy }}%</div>
      </div>
    </div>
  </div>
</template>
