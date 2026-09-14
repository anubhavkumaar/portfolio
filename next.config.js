/**
 * Exported as a function so the config can see which phase it is in.
 *
 * Dev and build get separate output directories on purpose. They share
 * `.next` by default, so running `next build` while `next dev` is up (or while
 * a dev server is still shutting down) replaces the chunks the other process
 * is pointing at, and one of them fails with "Cannot find module './682.js'".
 *
 * The dev server is the one that moves, not the build: with `output: 'export'`
 * Next writes the exported site into distDir, so the build has to keep the
 * default `.next` for the export to land in `out/`, which is what the deploy
 * workflow publishes.
 */
module.exports = (phase) => {
  const isDev = phase === 'phase-development-server';

  return {
    output: 'export',
    basePath: '',
    trailingSlash: true,
    distDir: isDev ? '.next-dev' : '.next',
    images: {
      unoptimized: true,
    },
  };
};
