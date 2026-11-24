# Issue 提交说明

优先反馈到 [Vue Core Bug report](https://github.com/vuejs/core/issues/new?template=bug_report.yml)。当前证据指向 Vue 编译与水合之间的静态缓存处理；如果维护者确认仅限 Nuxt 集成，再转交 Nuxt。

## 提交前

1. 按 README 启动生产预览，在浏览器确认第一组文字缺失、其余两组显示。记录浏览器版本及控制台输出。
2. 在 GitHub 创建空的公开仓库，例如 `TransitionAppear`。此项目不包含公司代码、图片或业务资料。
3. 本地终端运行以下命令，将 `<你的用户名>` 替换成真实账号。目标目录已存在 Git 仓库，不需要再次初始化。

```sh
git add .
git commit -m "Add minimal Transition appear SSR hydration reproduction"
git branch -M main
git remote add origin https://github.com/<你的用户名>/TransitionAppear.git
git push -u origin main
```

如果你已配置 origin，先 `git remote -v` 检查，不要重复添加或覆盖已有地址。上述操作由你执行，本次没有提交、推送或发布 Issue。

4. 先搜索 `transition appear static hydration template`，避免重复报告。历史 issue 若已关闭且不是同一个原因，不要直接认定重复。
5. 打开 Vue Bug report，把下面内容按表单字段分别粘贴。把所有 `<...>` 占位符替换为实际内容。官方要求有效的最小复现链接，不要填写本地磁盘路径。

## Title

```text
Static children inside <Transition appear> remain in <template> after production SSR hydration
```

## Vue version

```text
3.5.46
```

## Link to minimal reproduction

```text
https://github.com/<你的用户名>/TransitionAppear
```

## Steps to reproduce

```text
1. Clone the reproduction repository.
2. Use Node.js 24.22.3 and pnpm 12.21.0.
3. Run pnpm install --frozen-lockfile.
4. Run pnpm generate.
5. Run pnpm preview.
6. Open http://127.0.0.1:4173/ directly, reload, and wait at least one second.
7. Compare the static Transition child with the v-if="true" and no-Transition controls.

The reproduction uses Nuxt 4.6.4 static generation without third-party modules.
```

## What is expected?

```text
All three messages should become visible. The static child inside <Transition appear> should be hydrated and play its initial transition.
```

## What is actually happening?

以下段落需要你先完成浏览器确认再提交；若表现不同，请按实际结果修改。

```text
The static child in the first section remains invisible after production hydration. The v-if="true" control and the plain static message are visible.

The server HTML wraps both Transition children in native <template> elements. The first child remains inside its template after hydration, while the conditional control is unwrapped.

In the browser console:
!!document.querySelector('#static-message') // false
!!document.querySelector('#conditional-message') // true
!!document.querySelector('#plain-message') // true
document.querySelector('#static-case template')?.innerHTML // contains the missing message
```

## System Info

```text
OS: Windows (<补充系统版本>)
Node.js: 24.22.3
pnpm: 12.21.0
Nuxt: 4.6.4
Vue: 3.5.46
Vue Router: 5.5.1
Vite: 8.3.8
Browser: <填写实际浏览器和版本>
```

## Any additional comments?

```text
The production client compiler marks the static child as -1 /* CACHED */. Adding v-if="true" avoids that cached-node path.

My current suspicion is that hydrateElement skips the cached node before reaching the logic that unwraps an SSR <template>. This is an implementation hypothesis, not a maintainer-confirmed diagnosis.

A separate diagnostic using Vue's client compiler, SSR compiler, production runtime and Happy DOM also left the cached static child inside <template>, while the conditional child was unwrapped. That diagnostic is not a real-browser test.

Static generation completes successfully. A Nitro cache-driver externalization warning is present, but no causal relationship with this rendering issue has been established.

Related historical reports: #12046 and #13335. I have not confirmed that this is the same bug as either report.
```

官方表单来源：[Vue Bug report 模板](https://github.com/vuejs/core/blob/main/.github/ISSUE_TEMPLATE/bug_report.yml)。若表单字段调整，以打开的表单为准。
