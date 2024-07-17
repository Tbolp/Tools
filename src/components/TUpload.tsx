import { CloudUploadOutlined } from "@mui/icons-material";
import { Button, Typography, styled } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { ChangeEventHandler, InputHTMLAttributes, useState } from "react";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {

}

export default function (props: { onChange?: ChangeEventHandler<HTMLInputElement> } & InputProps) {
  let [name, set_name] = useState('')
  let input_props: InputProps = props
  return (
    <Grid container sx={{ width: "100%" }} alignItems={'center'} spacing={2}>
      <Grid xs>
        <Button component="label" variant="contained" startIcon={<CloudUploadOutlined />}>
          Upload file
          <VisuallyHiddenInput type="file" {...input_props} onChange={(e) => {
            if (e.target.files && e.target.files.length == 1) {
              set_name(e.target.files[0].name)
              if (props.onChange) {
                props.onChange(e)
              }
            }
          }} />
        </Button>
      </Grid>
      <Grid xs="auto">
        <Typography>{name}</Typography>
      </Grid>
    </Grid>
  )
}