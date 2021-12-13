/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  env: {
    API_URL: 'http://localhost:8081'
  },
  knownEntrypoints: [
    'isarray',
    'react/jsx-runtime'
  ],
  mount: {
  },
  exclude: [
    '**/node_modules/**/*',
    '**/.git/**/*',
    '**/dist/**/*',
    '**/*.md',
    '**/*.json',
    '**/*.config.js'
  ],
  plugins: [
    '@snowpack/plugin-react-refresh',
    'snowpack-plugin-stylus'
  ],
  routes: [
    // SPA
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html'
    }
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018'
  },
  packageOptions: {
  },
  devOptions: {
    open: 'none'
  },
  buildOptions: {
    out: '../dist',
    jsxInject: 'import React from \'react\''
  }
}
