import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { History } from './history'
import { Settings } from '../model/settings'

export function Reuse(props: { settings: Settings }) {
    return (
        <Stack spacing={2}>
            {props.settings.api_key ? (
                <>
                    <History />
                </>
            ) : (
                <Typography>An API key is required</Typography>
            )}
        </Stack>
    )
}
