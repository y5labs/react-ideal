# React Ideal

This is an example project that integrates a flat structure ("frameworkless") into React. A hub and inject pattern are available. Additionally a router has been implemented along with updating state.

The build system is webpack with esbuild. No HMR is available, development builds create plain js and css, production builds minify, compress and create hashed filenames.

Stylus is implemented as an example css pre-processor.

Define is used as an example to have a different API url between development and production.

Serve is used in development and in production the dist directory can be hosted statically.

Dependencies have been kept to a minimum.

## Future

1. Explore concurrency beta features.
2. Integrate GraphQL
3. favicon generation, svg minification, etc, etc.
4. Is there a simple router that can replace what's available here?