import { createApp } from 'vue';
import App from './App.vue';

function init() {
  // 等待 MVU 变量框架初始化完毕，否则 store 里读不到 stat_data
  $(async () => {
    await waitGlobalInitialized('Mvu');

    const app = createApp(App).use(createPinia());
    app.mount('#app');

    $(window).on('pagehide', () => app.unmount());

    console.info('[幸运草的约定] 状态栏已挂载');
  });
}

$(() => {
  errorCatched(init)();
});
