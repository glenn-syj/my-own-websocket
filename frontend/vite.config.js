import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: {
      pfx: fs.readFileSync(path.resolve(__dirname, 'keystore.p12')),
      passphrase: 'localhost', // p12 파일의 비밀번호
    },
    port: 5173, // 사용할 포트 번호 설정
    open: true, // 브라우저에서 자동으로 열기
  },
})
