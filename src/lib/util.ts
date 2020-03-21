export function createCanvas(args: { width: number; height: number }): WebGL2RenderingContext {
  const ctx = document.body
    .appendChild(document.createElement('canvas'))
    .getContext('webgl2')

  if (!ctx) throw new Error('Could not get a rendering context')

  ctx.canvas.width = args.width
  ctx.canvas.height = args.height

  return ctx
}
