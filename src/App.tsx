import React, { useSyncExternalStore } from 'react'
import Grid from '@mui/material/Grid'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Creation } from './components/creation'
import { SettingsStore } from './model/settings'
import { Reuse } from './components/reuse'

export function App() {
    const settings = useSyncExternalStore(SettingsStore.subscribe, SettingsStore.getSnapshot)
    return (
        <Grid container spacing={4}>
            <Grid item xs={6}>
                <Creation settings={settings} />
            </Grid>
            <Grid item xs={6}>
                <Reuse settings={settings} />
            </Grid>
        </Grid>
    )
}
