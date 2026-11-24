# Transition appear 静态生成最小复现

本项目从 Nuxt 官网项目中提取，仅保留 Nuxt、Vue、Vue Router 和预览所需的 Vite。没有 TDesign、Tailwind、图片、插件、业务布局或数据请求。

## 运行

验证环境：Windows、Node.js 24.22.3、pnpm 12.21.0。

```sh
pnpm install --frozen-lockfile
pnpm generate
pnpm preview
```

打开 http://127.0.0.1:4173/，直接刷新页面，等待一秒。请使用 HTTP 预览，不要双击生成的 HTML。

页面提供三组对照：

1. `Transition appear` 中的静态文字：待验证的故障组。
2. 同样的结构，但文字元素增加 `v-if="true"`：绕过静态缓存的对照组。
3. 无 Transition 的静态文字：基础对照组。

预期三组文字都显示。报告的故障表现是第一组文字不显示，第二、三组正常。也可运行 `pnpm dev` 对比开发模式；验证报告时请记录自己的实际浏览器结果。

## 文件

- `app/app.vue`：完整页面和过渡 CSS。
- `nuxt.config.ts`：仅设置兼容日期、关闭开发工具。
- `pnpm-lock.yaml`：锁定实际依赖，提交复现仓库时必须包含。
- `ISSUE.md`：Vue Issue 表单逐项填写内容及发布步骤。
- `.doc/2026-11-24-最小复现说明.md`：创建内容与验证范围。

## 已做验证与限制

- `pnpm install --frozen-lockfile` 成功。
- `pnpm generate` 成功；Nuxt 4.6.4、Vue 3.5.46。
- `pnpm preview` 可启动，首页 HTTP 响应为 200。
- 生成 HTML 中第一、二组均有 `<template>` 包裹。该包裹本身是 SSR 的输出行为，不能单独证明故障。
- 另用纯 Vue 的客户端编译器、SSR 编译器和 Happy DOM 做生产水合诊断：静态组未进入活动 DOM；条件组进入活动 DOM；残留一个 `<template>`。该诊断未引入本最小项目依赖。
- 当前自动化环境无法连接真实浏览器，因此尚未完成独立项目的浏览器实测；请在提交前打开页面确认并填写浏览器版本。
- 构建存在 Nitro `cache-driver.mjs` 被视为外部依赖的警告，但未阻止静态生成；没有把它认定为本问题的原因。

## 检查 DOM

在预览页浏览器开发者工具 Console 执行：

```js
({
  staticInDocument: !!document.querySelector('#static-message'),
  conditionalInDocument: !!document.querySelector('#conditional-message'),
  plainInDocument: !!document.querySelector('#plain-message'),
  retainedTemplate: document.querySelector('#static-case template')?.innerHTML,
})
```

如果故障复现，前三项应依次为 `false`、`true`、`true`，最后一项包含静态文字。`document.querySelector` 不会进入原生 template 的 content。

## 切换 Vue 版本

基线锁定为 3.5.46。需要验证旧版本时执行：

```sh
pnpm add --save-exact vue@3.5.44
pnpm generate
pnpm preview
```

停止旧预览后再启动，刷新时禁用浏览器缓存。版本对比后，恢复基线可执行 `pnpm add --save-exact vue@3.5.46`。不要只修改 package.json 而不重新安装。
