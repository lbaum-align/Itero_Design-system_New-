import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'lib'
      ? [dts({
          tsconfigPath: './tsconfig.app.json',
          include: ['src'],
          // rollupTypes (api-extractor) and insertTypesEntry both emit an EMPTY
          // dist/index.d.ts for this entry, so declarations are emitted per file
          // under dist/src and package.json "types" points at dist/src/index.d.ts.
        })]
      : []),
  ],
  build:
    mode === 'lib'
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ScannerDesignSystem',
            formats: ['es', 'cjs'],
            fileName: 'index',
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                'react/jsx-runtime': 'jsxRuntime',
              },
            },
          },
          cssCodeSplit: false,
        }
      : {},
}));
