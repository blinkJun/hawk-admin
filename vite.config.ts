import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "src/style/_extend.scss" as *;`
            }
        }
    },
    
    resolve:{
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
