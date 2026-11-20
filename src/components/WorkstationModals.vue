<script setup>
import { ref } from 'vue'
import { state, closeHelp, unlockScreen } from '../store/lcStore'

const pinInput = ref('')

function handleUnlock(e) {
  if (e && (e.isComposing || e.keyCode === 229)) return
  pinInput.value = ''
  unlockScreen()
}
</script>

<template>
  <!-- Help Modal -->
  <div v-if="state.help" class="overlay" @click="closeHelp">
    <div class="dialog" @click.stop>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
        <div style="display: flex; align-items: center; gap: 9px">
          <span class="help-dot" style="opacity: 1; width: 23px; height: 23px">?</span>
          <b>{{ state.help.title }}</b>
        </div>
        <button class="btn btn-sm" @click="closeHelp">关闭</button>
      </div>
      <p style="margin: 0 0 16px; font-size: 13.5px; color: var(--cds-text-secondary); line-height: 1.65">
        {{ state.help.body }}
      </p>
      <div style="display: flex; justify-content: flex-end">
        <button class="btn btn-primary" @click="closeHelp">知道了</button>
      </div>
    </div>
  </div>

  <!-- Lock Screen Modal -->
  <div v-if="state.locked" class="overlay">
    <div class="dialog" style="max-width: 370px; text-align: center">
      <div class="brand-mark" style="width: 44px; height: 44px; border-radius: 12px; margin: 0 auto 12px">
        🔒
      </div>
      <h2 class="editorial" style="margin: 0 0 6px; font-size: 20px">工作站已锁定</h2>
      <p class="hint" style="margin: 0 0 14px">
        当前液相色谱流路保持安全运行（{{ state.inst.pressure.toFixed(1) }} bar），请输入操作员 PIN 解锁。
      </p>
      <div class="field" style="text-align: left">
        <label class="label">操作员 PIN（演示可直接点击解锁）</label>
        <input
          v-model="pinInput"
          type="password"
          class="input mono"
          placeholder="••••"
          @keydown.enter="handleUnlock"
        />
      </div>
      <button class="btn btn-primary" style="width: 100%; height: 35px" @click="handleUnlock()">
        解锁工作站
      </button>
    </div>
  </div>

  <!-- Toast -->
  <div v-if="state.toast" class="toast">
    <span
      class="b-dot"
      :style="{ background: state.toast.type === 'warn' ? 'var(--cds-warning)' : 'var(--cds-success)' }"
    ></span>
    <span>{{ state.toast.msg }}</span>
  </div>
</template>
