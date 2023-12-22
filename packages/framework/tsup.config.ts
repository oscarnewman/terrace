import {defineConfig} from 'tsup';

export default defineConfig({
  bundle: true,
  target: 'node20',
  entry: ['orm/index.ts', 'database/index.ts'],
  minify: false,
  clean: true,
  dts: true,
  format: ['esm'],
})