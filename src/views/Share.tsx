
import { CopyAllOutlined, DeleteOutline, MenuOutlined, SendOutlined } from '@mui/icons-material'
import { Alert, Box, Button, Container, Icon, IconButton, Input, List, Snackbar, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import axios from 'axios'
import { useEffect, useState } from 'react'

function createList(data: string[], handler: (i: number) => void) {
  let items = []
  for (let i = 0; i < data.length; i++) {
    let it = data[i]
    let item = (
      <Grid container alignItems="center" >
        <Grid xs>
          <Typography sx={{ alignItems: "center" }}>
            {it}
          </Typography>
        </Grid>
        <Grid xs="auto">
          <IconButton onClick={async () => {
            await navigator.clipboard.writeText(it)
          }}>
            <CopyAllOutlined />
          </IconButton>
        </Grid>
        <Grid xs="auto">
          <IconButton onClick={async () => {
            handler(i)
          }}>
            <DeleteOutline />
          </IconButton>
        </Grid>
      </Grid >
    )
    items.push(item)
  }
  return items
}

export default function Share() {
  let [open, set_open] = useState(false)
  let [error_msg, set_error_msg] = useState('')
  let [data, set_data] = useState<string[]>([])
  let [in_text, set_in_text] = useState('')
  let url = '/api/share/data'
  useEffect(() => {
    set_open(error_msg != "")
  }, [error_msg])
  useEffect(() => {
    axios.get(url).then(response => {
      set_data(response.data.data)
    }).catch(error => {
      set_error_msg(JSON.stringify(error))
    })
  }, [])
  return (
    <Container>
      {createList(data, async (index) => {
        let new_data = data.slice()
        new_data.splice(index, 1)
        try {
          let resp = await axios.post(url, new_data)
          set_data(resp.data.data)
        } catch (e) {
          set_error_msg(JSON.stringify(e))
        }
      })}
      <Grid container sx={{ mt: "1em" }}>
        <Grid xs>
          <TextField value={in_text} fullWidth size='small' onChange={(e) => {
            set_in_text(e.target.value)
          }} />
        </Grid>
        <Grid xs="auto">
          <IconButton onClick={async () => {
            let new_data = data.slice()
            new_data.push(in_text)
            try {
              let resp = await axios.post(url, new_data)
              set_data(resp.data.data)
            } catch (e) {
              set_error_msg(JSON.stringify(e))
            }
          }}>
            <SendOutlined />
          </IconButton>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => { set_open(false) }}>
        <Alert severity='error'>
          {error_msg}
        </Alert>
      </Snackbar>
    </Container>
  )
}