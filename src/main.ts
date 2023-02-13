import { createApp } from 'vue'
// @ts-ignore
import App from './App.vue'
// @ts-ignore
import { i18n } from '@/lang/index';
import store from "@/store/index";
import router from '@/router/index'
import "@/router/permission"
import "./assets/style/global.less";
import "@/utils/rem";
import ElementPlus from 'element-plus'
import * as Elicons from "@element-plus/icons-vue";
import 'element-plus/dist/index.css'
import * as echarts from 'echarts' //全局引入Echarts
const app =createApp(App)
app.config.globalProperties.$echarts=echarts
// @ts-ignore
app.config.globalProperties.$t=i18n.global.t
for (const name in Elicons) {
    // @ts-ignore
    app.component(name, Elicons[name]);
}
app.use(store)
    .use(router)
    .use(ElementPlus)
    .use(i18n)
    .mount('#app')
