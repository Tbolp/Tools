import { Container, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import TUpload from "../components/TUpload";
import { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

function repaint(elt: HTMLCanvasElement, data: ArrayBuffer, w: number, h: number) {
  let ctx = elt.getContext('2d')
  if (ctx) {
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 100, 100)
  }
}

function calc(data: ArrayBuffer, width: number) {
  return [100, 100]
}

export default function () {
  let [fmt, set_fmt] = useState(0)
  let [width_str, set_width_str] = useState('')
  let [rect, set_rect] = useState({
    width: 0,
    height: 0
  })
  let [upload, set_upload] = useState(false)
  let [bin, set_bin] = useState<ArrayBuffer>(new ArrayBuffer(0))
  let elt = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    console.log('redraw')
  }, [rect, bin, fmt])
  return (
    <Container>
      <Grid container sx={{ mt: '1em' }}>
        <TUpload onChange={async (e) => {
          let file = e.target.files![0]
          let buf = await file.arrayBuffer()
          set_bin(buf)
        }} />
      </Grid>
      <Grid container alignItems='center' sx={{ mt: '1em' }}>
        <Grid xs>
          <Typography variant="body1">Format</Typography>
        </Grid>
        <Grid xs='auto'>
          <Select size="small" value={fmt} onChange={(e) => {
            set_fmt(e.target.value as number)
          }}>
            <MenuItem key={0} value={0}>R8G8B8</MenuItem>
            <MenuItem key={1} value={1}>B8G8R8</MenuItem>
            <MenuItem key={2} value={2}>R8G8B8A8</MenuItem>
            <MenuItem key={3} value={3}>YU12(I420)</MenuItem>
            <MenuItem key={4} value={4}>NV12</MenuItem>
            <MenuItem key={5} value={5}>NV21</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid container alignItems='center' spacing={2} sx={{ mt: '1em' }}>
        <Grid xs>
          <Typography variant="body1">Witdh</Typography>
        </Grid>
        <Grid xs='auto'>
          <TextField fullWidth value={width_str} size="small" onChange={(e) => {
            if (e.target.value !== '') {
              let pre_num = parseInt(e.target.value, 10)
              if (!Number.isNaN(pre_num) && pre_num != 0) {
                set_width_str(pre_num.toString())
              }
            } else {
              set_width_str('')
            }
          }} onBlur={(e) => {
            // set_width(parseInt(e.target.value, 10))
          }} />
        </Grid>
      </Grid>
      <Grid container>
        <canvas width={rect.width} height={rect.height} ref={elt} />
      </Grid>
    </Container >
  )
}