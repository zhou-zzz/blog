import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.2em',
        'width': '1.2em',
        'vertical-align': 'text-bottom',
      },
    }),
    presetAttributify(),
    presetWind3(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,600,800',
        mono: 'DM Mono',
      },
    }),
    presetTypography(),
  ],
})
