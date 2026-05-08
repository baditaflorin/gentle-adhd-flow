import { useEffect, useRef } from 'react'

type Props = {
  running: boolean
  soundscape: string
}

export function FocusCanvas({ running, soundscape }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const drawingCanvas = canvas
    const drawingContext = context

    let frame = 0
    let raf = 0

    function draw() {
      const ratio = window.devicePixelRatio || 1
      const width = drawingCanvas.clientWidth * ratio
      const height = drawingCanvas.clientHeight * ratio
      if (drawingCanvas.width !== width || drawingCanvas.height !== height) {
        drawingCanvas.width = width
        drawingCanvas.height = height
      }

      drawingContext.clearRect(0, 0, width, height)
      drawingContext.fillStyle = '#f4f7f1'
      drawingContext.fillRect(0, 0, width, height)

      const palette =
        soundscape === 'lofi'
          ? ['#3d5a80', '#c85a3e', '#2f6b58']
          : soundscape === 'rainline'
            ? ['#147f85', '#3d5a80', '#c58a1a']
            : ['#2f6b58', '#c58a3e', '#3d5a80']

      for (let band = 0; band < 7; band += 1) {
        drawingContext.beginPath()
        const yBase = height * (0.2 + band * 0.1)
        drawingContext.moveTo(0, yBase)
        for (let x = 0; x <= width; x += 18) {
          const speed = running ? frame * (0.012 + band * 0.002) : frame * 0.002
          const y =
            yBase +
            Math.sin(x * 0.008 + speed + band) * (10 + band * 2) +
            Math.cos(x * 0.004 + speed * 0.6) * 8
          drawingContext.lineTo(x, y)
        }
        drawingContext.strokeStyle = palette[band % palette.length]
        drawingContext.globalAlpha = 0.18 + band * 0.06
        drawingContext.lineWidth = 2 + band * 0.4
        drawingContext.stroke()
      }

      drawingContext.globalAlpha = 1
      frame += 1
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [running, soundscape])

  return <canvas className="focus-canvas" ref={ref} aria-label="Focus soundscape visualization" />
}
