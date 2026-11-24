/** 仅启用默认 SSR 和静态生成，不加载业务模块。 */
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
});
