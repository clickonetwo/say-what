import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import MuiInput from '@mui/material/Input'
import VolumeUp from '@mui/icons-material/VolumeUp'

const Input = styled(MuiInput)`
    width: 60px;
`

export function ZeroToOneSlider(props: {
    name: string
    initial: number
    label: string
    updater: (val: number) => void
}) {
    const [value, setValue] = React.useState(props.initial)

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value))
    }

    const handleBlur = () => {
        if (value < 0) {
            setValue(0)
        } else if (value > 1) {
            setValue(1)
        }
    }

    return (
        <Box sx={{ width: 250 }}>
            <Typography id={`input-slider-${props.name}`} gutterBottom>
                {props.label}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : props.initial}
                        //scale={scale}
                        step={0.01}
                        min={0}
                        max={1}
                        onChange={handleSliderChange}
                        aria-labelledby={`input-slider-${props.name}`}
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={value}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 1,
                            type: 'number',
                            'aria-labelledby': `input-slider-${props.name}`,
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
