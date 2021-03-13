import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "src/style/_extend.scss";`
            }
        }
    },
    resolve:{
        // 解析包失败时尝试读取包package.json的字段
        mainFields:['main']
    }
})
