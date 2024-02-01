import * as React from 'react'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

interface Option {
    label: string
    id: string
}

export function IdPicker(props: {
    name: string
    options: Option[]
    initial: string
    label: string
    updater: (val: string) => void
}) {
    const onChange = (e: React.SyntheticEvent, v: string) => {
        props.updater(v)
    }
    return (
        <Autocomplete
            id={props.name}
            options={props.options}
            value={props.options.find((o) => o.id == props.initial)}
            disableClearable={true}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={props.label} />}
        />
    )
}
