export function createCanvas(args: { width: number; height: number }): CanvasRenderingContext2D {
  const ctx = document.body
    .appendChild(document.createElement('canvas'))
    .getContext('2d')

  if (!ctx) throw new Error('Could not get a 2d context')

  ctx.canvas.width = args.width
  ctx.canvas.height = args.height

  return ctx
}
