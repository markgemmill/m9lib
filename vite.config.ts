import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts"

export default defineConfig({

  plugins: [
    vue(),
    dts({insertTypesEntry: true}),
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, 'src/lib/@types/types.d.ts'),
          dest: '@types'
        }
      ]
    })
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },

  build: {
    sourcemap: true,
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      formats: ['es'],
      name: "mgvlib-vue-select",
      fileName: "index"
    },

    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        sourcemapExcludeSources: true 

      },
      
    }

  }

})
