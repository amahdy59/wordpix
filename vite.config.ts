import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  base: '/wordpix/',
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  // Must stay in step with the "paths" block in tsconfig.json. Three of the
  // previous six aliases (@shared, @types, @constants) pointed at directories
  // that do not exist — the real locations are src/app/shared, src/app/types.ts,
  // and src/app/constants.ts — so any import using them would have failed.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/app/shared'),
      '@i18n': path.resolve(__dirname, './src/i18n'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
