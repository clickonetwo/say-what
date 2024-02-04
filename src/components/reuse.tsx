import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { Favorites } from './favorites'

export function Reuse() {
    return (
        <Stack spacing={2}>
            <Typography variant="h4" gutterBottom>
                Favorites
            </Typography>
            <Favorites />
        </Stack>
    )
}
