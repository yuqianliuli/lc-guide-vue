<script setup>
import { state, jumpTo, cloneProject } from '../store/lcStore'
</script>

<template>
  <div class="banner">
    <div>
      <h1>液相方法目录</h1>
      <p>浏览已验证的 HPLC / UHPLC 方法库，支持一键克隆为新项目。</p>
    </div>
    <button class="btn btn-primary" @click="jumpTo('create-project')">新建检测项目</button>
  </div>

  <div class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>编号</th>
            <th>方法名称</th>
            <th>色谱柱</th>
            <th>条件</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in state.projects" :key="p.id">
            <td class="mono">{{ p.code }}</td>
            <td>
              <b>{{ p.displayName }}</b>
              <div class="hint">{{ p.phaseA }} / {{ p.phaseB }}</div>
            </td>
            <td style="font-size: 12px">{{ p.column }}</td>
            <td class="mono">{{ p.flow }} mL/min · {{ p.colTemp }}°C · {{ p.wl }}nm</td>
            <td>
              <button class="btn btn-sm" @click="cloneProject(p.id)">克隆为新项目</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
