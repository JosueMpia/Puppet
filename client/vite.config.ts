import { defineConfig } from 'vite'
import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'

import { dark } from './src/common/theme'


const SITE_CONFIG = {
  URL:  'puppet.house',
  TWITTER_HASH:  'PuppetFinance',
  APP_NAME:  'Puppet',
  APP_DESC_SHORT:  'Copy Trading',
  APP_DESC_LONG:  'Traders earn more, investors minimize their risks by mirroring multiple performant traders on a single deposit.',
  THEME_PRIMARY:  dark.pallete.primary,
  THEME_BACKGROUND:  dark.pallete.background,
}

const prefixedParentEnv = Object.fromEntries(
  Object.entries(SITE_CONFIG).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)])
)


const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'prompt',
  strategies: 'injectManifest',
  injectManifest: {
    maximumFileSizeToCacheInBytes: 3000000
  },
  srcDir: 'src',
  filename: 'sw.ts',
  

  includeAssets: ['pwa-192x192.png', 'pwa-512x512.png', 'metamask-fox.svg'],
  manifest: {
    name: SITE_CONFIG.APP_NAME,
    short_name: SITE_CONFIG.APP_NAME,
    description: SITE_CONFIG.APP_DESC_LONG,
    theme_color: SITE_CONFIG.THEME_PRIMARY,
    background_color: SITE_CONFIG.THEME_BACKGROUND,
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'pwa-maskable-560x560.png',
        sizes: '560x560',
        type: 'image/png',
        purpose: "any maskable"
      },
    ]
  },

  mode: 'development',
  base: '/',
  devOptions: {
    // enabled: true,
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
    suppressWarnings: true,
  },
}


const replaceOptions = { __DATE__: new Date().toISOString(), SW_DEV: process.env.SW_DEV }
const selfDestroying = process.env.SW_DESTROY === 'true'

if (selfDestroying)
  pwaOptions.selfDestroying = selfDestroying


// https://vitejs.dev/config/
export default defineConfig({
  // define: { ...prefixedParentEnv },
  envDir: '../',
  publicDir: 'assets',
  plugins: [
    VitePWA(pwaOptions),
    replace(replaceOptions),
  ],
  build: {
    outDir: ".dist",
    target: "es2022",
  },
  resolve: {
    alias: {
      events: 'eventemitter3',
    }
  }
})