# 领新北斗-车辆动态监控系统(TracSeek)

<p>
    <img src="https://img.shields.io/badge/License-Apache 2.0-green.svg"/>
    <img src="https://img.shields.io/badge/platform-linux%20|%20macos%20|%20windows-blue.svg" />
    <img src="https://img.shields.io/badge/Email-283853318@qq.com-blue"/>
</p>

基于 Vue 3 + Vite + Element Plus 的车辆监控前端，面向 JT/T 808 与 JT/T 1078 场景，包含实时定位、轨迹回放、视频监控、统计报表、系统管理与多语言支持。


## 后端代码仓库
* Gitee ：[https://gitee.com/lingxcom/tracseek](https://gitee.com/lingxcom/tracseek)
* Github ：[https://github.com/lingxcom/tracseek](https://github.com/lingxcom/tracseek)

## 前端代码仓库

* Gitee仓库地址：[https://gitee.com/lingxcom/tracseek-web](https://gitee.com/lingxcom/tracseek-web)
* Github仓库地址：[https://github.com/lingxcom/tracseek-web](https://github.com/lingxcom/tracseek-web)

## 技术栈

- Vue 3（Composition API）
- Vite 5
- Vue Router 4
- Element Plus
- vue-i18n
- Axios
- Maptalks（地图）
- ECharts（图表）
- mpegts.js（视频流）

## 主要功能模块

- 认证与入口
  - 登录、注册、Token 登录
  - 登录状态基于 `sessionStorage.isLogin`
- 监控与地图（JT808）
  - 实时定位、分组监控
  - 轨迹回放（单车/多车/抽稀）
  - 实时报文（WebSocket）
- 管理中心 
- 报表
  - 里程统计（日/月）
  - 离线统计、报警统计
- 系统
  - 用户管理、角色管理
  - 登录日志、操作日志
  - 运行状态、API监控

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 本地开发

```bash
npm run dev
```

默认脚本为 `vite --host 0.0.0.0`，可被局域网设备访问。

### 3) 生产构建

```bash
npm run build
```

### 4) 预览构建产物

```bash
npm run preview
```

## 路由与鉴权说明

- 路由入口：`src/router/index.js`
- 主框架页：`/main`，子路由承载业务页面
- 鉴权逻辑：全局前置守卫读取 `sessionStorage.isLogin === "true"`
- 未登录访问受保护路由时跳转 `/login`

## 接口与 WebSocket 配置

配置文件：`public/static/js/config.js`

- 运行时会向 `window` 注入：
  - `window.apiUrl`
  - `window.wsUrl`
  - `window.uploadUrl`
- 本地开发（localhost / 127.0.0.1）会自动拼接本机地址
- 当 host 包含 `5173` 时，默认改指向 `127.0.0.1:8800`（便于前后端分离联调）

API 调用封装：`src/hooks/api.js`

- 统一通过 `axios.post(window.apiUrl, JSON.stringify(params))`
- 自动注入：
  - `lingxtoken`（来自 `sessionStorage.token`）
  - `language`（当前 i18n 语言）
- `code == 40001` 自动跳转登录
- `code == 40002` 提示无权限

## 多语言（i18n）规范

语言入口：`src/lang/index.js`

- 已内置多语言（如 `zh-CN`, `en-US`, `ja-JP`, `ko-KR` 等）
- 语言切换项由 `LOCALE_OPTIONS` 管理
- Element Plus 语言包在 `src/App.vue` 中按当前语言映射

新增文案时请遵循：

1. 页面内禁止硬编码展示文本，统一使用 `t('...')`
2. 在所有 `src/lang/*/index.js` 中补齐同名 key
3. key 命名建议按模块分层，例如：
   - `el.main.*`
   - `el.report.*`
   - `el.jt808.*`

## 目录结构（核心）

```text
src/
  main.js                 # 应用入口
  App.vue                 # 全局壳 + Element Plus locale
  router/
    index.js              # 路由与守卫
  lang/
    index.js              # i18n 注册
    */index.js            # 多语言词条
  hooks/
    api.js                # 统一 API 调用
    lingx.js              # 工具函数集合
  views/
    Login.vue
    Main.vue
    Home.vue
    jt808/                # 定位、轨迹、报文等
    jt1078/               # 视频相关
    report/               # 统计报表
    lingx/                # 系统能力页
public/
  static/js/config.js     # 运行时 api/ws/upload 地址配置
```

## 构建与资源输出说明

`vite.config.js` 已配置打包产物命名规则：

- JS: `js/[hash].js`
- 资源: `[ext]/[hash].[ext]`

便于静态资源缓存与发布。

## 常见问题

### 1) 页面提示“连不上接口 / WebSocket 失败”

优先检查：

- `public/static/js/config.js` 生成的 `window.apiUrl` / `window.wsUrl`
- 浏览器控制台与 Network 的实际请求地址、状态码、证书错误
- 后端服务端口是否可达（本地联调常见 8800 未启动）

### 2) 登录后又被踢回登录页

检查 `sessionStorage.isLogin` 是否被正确写入 `"true"`，以及 token 是否过期。

## 开发建议

- 提交前至少验证：登录、主菜单、一个 JT808 页面、一个报表页面
- 新增页面优先复用现有 `lingx` 组件体系，避免重复造轮子
- 若改动文案，务必同步全量语言文件，避免运行时 key 缺失
