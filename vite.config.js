import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
      rollupOptions: {
        output: {
          // 入口文件（如 main.js 对应的打包文件）命名，[hash] 是根据内容生成的哈希值
          entryFileNames: 'js/[hash].js',
          // 代码分割后的 chunk 文件命名
          chunkFileNames: 'js/[hash].js',
          // 静态资源（如 CSS、图片等）命名
          assetFileNames: '[ext]/[hash].[ext]'
        }
      }
    }
})
