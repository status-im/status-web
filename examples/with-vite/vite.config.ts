import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
    },
    build: {
      target: 'es2020',
    },
    plugins: [react({})],
    define: {
      /**
       * Loads `.env` files and sets `process.env` varibales.
       *
       * @see https://vitejs.dev/config/#environment-variables
       * @see https://vitejs.dev/config/shared-options.html#define
       */
      ...Object.entries(loadEnv(mode, process.cwd(), '')).reduce(
        (variables, [key, value]) => ({
          ...variables,
          [`process.env.${key}`]: `'${value}'`, // notice ''
        }),
        {}
      ),
    },
  }
})
