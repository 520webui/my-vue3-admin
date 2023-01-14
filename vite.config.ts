// @ts-ignore
import { defineConfig } from 'vite'
// @ts-ignore
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import * as path from 'path'
// @ts-ignore
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    //设置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  base: './',
  // 本地运行配置，及反向代理配置
  server: {
    port: 8080,
    host: true,
    // 是否开启 https
    https: false,
    cors: true, // 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
    proxy: {
      // https://cn.vitejs.dev/config/#server-proxy
      '/Meiam': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/Meiam/, '')
      }
    }
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        additionalData:  `@import "${resolve(__dirname, 'src/assets/style/global.less')}";`,
        javascriptEnabled: true,
      }
    }
  }
})
