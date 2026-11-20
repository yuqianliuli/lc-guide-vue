<script setup>
import { computed } from 'vue'
import { ROOT_GROUPS, PROJECT_SUBS } from '../config/navConfig'
import {
  state,
  goHome,
  navigateRoot,
  selectProjectSub,
  openHelp,
  lockScreen,
  toggleTheme
} from '../store/lcStore'

const isDrill = computed(() => state.drill === 'test-projects')

function isRootActive(item) {
  return item.drill ? state.drill === item.drill : !state.drill && state.view === item.view
}
</script>

<template>
  <aside class="nav-rail" :class="{ open: state.mobileOpen }">
    <div class="nav-header">
      <div class="nav-brand-row">
        <button class="brand-btn" title="返回主页" @click="goHome">
          <span class="brand-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.8C12 2.8 5.5 10.2 5.5 14.8C5.5 18.4 8.4 21.2 12 21.2C15.6 21.2 18.5 18.4 18.5 14.8C18.5 10.2 12 2.8 12 2.8Z"
                fill="currentColor"
                fill-opacity="0.22"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M8.5 15.6H10.6L12 11.4L13.5 16.4L14.8 14.8H16"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span>
            <span class="brand-name">LC-Guide®</span>
            <span class="brand-sub">液相色谱例行分析软件</span>
          </span>
        </button>

        <button class="icon-btn" title="锁定工作站屏幕" aria-label="锁屏" @click="lockScreen">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <rect x="4" y="11" width="16" height="10" rx="2.5" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </button>
      </div>

      <template v-if="!isDrill">
        <span class="nav-hero-kicker">欢迎</span>
        <div class="nav-hero-title editorial">LC-PRO 3000</div>
      </template>
      <template v-else>
        <button class="nav-back" @click="goHome">‹ 返回主菜单</button>
        <div class="nav-hero-title editorial">检测项目</div>
      </template>
    </div>

    <div class="nav-scroll scroll-fade">
      <template v-if="!isDrill">
        <div v-for="group in ROOT_GROUPS" :key="group.title" class="nav-group">
          <div class="nav-group-title">{{ group.title }}</div>
          <div
            v-for="item in group.items"
            :key="item.id"
            class="nav-row"
            :class="{ 'is-active': isRootActive(item) }"
            @click="navigateRoot(item.id)"
          >
            <span class="nav-label">
              {{ item.label }}
              <span v-if="item.drill" style="opacity: 0.5">›</span>
            </span>
            <button
              type="button"
              class="help-dot"
              title="查看说明"
              @click.stop="openHelp(item.label, item.help)"
            >
              ?
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="nav-group">
          <div class="nav-group-title">你希望做什么?</div>
          <div
            v-for="sub in PROJECT_SUBS"
            :key="sub.id"
            class="nav-row nav-row-sub"
            :class="{ 'is-active': state.sub === sub.id }"
            @click="selectProjectSub(sub.id)"
          >
            <span class="nav-label">{{ sub.label }}</span>
            <button
              type="button"
              class="help-dot"
              title="查看说明"
              @click.stop="openHelp(sub.label, sub.help)"
            >
              ?
            </button>
          </div>
        </div>
        <div class="sub-callout">
          <strong>导航向导提示</strong>
          当前处于「检测项目」二级菜单，选择任一任务即可在右侧分步完成操作。
        </div>
      </template>
    </div>

    <div class="nav-footer">
      <div class="op-meta">
        <span
          class="led"
          :class="state.inst.status === 'running' ? 'is-running dot-pulse' : 'dot-breathe'"
        ></span>
        <div style="min-width: 0">
          <div class="op-name">{{ state.operator.name }}</div>
          <div class="op-sub mono">{{ state.inst.statusText }} · {{ state.inst.pressure.toFixed(1) }} bar</div>
        </div>
      </div>
      <button
        class="icon-btn"
        :title="state.dark ? '切换浅色温润纸感模式' : '切换深色暗调模式'"
        @click="toggleTheme"
      >
        {{ state.dark ? '☀' : '☾' }}
      </button>
    </div>
  </aside>
</template>
