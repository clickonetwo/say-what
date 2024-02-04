import React, { useState, useSyncExternalStore } from 'react'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Creation } from './components/creation'
import { SettingsStore } from './model/settings'

export function App() {
    const settings = useSyncExternalStore(SettingsStore.subscribe, SettingsStore.getSnapshot)
    return <Creation settings={settings} />
}
