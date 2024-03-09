import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts"

export default defineConfig(({mode}) => ({

  plugins: [
    vue(),
    dts({insertTypesEntry: true}),
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, 'src/types.d.ts'),
          dest: './'
        }
      ]
    })
  ],
  root: mode === 'development' ? 'playground' : '',
  resolve: {
    alias: {
      "~": resolve(__dirname),
      "@": resolve(__dirname, "src")
    }
  },

  build: {
    sourcemap: true,
    minify: false,
    cssCodeSplit: false,
    target: "esnext",
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      name: "m9lib",
      fileName: "index"
    },

    rollupOptions: {
      external: ['vue', '@vue/runtime-core', 'bootstrap'],
      output: {
        globals: {
          'vue': 'Vue',
          '@vue/runtime-core': 'VueRuntimeCore',
          'bootstrap': 'Bootstrap'
        },
        sourcemapExcludeSources: true 
      },
    }
  }
}))
