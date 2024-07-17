import { Container } from "@mui/material";
import { useEffect, useRef } from "react";

class Loop {
  private elt: HTMLCanvasElement | null = null
  private count = 0
  private pre = 0
  private pos = {
    x: 0,
    y: 0
  }
  private speed = 20
  start(elt: HTMLCanvasElement) {
    this.elt = elt
    this.count = requestAnimationFrame(this.render.bind(this))
  }
  render(ts: DOMHighResTimeStamp) {
    if (this.pre === 0) {
      this.pre = ts
    }
    let detla = ts - this.pre
    if (detla > 30) {
      detla = 30
    }
    let ctx = this.elt?.getContext('2d')!
    ctx.clearRect(0, 0, 600, 400)
    ctx.save()
    ctx.translate(0, 400)
    ctx.scale(1, -1)
    ctx.fillStyle = 'red'
    this.pos.x += detla / 1000 * 200
    this.pos.x = this.pos.x % 600
    this.pos.y += detla / 100 * this.speed
    if (this.pos.y > 100) {
      this.pos.y = 100
      this.speed = -this.speed
    }
    if (this.pos.y < 0) {
      this.pos.y = 0
      this.speed = -this.speed
    }
    ctx.beginPath()
    ctx.ellipse(this.pos.x, this.pos.y + 100, 100, 100, 0, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    this.count = requestAnimationFrame(this.render.bind(this))
    this.pre = ts
  }
  stop() {
    console.log('stop')
    cancelAnimationFrame(this.count)
  }
}


class Engine {
  private _handle: number = 0
  private _ctx: CanvasRenderingContext2D | null = null
  public set ctx(v: CanvasRenderingContext2D) {
    this._ctx = v;
  }
  public render(fn: null | ((ctx: CanvasRenderingContext2D, ts: DOMHighResTimeStamp) => void)) {
    cancelAnimationFrame(this._handle)
    if (fn == null) {
      return
    }
    let f = (ts: DOMHighResTimeStamp) => {
      fn(this._ctx!, ts)
      this._handle = requestAnimationFrame(f)
    }
    this._handle = requestAnimationFrame(f)
  }
}


export default function () {
  let elt = useRef<HTMLCanvasElement>(null)
  let engine = useRef(new Engine)
  useEffect(() => {
    engine.current.ctx = elt.current!.getContext('2d')!
    let first = true
    let start_ts = 0
    let y = 0
    let x = 0
    engine.current.render((ctx, ts) => {
      ctx.clearRect(0, 0, 10000, 1000)
      ctx.fillStyle = 'red'
      ctx.fillRect(x, y * 10, 5, 20)
      if (first) {
        start_ts = ts
        first = false
        return
      }
      let dt = (ts - start_ts) / 1000
      // x = dt * 10
      y = 4 * dt - 0.5 * 9.8 * dt * dt
      if (y > 200) {
        y = 200
      }
      if (y < 0) {
        start_ts = ts
        y = 0
      }
    })
    return () => {
      engine.current.render(null)
    }
  }, [])
  return (
    <Container>
      <canvas ref={elt} width={600} height={400} />
    </Container>
  )
}