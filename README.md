# LC-Guide® — 导航式液相色谱操作工作站 (Vue 3 + Vite)

融合 **AB SCIEX Cliquid®** 左侧双层任务向导交互与 **Open Claude UI (CDS)** 温润纸感 / 暗调双色设计体系的液相色谱（HPLC / UHPLC）例行分析工作站前端实现。

## 特性亮点

- **左侧双层导航向导**：主菜单涵盖「你希望做什么 / 设定 / 管理」三大分组，进入「检测项目」后平滑切换为二级任务菜单（创建、修改、排序、自定义实验、启停、删除），每项附带 `?` SOP 帮助说明。
- **CDS 温润纸感 & 暗调双主题**：4 层表面层次、Clay (`#c6613f`) + Accent (`#184f95`) 语义配色、7 段非线性滚动渐隐遮罩与等宽数值对齐。
- **实时色谱采集与积分处理**：
  - 「运行样品」三步向导：项目选择 → 进样序列核对 → 实时 UV 色谱图与系统泵压叠加仿真。
  - 「处理数据」峰区点击联动高亮定量表、校准曲线 (`R² = 0.9998`) 与电子签批。
- **全流程实验室模块**：系统适配性测试 (SST)、四元泵灌注排气泡 (Purge)、氘灯自检、进样针清洗、48 位自动进样器盘面配置、仪器实时流路拓扑、方法库一键克隆、COA 报告实时 A4 预览与安全锁屏。
- **附带零依赖单文件预览版**：直接打开 [`preview/lc_guide_workstation.html`](./preview/lc_guide_workstation.html) 即可在浏览器离线体验完整功能。

## 目录结构

```text
lc-guide-vue/
├── index.html
├── package.json
├── vite.config.js
├── preview/
│   └── lc_guide_workstation.html    # 独立单文件离线预览版
└── src/
    ├── main.js
    ├── App.vue
    ├── styles/cds-theme.css         # CDS 设计系统样式与暗色模式变量
    ├── config/navConfig.js          # 左侧双层导航与顶部标签配置
    ├── store/lcStore.js             # Vue 3 reactive 状态、音效反馈与仿真控制
    ├── components/
    │   ├── LeftNavigator.vue        # 左侧双层导航向导栏
    │   ├── TopBar.vue               # 顶部胶囊分段导航 + 仪器实时遥测
    │   ├── ChromatogramChart.vue    # UV 色谱图与泵压叠加 SVG 图表
    │   ├── GradientCurveChart.vue   # 流动相梯度曲线 (%B) SVG 图表
    │   └── WorkstationModals.vue    # SOP 帮助弹窗、锁屏与 Toast 提示
    └── views/
        ├── HomeView.vue             # 工作站主页
        ├── RunSamplesView.vue       # 运行样品三步向导
        ├── TestProjectsView.vue     # 检测项目二级工作区
        ├── ProcessDataView.vue      # 数据处理与峰区联动定量
        ├── SstView.vue              # 系统适配性测试 (SST)
        ├── MaintenanceView.vue      # 维护系统 (Purge / 自检 / 清洗)
        ├── AutosamplerView.vue      # 48 位自动进样器配置
        ├── MonitorView.vue          # 仪器实时流路监控
        ├── MethodCatalogView.vue    # 液相方法目录
        ├── ReportFormatsView.vue    # COA 报告版式实时预览
        └── SystemConfigView.vue     # 用户简介 / 处理参数 / 共享 / 归档 / 功能
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动本地开发服务器 (默认端口 5173)
npm run dev

# 构建生产包
npm run build
```

或无需构建，直接双击打开 `preview/lc_guide_workstation.html` 预览单文件版本。
