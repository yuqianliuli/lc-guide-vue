export const ROOT_GROUPS = [
  {
    title: '你希望做什么?',
    items: [
      {
        id: 'run-samples',
        label: '运行样品',
        view: 'run-samples',
        help: '选择已启用的液相色谱检测项目，配置自动进样器序列并启动批量采集，实时查看 UV 色谱图与系统泵压。'
      },
      {
        id: 'process-data',
        label: '处理数据',
        view: 'process-data',
        help: '对已完成采集的色谱批次进行自动积分、保留时间识别、标准曲线拟合与定量结果审核签批。'
      },
      {
        id: 'sst',
        label: '系统适配性测试',
        view: 'sst',
        help: '依据 USP / ChP 药典标准自动验证理论塔板数 (N)、拖尾因子 (T)、分离度 (Rs) 与峰面积精密度 (RSD%)。'
      },
      {
        id: 'maintenance',
        label: '维护系统',
        view: 'maintenance',
        help: '执行四元泵流动相灌注排气泡 (Purge)、色谱柱冲洗平衡、UV/DAD 氘灯能量自检与进样针清洗。'
      }
    ]
  },
  {
    title: '设定',
    items: [
      {
        id: 'new-project',
        label: '新项目',
        view: 'test-projects',
        drill: 'test-projects',
        sub: 'create-project',
        help: '直接进入「创建检测项目」四步向导：项目命名 → 流动相与梯度 → 色谱柱与检测器 → 保存启用。'
      },
      {
        id: 'autosampler',
        label: '自动进样器',
        view: 'autosampler',
        help: '管理 48 位标准样品盘孔位类型分配（空白/标准品/质控/未知样品）与样品盘恒温控制。'
      },
      {
        id: 'user-profile',
        label: '用户简介',
        view: 'user-profile',
        help: '管理当前操作员权限、自动锁屏超时时间与电子签名审计策略。'
      },
      {
        id: 'processing-params',
        label: '处理参数',
        view: 'processing-params',
        help: '设定默认最小峰面积阈值、保留时间识别窗口与校准曲线加权方式。'
      }
    ]
  },
  {
    title: '管理',
    items: [
      {
        id: 'test-projects',
        label: '检测项目',
        view: 'test-projects',
        drill: 'test-projects',
        sub: 'create-project',
        help: '点击后左侧切换为「检测项目」二级导航菜单，集中完成创建、修改、重新排序、自定义实验、启停与删除。'
      },
      {
        id: 'method-catalog',
        label: '液相方法目录',
        view: 'method-catalog',
        help: '浏览已验证的 HPLC / UHPLC 液相分析方法库，支持一键克隆为新的日常检测项目。'
      },
      {
        id: 'report-formats',
        label: '报告格式',
        view: 'report-formats',
        help: '定制 COA 检测报告版式、附带色谱图/校准曲线选项与 PDF/CSV 导出字段。'
      },
      {
        id: 'sharing',
        label: '共享',
        view: 'sharing',
        help: '导出/导入检测项目包 (.lcpkg) 或与实验室 LIMS 服务器同步样品清单。'
      },
      {
        id: 'archive',
        label: '归档存档',
        view: 'archive',
        help: '按日期与项目检索只读历史色谱归档包并校验 SHA-256 完整性指纹。'
      },
      {
        id: 'features',
        label: '功能',
        view: 'features',
        help: '查看已连接的四元泵、脱气机、自动进样器、柱温箱与 UV/DAD 检测器固件及授权状态。'
      }
    ]
  }
]

export const PROJECT_SUBS = [
  {
    id: 'create-project',
    label: '创建检测项目',
    help: '通过 4 步向导新建液相色谱检测项目：提供名称、配置流动相梯度程序与色谱柱/波长参数。'
  },
  {
    id: 'edit-project',
    label: '修改检测项目',
    help: '选择已有检测项目并微调流速、柱温、检测波长或流动相梯度表。'
  },
  {
    id: 'reorder-project',
    label: '重新排序检测项目',
    help: '调整检测项目在「运行样品」界面中的展示优先级，将高频项目置顶。'
  },
  {
    id: 'custom-experiment',
    label: '自定义实验',
    help: '灵活配置双波长采集通道、柱后平衡时间与重复进样针数，适用于方法开发。'
  },
  {
    id: 'toggle-project',
    label: '启动/撤销检测项目',
    help: '控制项目对日常例行分析操作员的可见性，撤销后仍完整保留配置。'
  },
  {
    id: 'delete-project',
    label: '删除检测项目',
    help: '从活动库移除不再使用的检测项目，不影响历史归档谱图。'
  }
]

export const TOP_TABS = [
  { id: 'home', label: '主页' },
  { id: 'monitor', label: '仪器监控' },
  { id: 'method-catalog', label: '方法库' },
  { id: 'help', label: '帮助' },
  { id: 'lock', label: '退出' }
]
