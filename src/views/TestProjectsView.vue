<script setup>
import { computed } from 'vue'
import GradientCurveChart from '../components/GradientCurveChart.vue'
import {
  state,
  jumpTo,
  playChime,
  showToast,
  saveNewProject,
  moveProject,
  toggleProjectEnabled,
  deleteProject
} from '../store/lcStore'

const createStepLabels = ['项目命名', '流动相与梯度', '色谱柱与检测器', '摘要确认']

const editProject = computed(
  () => state.projects.find((p) => p.id === state.editId) || state.projects[0]
)

function goCreateStep(n) {
  if (n > 1 && !state.draft.name.trim()) {
    showToast('请先为新检测项目提供一个名称', 'warn')
    return
  }
  state.createStep = n
}

function handleNameEnter(e) {
  if (e.isComposing || e.keyCode === 229) return
  goCreateStep(2)
}

function addGradientNode() {
  const g = state.draft.gradient
  const last = g[g.length - 1] || { t: 0, b: 20 }
  g.push({ t: +(Number(last.t) + 1).toFixed(1), b: last.b })
}

function removeGradientNode(index) {
  if (state.draft.gradient.length <= 2) {
    showToast('至少保留 2 个梯度节点', 'warn')
    return
  }
  state.draft.gradient.splice(index, 1)
}

function saveEditToast() {
  playChime('ok')
  showToast(`已保存对「${editProject.value.name}」的修改`)
}
</script>

<template>
  <!-- 1. Create Project -->
  <template v-if="state.sub === 'create-project'">
    <div class="banner">
      <div>
        <h1>创建检测项目</h1>
        <p>按照下方引导步骤完成命名、流动相梯度程序与色谱柱配置，保存后立即投入使用。</p>
      </div>
      <span class="badge b-run mono">步骤 {{ state.createStep }} / 4</span>
    </div>

    <div class="stepper">
      <template v-for="(label, idx) in createStepLabels" :key="label">
        <span v-if="idx > 0" class="hint">›</span>
        <div
          class="step-item"
          :class="{ 'is-active': state.createStep === idx + 1, 'is-done': state.createStep > idx + 1 }"
          @click="goCreateStep(idx + 1)"
        >
          <span class="step-num">{{ idx + 1 }}</span>
          {{ label }}
        </div>
      </template>
    </div>

    <!-- Step 1 -->
    <div v-if="state.createStep === 1" class="card">
      <div class="prompt-hero">
        <label class="label" style="font-size: 15px; display: block; margin-bottom: 4px" for="d-name">
          为新检测项目提供一个名称
        </label>
        <div class="hint" style="margin-bottom: 11px">
          建议使用清晰的英文方法标识或实验室编码，便于自动归档与 LIMS 对接。
        </div>
        <input
          id="d-name"
          v-model="state.draft.name"
          class="input mono"
          style="max-width: 460px; font-size: 15px; padding: 9px 12px; background: var(--cds-surface-2)"
          placeholder="例如：pesticides_test"
          @keydown.enter.prevent="handleNameEnter"
        />
      </div>

      <div class="grid-3" style="margin-top: 16px">
        <div class="field">
          <label class="label">中文展示名称</label>
          <input v-model="state.draft.displayName" class="input" />
        </div>
        <div class="field">
          <label class="label">SOP 方法编号</label>
          <input v-model="state.draft.code" class="input mono" />
        </div>
        <div class="field">
          <label class="label">适用样品基质</label>
          <input v-model="state.draft.matrix" class="input" />
        </div>
      </div>

      <div class="wiz-foot">
        <span class="hint">左侧可随时切换修改/排序/启停项目</span>
        <button class="btn btn-primary" @click="goCreateStep(2)">下一步：流动相与梯度 →</button>
      </div>
    </div>

    <!-- Step 2 -->
    <div v-if="state.createStep === 2" class="card">
      <div class="card-title">
        <span>配置流动相与梯度洗脱程序</span>
        <button class="btn btn-sm" @click="addGradientNode">+ 添加节点</button>
      </div>
      <div class="grid-3">
        <div class="field">
          <label class="label">流动相 A（水相）</label>
          <input v-model="state.draft.phaseA" class="input" />
        </div>
        <div class="field">
          <label class="label">流动相 B（有机相）</label>
          <input v-model="state.draft.phaseB" class="input" />
        </div>
        <div class="field">
          <label class="label">流速 (mL/min)</label>
          <input v-model.number="state.draft.flow" type="number" step="0.1" class="input mono" />
        </div>
      </div>

      <div class="grid-2" style="align-items: start">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>时间 (min)</th>
                <th>%A</th>
                <th>%B</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(g, i) in state.draft.gradient" :key="i">
                <td>
                  <input
                    v-model.number="g.t"
                    type="number"
                    step="0.1"
                    class="input mono"
                    style="width: 76px; padding: 5px 8px"
                  />
                </td>
                <td class="mono">{{ Math.max(0, 100 - (Number(g.b) || 0)) }}%</td>
                <td>
                  <input
                    v-model.number="g.b"
                    type="number"
                    min="0"
                    max="100"
                    class="input mono"
                    style="width: 76px; padding: 5px 8px"
                  />
                </td>
                <td>
                  <button class="btn btn-sm" @click="removeGradientNode(i)">×</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <GradientCurveChart :steps="state.draft.gradient" />
      </div>

      <div class="wiz-foot">
        <button class="btn" @click="goCreateStep(1)">← 上一步</button>
        <button class="btn btn-primary" @click="goCreateStep(3)">下一步：色谱柱与检测器 →</button>
      </div>
    </div>

    <!-- Step 3 -->
    <div v-if="state.createStep === 3" class="card">
      <div class="card-title">
        <span>色谱柱规格、柱温箱与 UV/DAD 检测波长</span>
      </div>
      <div class="grid-2">
        <div class="field">
          <label class="label">色谱柱型号</label>
          <input v-model="state.draft.col" class="input" />
        </div>
        <div class="field">
          <label class="label">柱温箱温度 (°C)</label>
          <input v-model.number="state.draft.colTemp" type="number" class="input mono" />
        </div>
        <div class="field">
          <label class="label">进样体积 (μL)</label>
          <input v-model.number="state.draft.injVol" type="number" class="input mono" />
        </div>
        <div class="field">
          <label class="label">UV 检测主波长 (nm)</label>
          <input v-model.number="state.draft.wl" type="number" class="input mono" />
        </div>
      </div>
      <div class="wiz-foot">
        <button class="btn" @click="goCreateStep(2)">← 上一步</button>
        <button class="btn btn-primary" @click="goCreateStep(4)">下一步：摘要确认 →</button>
      </div>
    </div>

    <!-- Step 4 -->
    <div v-if="state.createStep === 4" class="card">
      <div class="card-title">
        <span>核对新检测项目参数并保存启用</span>
      </div>
      <div class="grid-2" style="margin-bottom: 13px">
        <div class="metric">
          <div class="hint">项目名称 / 编号</div>
          <b class="mono">{{ state.draft.name }} · {{ state.draft.code }}</b>
          <div class="hint" style="margin-top: 3px">{{ state.draft.displayName }}</div>
        </div>
        <div class="metric">
          <div class="hint">仪器条件摘要</div>
          <b class="mono">
            {{ state.draft.flow }} mL/min · {{ state.draft.colTemp }} °C · {{ state.draft.injVol }} μL · {{ state.draft.wl }} nm
          </b>
          <div class="hint" style="margin-top: 3px">{{ state.draft.col }}</div>
        </div>
      </div>
      <GradientCurveChart :steps="state.draft.gradient" />
      <div class="wiz-foot">
        <button class="btn" @click="goCreateStep(3)">← 返回修改</button>
        <button class="btn btn-primary" @click="saveNewProject">保存并立即启用该项目</button>
      </div>
    </div>
  </template>

  <!-- 2. Edit Project -->
  <template v-else-if="state.sub === 'edit-project'">
    <div class="banner">
      <div>
        <h1>修改检测项目</h1>
        <p>选择已有液相项目并调整流速、柱温与检测波长。</p>
      </div>
      <button class="btn btn-primary" @click="saveEditToast">保存修改</button>
    </div>

    <div class="card">
      <div class="field">
        <label class="label">选择检测项目</label>
        <select v-model="state.editId" class="select">
          <option v-for="p in state.projects" :key="p.id" :value="p.id">
            {{ p.displayName }} ({{ p.name }})
          </option>
        </select>
      </div>
      <div class="grid-3">
        <div class="field">
          <label class="label">流速 (mL/min)</label>
          <input v-model.number="editProject.flow" type="number" step="0.1" class="input mono" />
        </div>
        <div class="field">
          <label class="label">柱温 (°C)</label>
          <input v-model.number="editProject.colTemp" type="number" class="input mono" />
        </div>
        <div class="field">
          <label class="label">检测波长 (nm)</label>
          <input v-model.number="editProject.wl" type="number" class="input mono" />
        </div>
      </div>
      <GradientCurveChart :steps="editProject.gradient" />
    </div>
  </template>

  <!-- 3. Reorder Project -->
  <template v-else-if="state.sub === 'reorder-project'">
    <div class="banner">
      <div>
        <h1>重新排序检测项目</h1>
        <p>调整项目在「运行样品」中的展示优先级。</p>
      </div>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>排序</th>
              <th>检测项目</th>
              <th>方法编号</th>
              <th>调整</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in state.projects" :key="p.id">
              <td class="mono"><b>#{{ i + 1 }}</b></td>
              <td>
                <b>{{ p.displayName }}</b>
                <div class="hint mono">{{ p.name }}</div>
              </td>
              <td class="mono">{{ p.code }}</td>
              <td>
                <button class="btn btn-sm" :disabled="i === 0" @click="moveProject(i, -1)">上移 ↑</button>
                <button
                  class="btn btn-sm"
                  style="margin-left: 4px"
                  :disabled="i === state.projects.length - 1"
                  @click="moveProject(i, 1)"
                >
                  下移 ↓
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  <!-- 4. Custom Experiment -->
  <template v-else-if="state.sub === 'custom-experiment'">
    <div class="banner">
      <div>
        <h1>自定义实验</h1>
        <p>面向方法开发自由组合双波长采集、平衡时长与重复针数。</p>
      </div>
      <button class="btn btn-primary" @click="jumpTo('run-samples')">生成并进入运行</button>
    </div>
    <div class="card">
      <div class="grid-2">
        <div class="field">
          <label class="label">实验任务名称</label>
          <input v-model="state.customExp.name" class="input" />
        </div>
        <div class="field">
          <label class="label">单样品重复进样针数</label>
          <input v-model.number="state.customExp.replicates" type="number" class="input mono" />
        </div>
        <div class="field">
          <label class="label">柱后平衡时间 (min)</label>
          <input v-model.number="state.customExp.equilTime" type="number" step="0.5" class="input mono" />
        </div>
        <div class="field">
          <label class="label">辅助 UV 波长 (nm)</label>
          <input v-model.number="state.customExp.auxWl" type="number" class="input mono" />
        </div>
      </div>
    </div>
  </template>

  <!-- 5. Toggle Project -->
  <template v-else-if="state.sub === 'toggle-project'">
    <div class="banner">
      <div>
        <h1>启动 / 撤销检测项目</h1>
        <p>控制项目是否向日常例行分析操作员展示。</p>
      </div>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>检测项目</th>
              <th>柱温 / 波长</th>
              <th>当前状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in state.projects" :key="p.id">
              <td>
                <b>{{ p.displayName }}</b>
                <div class="hint mono">{{ p.name }}</div>
              </td>
              <td class="mono">{{ p.colTemp }} °C · {{ p.wl }} nm</td>
              <td>
                <span class="badge" :class="p.enabled ? 'b-ready' : 'b-muted'">
                  {{ p.enabled ? '已启动' : '已撤销' }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-sm"
                  :class="{ 'btn-primary': !p.enabled }"
                  @click="toggleProjectEnabled(p.id)"
                >
                  {{ p.enabled ? '撤销停用' : '重新启动' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  <!-- 6. Delete Project -->
  <template v-else>
    <div class="banner">
      <div>
        <h1>删除检测项目</h1>
        <p>移除不再使用的项目；已归档历史谱图与审计追踪保持不变。</p>
      </div>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>检测项目</th>
              <th>方法编号</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in state.projects" :key="p.id">
              <td>
                <b>{{ p.displayName }}</b>
                <div class="hint mono">{{ p.name }}</div>
              </td>
              <td class="mono">{{ p.code }}</td>
              <td class="mono">{{ p.updatedAt }}</td>
              <td>
                <template v-if="state.pendingDelId === p.id">
                  <button class="btn btn-sm btn-danger" @click="deleteProject(p.id)">确认删除</button>
                  <button class="btn btn-sm" style="margin-left: 4px" @click="state.pendingDelId = null">
                    取消
                  </button>
                </template>
                <button v-else class="btn btn-sm btn-danger" @click="state.pendingDelId = p.id">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
</template>
