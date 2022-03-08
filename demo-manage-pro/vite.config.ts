import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    port:8888,
    host:'localhost',
    https:false,
    open:true,
    proxy:{
     '/dev-api':{
       target:'http://localhost:3000',
       changeOrigin:true,
       rewrite:(path) => path.replace(/^\/dev-api/, "")
     }
    }
  }

})
