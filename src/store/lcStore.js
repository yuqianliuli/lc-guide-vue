import { reactive, computed } from 'vue'
import { ROOT_GROUPS } from '../config/navConfig'

function createVials() {
  const preset = {
    A1: { type: 'blank', name: '流动相空白-01', vol: 10 },
    A2: { type: 'std', name: '对照品混合液-L1', vol: 10 },
    A3: { type: 'std', name: '对照品混合液-L2', vol: 10 },
    A4: { type: 'std', name: '对照品混合液-L3', vol: 10 },
    A5: { type: 'qc', name: '质控样-QC-Mid', vol: 10 },
    B1: { type: 'sample', name: '农残样本-20261119-01', vol: 10 },
    B2: { type: 'sample', name: '农残样本-20261119-02', vol: 10 },
    B3: { type: 'sample', name: '农残样本-20261119-03', vol: 10 },
    B4: { type: 'sample', name: '复方制剂-批号2609A', vol: 10 },
    C1: { type: 'qc', name: '质控样-QC-End', vol: 10 }
  }
  const out = []
  for (const r of ['A', 'B', 'C', 'D', 'E', 'F']) {
    for (let c = 1; c <= 8; c++) {
      const pos = r + c
      const p = preset[pos]
      out.push({
        pos,
        type: p ? p.type : 'empty',
        name: p ? p.name : '',
        vol: p ? p.vol : 10
      })
    }
  }
  return out
}

export const state = reactive({
  view: 'home',
  drill: null,
  sub: 'create-project',
  dark: false,
  mobileOpen: false,
  locked: false,
  help: null,
  toast: null,
  sound: true,
  operator: {
    name: '陈明远 (高级分析员)',
    id: 'OP-2048',
    role: '方法管理员 / QC',
    autoLock: 15,
    esign: true
  },
  inst: {
    status: 'ready',
    statusText: '仪器就绪',
    pressure: 182.4,
    flow: 1.0,
    pA: 65,
    pB: 35,
    colTemp: 35.0,
    trayTemp: 15.0,
    wl: 254,
    lampEnergy: 94.6,
    activeVial: 'B1'
  },
  projects: [
    {
      id: 'p1',
      name: 'pesticides_test',
      displayName: '果蔬多农残快速筛查 (HPLC-UV)',
      code: 'LC-METH-0102',
      matrix: '植物源性食品 / 萃取液',
      enabled: true,
      column: 'Poroshell 120 EC-C18 (4.6×150 mm, 2.7 μm)',
      phaseA: '0.1% 甲酸水溶液',
      phaseB: '色谱纯乙腈 (ACN)',
      flow: 1.0,
      colTemp: 35,
      injVol: 10,
      wl: 254,
      runTime: 8.0,
      updatedAt: '2026-11-18 14:22',
      gradient: [
        { t: 0, b: 20 },
        { t: 1.5, b: 20 },
        { t: 5.5, b: 85 },
        { t: 6.5, b: 85 },
        { t: 6.6, b: 20 },
        { t: 8.0, b: 20 }
      ],
      peaks: [
        { name: '多菌灵', rt: 2.15, h: 68, w: 0.14, area: 412580, plates: 8420, tail: 1.06, rs: 0, conc: '12.45 μg/mL' },
        { name: '吡虫啉', rt: 3.68, h: 92, w: 0.16, area: 658910, plates: 11240, tail: 1.04, rs: 6.12, conc: '24.80 μg/mL' },
        { name: '啶虫脒', rt: 5.42, h: 54, w: 0.15, area: 334120, plates: 14680, tail: 1.09, rs: 7.45, conc: '9.86 μg/mL' }
      ]
    },
    {
      id: 'p2',
      name: 'analgesic_assay',
      displayName: '解热镇痛复方制剂含量测定',
      code: 'LC-METH-0205',
      matrix: '片剂 / 口服制剂',
      enabled: true,
      column: 'Eclipse Plus C18 (4.6×100 mm, 3.5 μm)',
      phaseA: '20 mM 磷酸二氢钾 (pH 3.0)',
      phaseB: '甲醇 (MeOH)',
      flow: 1.2,
      colTemp: 30,
      injVol: 5,
      wl: 272,
      runTime: 8.0,
      updatedAt: '2026-11-16 09:40',
      gradient: [
        { t: 0, b: 25 },
        { t: 4.5, b: 65 },
        { t: 6.0, b: 65 },
        { t: 6.2, b: 25 },
        { t: 8.0, b: 25 }
      ],
      peaks: [
        { name: '对乙酰氨基酚', rt: 1.92, h: 84, w: 0.13, area: 542100, plates: 9120, tail: 1.05, rs: 0, conc: '49.82 μg/mL' },
        { name: '咖啡因', rt: 3.45, h: 76, w: 0.14, area: 478320, plates: 12100, tail: 1.03, rs: 6.84, conc: '19.95 μg/mL' },
        { name: '阿司匹林', rt: 5.88, h: 63, w: 0.17, area: 421880, plates: 13850, tail: 1.08, rs: 9.15, conc: '48.70 μg/mL' }
      ]
    },
    {
      id: 'p3',
      name: 'water_soluble_vitamins',
      displayName: '水溶性维生素 (B1/B2/B6/C) 联合分析',
      code: 'LC-METH-0311',
      matrix: '临床营养液 / 保健品',
      enabled: true,
      column: 'AQ-C18 极性耐水柱 (4.6×150 mm, 5 μm)',
      phaseA: '0.05% 三氟乙酸水溶液',
      phaseB: '乙腈 (ACN)',
      flow: 0.8,
      colTemp: 28,
      injVol: 15,
      wl: 266,
      runTime: 8.0,
      updatedAt: '2026-11-12 16:05',
      gradient: [
        { t: 0, b: 5 },
        { t: 2.0, b: 10 },
        { t: 5.0, b: 40 },
        { t: 6.5, b: 40 },
        { t: 6.7, b: 5 },
        { t: 8.0, b: 5 }
      ],
      peaks: [
        { name: '维生素 C', rt: 1.65, h: 78, w: 0.13, area: 495000, plates: 7850, tail: 1.11, rs: 0, conc: '32.10 μg/mL' },
        { name: '维生素 B1', rt: 3.10, h: 61, w: 0.15, area: 368420, plates: 10240, tail: 1.07, rs: 6.45, conc: '15.40 μg/mL' },
        { name: '维生素 B6', rt: 4.52, h: 71, w: 0.14, area: 432900, plates: 11950, tail: 1.04, rs: 6.22, conc: '18.25 μg/mL' },
        { name: '维生素 B2', rt: 6.24, h: 48, w: 0.16, area: 289540, plates: 15320, tail: 1.06, rs: 7.38, conc: '8.90 μg/mL' }
      ]
    },
    {
      id: 'p4',
      name: 'aflatoxin_routine',
      displayName: '谷物黄曲霉毒素 B1/B2 常规监测',
      code: 'LC-METH-0408',
      matrix: '粮油 / 饲料提取液',
      enabled: false,
      column: 'C18 (4.6×150 mm, 3 μm)',
      phaseA: '超纯水',
      phaseB: '甲醇-乙腈 (1:1)',
      flow: 1.0,
      colTemp: 40,
      injVol: 20,
      wl: 365,
      runTime: 8.0,
      updatedAt: '2026-10-29 11:18',
      gradient: [
        { t: 0, b: 45 },
        { t: 6.0, b: 45 },
        { t: 8.0, b: 45 }
      ],
      peaks: [
        { name: '黄曲霉毒素 B2', rt: 3.85, h: 52, w: 0.15, area: 285400, plates: 10800, tail: 1.05, rs: 0, conc: '2.15 ng/mL' },
        { name: '黄曲霉毒素 B1', rt: 5.12, h: 86, w: 0.15, area: 534200, plates: 12940, tail: 1.03, rs: 5.42, conc: '4.82 ng/mL' }
      ]
    }
  ],
  selProjId: 'p1',
  runStep: 1,
  runProgress: 0,
  running: false,
  showPressure: true,
  sequence: [
    { vial: 'A1', name: '流动相空白-01', type: '空白', vol: 10, status: 'done' },
    { vial: 'A2', name: '对照品混合液-L1', type: '标准品', vol: 10, status: 'done' },
    { vial: 'B1', name: '农残样本-20261119-01', type: '未知样品', vol: 10, status: 'ready' },
    { vial: 'B2', name: '农残样本-20261119-02', type: '未知样品', vol: 10, status: 'queued' },
    { vial: 'B3', name: '农残样本-20261119-03', type: '未知样品', vol: 10, status: 'queued' }
  ],
  createStep: 1,
  draft: {
    name: 'pesticides_test_v2',
    displayName: '新建农残梯度筛查项目',
    code: 'LC-METH-0501',
    matrix: '果蔬提取液 / 乙腈相',
    phaseA: '0.1% 甲酸水溶液',
    phaseB: '色谱纯乙腈 (ACN)',
    flow: 1.0,
    col: 'Poroshell 120 EC-C18 (4.6×150 mm, 2.7 μm)',
    colTemp: 35,
    injVol: 10,
    wl: 254,
    gradient: [
      { t: 0, b: 15 },
      { t: 1.5, b: 15 },
      { t: 5.5, b: 80 },
      { t: 6.5, b: 80 },
      { t: 6.7, b: 15 },
      { t: 8.0, b: 15 }
    ]
  },
  customExp: {
    name: '梯度斜率优化对比实验',
    replicates: 3,
    equilTime: 3.0,
    auxWl: 280
  },
  editId: 'p1',
  pendingDelId: null,
  selPeakName: '多菌灵',
  batchApproved: false,
  sstMetrics: [
    { label: '理论塔板数 (N)', limit: '≥ 5,000', val: '11,240', note: '柱效良好，满足药典标准' },
    { label: '拖尾因子 (T)', limit: '0.90 – 1.20', val: '1.04', note: '峰形对称，无明显前伸拖尾' },
    { label: '相邻峰分离度 (Rs)', limit: '≥ 2.00', val: '6.12', note: '基线完全分离' },
    { label: '峰面积精密度 (RSD%)', limit: '≤ 1.00%', val: '0.28%', note: '6 针连续进样重复性优异' }
  ],
  sstLast: '2026-11-19 08:30 (6 针对照品)',
  purgeCh: { A: true, B: true, C: false, D: false },
  purgePct: 0,
  purging: false,
  lampDiag: '尚未执行本次自检 · 氘灯已点亮 1,248 h',
  needleDiag: '上次深度清洗：今日 08:15',
  vials: createVials(),
  selVialPos: 'B1',
  procParams: { minArea: 5000, minHeight: 1.5, rtWin: 0.15, weight: '1/x 加权线性回归' },
  report: {
    lab: '华测理化分析中心 · 液相色谱实验室',
    fmt: 'PDF + CSV',
    chrom: true,
    cal: true,
    sst: true,
    audit: true
  }
})

export const currentProject = computed(
  () => state.projects.find((p) => p.id === state.selProjId) || state.projects[0]
)

let runTimer = null
let purgeTimer = null
let toastTimer = null

export function playChime(kind = 'ok') {
  if (!state.sound) return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  try {
    const ctx = new AC()
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    const t = ctx.currentTime
    osc.frequency.setValueAtTime(kind === 'ok' ? 520 : 420, t)
    osc.frequency.exponentialRampToValueAtTime(kind === 'ok' ? 760 : 340, t + 0.09)
    g.gain.setValueAtTime(0.001, t)
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.15)
    setTimeout(() => ctx.close().catch(() => {}), 220)
  } catch {
    // Ignore autoplay errors
  }
}

export function showToast(msg, type = 'ok') {
  state.toast = { msg, type }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    state.toast = null
  }, 3000)
}

export function goHome() {
  state.drill = null
  state.view = 'home'
  state.mobileOpen = false
}

export function navigateRoot(itemId) {
  const item = ROOT_GROUPS.flatMap((g) => g.items).find((i) => i.id === itemId)
  if (!item) return
  state.drill = item.drill || null
  if (item.sub) state.sub = item.sub
  state.view = item.view
  state.mobileOpen = false
}

export function selectProjectSub(subId) {
  state.sub = subId
  state.view = 'test-projects'
  state.mobileOpen = false
}

export function jumpTo(target) {
  if (target === 'create-project') {
    state.drill = 'test-projects'
    state.sub = 'create-project'
    state.view = 'test-projects'
  } else {
    state.drill = null
    state.view = target
  }
  state.mobileOpen = false
}

export function selectTopTab(id) {
  if (id === 'home') {
    state.drill = null
    state.view = 'home'
  } else if (id === 'help') {
    state.help = {
      title: 'LC-Guide® 操作说明',
      body: '左侧采用 AB SCIEX Cliquid 风格双层任务导航：点击「检测项目」左侧自动切换为子操作菜单；每个菜单右侧「?」均可查看 SOP 提示；左下角支持浅色温润纸感与暗调护眼模式一键切换。'
    }
  } else if (id === 'lock') {
    state.locked = true
    playChime('lock')
  } else {
    state.drill = null
    state.view = id
  }
}

export function toggleTheme() {
  state.dark = !state.dark
  document.documentElement.classList.toggle('dark', state.dark)
}

export function lockScreen() {
  state.locked = true
  playChime('lock')
}

export function unlockScreen(msg) {
  state.locked = false
  playChime('ok')
  showToast(msg || `欢迎回来，${state.operator.name}`)
}

export function openHelp(title, body) {
  state.help = { title, body }
}

export function closeHelp() {
  state.help = null
}

export function startRun() {
  if (state.running) return
  const p = currentProject.value
  state.runStep = 3
  state.running = true
  if (state.runProgress >= p.runTime) state.runProgress = 0
  const idx = state.sequence.findIndex((s) => s.status === 'ready' || s.status === 'queued')
  const activeIdx = idx >= 0 ? idx : 2
  state.sequence[activeIdx].status = 'running'
  state.inst.status = 'running'
  state.inst.statusText = '正在采集'
  state.inst.wl = p.wl
  state.inst.flow = p.flow
  state.inst.colTemp = p.colTemp
  state.inst.activeVial = state.sequence[activeIdx].vial
  playChime('ok')
  showToast(`已启动采集：${p.displayName}`)

  runTimer = setInterval(() => {
    state.runProgress = +(state.runProgress + 0.14).toFixed(2)
    const r = state.runProgress / p.runTime
    state.inst.pressure = +(178 + 26 * Math.sin(r * Math.PI) + (Math.random() - 0.5) * 1.1).toFixed(1)
    if (state.runProgress >= p.runTime) {
      state.runProgress = p.runTime
      stopRun(true, activeIdx)
    }
  }, 150)
}

export function pauseRun() {
  clearInterval(runTimer)
  state.running = false
  state.inst.status = 'ready'
  state.inst.statusText = '已暂停'
  showToast('采集已暂停', 'warn')
}

export function stopRun(done = false, idx = -1) {
  clearInterval(runTimer)
  state.running = false
  state.inst.status = 'ready'
  state.inst.statusText = '仪器就绪'
  state.inst.pressure = 182.4
  if (done && state.sequence[idx]) {
    state.sequence[idx].status = 'done'
    if (state.sequence[idx + 1]?.status === 'queued') {
      state.sequence[idx + 1].status = 'ready'
    }
    playChime('ok')
    showToast(`瓶位 ${state.sequence[idx].vial} 采集完成，谱图已自动保存`)
  } else {
    state.runProgress = 0
    showToast('已中止采集并恢复初始梯度', 'warn')
  }
}

export function saveNewProject() {
  const d = state.draft
  const maxT = Math.max(...d.gradient.map((g) => Number(g.t) || 0), 5)
  const np = {
    id: 'p' + Date.now(),
    name: d.name.trim(),
    displayName: d.displayName.trim() || d.name.trim(),
    code: d.code,
    matrix: d.matrix,
    enabled: true,
    column: d.col,
    phaseA: d.phaseA,
    phaseB: d.phaseB,
    flow: Number(d.flow) || 1,
    colTemp: Number(d.colTemp) || 35,
    injVol: Number(d.injVol) || 10,
    wl: Number(d.wl) || 254,
    runTime: maxT,
    updatedAt: '刚刚创建',
    gradient: d.gradient.map((x) => ({ t: Number(x.t) || 0, b: Number(x.b) || 0 })),
    peaks: [
      { name: '目标峰 A', rt: +(maxT * 0.3).toFixed(2), h: 74, w: 0.14, area: 448200, plates: 9820, tail: 1.05, rs: 0, conc: '16.50 μg/mL' },
      { name: '目标峰 B', rt: +(maxT * 0.58).toFixed(2), h: 86, w: 0.15, area: 591300, plates: 12450, tail: 1.04, rs: 6.72, conc: '28.40 μg/mL' }
    ]
  }
  state.projects.unshift(np)
  state.selProjId = np.id
  state.createStep = 1
  playChime('ok')
  showToast(`已成功创建并启用项目「${np.name}」`)
}

export function moveProject(index, delta) {
  const target = index + delta
  if (target < 0 || target >= state.projects.length) return
  const [item] = state.projects.splice(index, 1)
  state.projects.splice(target, 0, item)
  showToast(`已调整「${item.displayName}」排序`)
}

export function toggleProjectEnabled(id) {
  const p = state.projects.find((x) => x.id === id)
  if (!p) return
  p.enabled = !p.enabled
  playChime('ok')
  showToast(p.enabled ? `已启用「${p.displayName}」` : `已撤销「${p.displayName}」`, p.enabled ? 'ok' : 'warn')
}

export function deleteProject(id) {
  if (state.projects.length <= 1) {
    showToast('至少保留 1 个检测项目', 'warn')
    return
  }
  state.projects = state.projects.filter((x) => x.id !== id)
  state.pendingDelId = null
  if (state.selProjId === id && state.projects[0]) {
    state.selProjId = state.projects[0].id
  }
  if (state.editId === id && state.projects[0]) {
    state.editId = state.projects[0].id
  }
  showToast('已删除选定检测项目', 'warn')
}

export function cloneProject(id) {
  const p = state.projects.find((x) => x.id === id)
  if (!p) return
  state.projects.unshift({
    ...p,
    id: 'p' + Date.now(),
    name: p.name + '_copy',
    displayName: p.displayName + ' (副本)',
    enabled: true,
    updatedAt: '刚刚克隆',
    gradient: p.gradient.map((g) => ({ ...g })),
    peaks: p.peaks.map((pk) => ({ ...pk }))
  })
  playChime('ok')
  showToast('已从方法库克隆新项目')
}

export function runSstCheck() {
  state.sstMetrics[0].val = (10800 + Math.floor(Math.random() * 900)).toLocaleString()
  state.sstMetrics[1].val = (1.02 + Math.random() * 0.05).toFixed(2)
  state.sstMetrics[3].val = (0.21 + Math.random() * 0.14).toFixed(2) + '%'
  state.sstLast = '刚刚验证通过 (6 针对照品)'
  playChime('ok')
  showToast('系统适配性测试 (SST) 全部指标合格')
}

export function startPurge() {
  if (state.purging) return
  state.purging = true
  state.purgePct = 10
  state.inst.status = 'running'
  state.inst.statusText = '流动相排气泡中'
  purgeTimer = setInterval(() => {
    state.purgePct += 15
    if (state.purgePct >= 100) {
      clearInterval(purgeTimer)
      state.purgePct = 100
      state.purging = false
      state.inst.status = 'ready'
      state.inst.statusText = '仪器就绪'
      playChime('ok')
      showToast('流动相灌注排气泡完成，压力脉动 < 0.3 bar')
    }
  }, 220)
}

export function runLampCheck() {
  state.lampDiag = '通过 · 波长准确度 +0.1 nm，氘灯能量 94.6%，基线噪声 0.012 mAU'
  playChime('ok')
  showToast('UV/DAD 光学自检通过')
}

export function runNeedleWash() {
  state.needleDiag = '刚刚完成深度清洗 · 残留验证 < 0.005%'
  playChime('ok')
  showToast('进样针 3 次循环清洗完成')
}

export function cleanupTimers() {
  clearInterval(runTimer)
  clearInterval(purgeTimer)
  clearTimeout(toastTimer)
}
