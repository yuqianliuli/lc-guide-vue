<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import LeftNavigator from './components/LeftNavigator.vue'
import TopBar from './components/TopBar.vue'
import WorkstationModals from './components/WorkstationModals.vue'
import HomeView from './views/HomeView.vue'
import RunSamplesView from './views/RunSamplesView.vue'
import TestProjectsView from './views/TestProjectsView.vue'
import ProcessDataView from './views/ProcessDataView.vue'
import SstView from './views/SstView.vue'
import MaintenanceView from './views/MaintenanceView.vue'
import AutosamplerView from './views/AutosamplerView.vue'
import MonitorView from './views/MonitorView.vue'
import MethodCatalogView from './views/MethodCatalogView.vue'
import ReportFormatsView from './views/ReportFormatsView.vue'
import SystemConfigView from './views/SystemConfigView.vue'
import { state, closeHelp, cleanupTimers } from './store/lcStore'

const viewMap = {
  home: HomeView,
  'run-samples': RunSamplesView,
  'test-projects': TestProjectsView,
  'process-data': ProcessDataView,
  sst: SstView,
  maintenance: MaintenanceView,
  autosampler: AutosamplerView,
  monitor: MonitorView,
  'method-catalog': MethodCatalogView,
  'report-formats': ReportFormatsView
}

const activeViewComponent = computed(() => viewMap[state.view] || SystemConfigView)

function onKeyDown(e) {
  if (e.isComposing || e.keyCode === 229) return
  if (e.key === 'Escape' && state.help) {
    closeHelp()
  }
}

onMounted(() => {
  document.documentElement.classList.toggle('dark', state.dark)
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  cleanupTimers()
})
</script>

<template>
  <div class="shell">
    <LeftNavigator />
    <div class="workspace-col">
      <TopBar />
      <main class="ws-scroll scroll-fade">
        <div class="ws-inner">
          <component :is="activeViewComponent" />
        </div>
      </main>
    </div>
  </div>
  <WorkstationModals />
</template>
