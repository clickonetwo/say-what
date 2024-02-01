import React, { useState } from 'react'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { getSettings } from './model/settings'
import { SettingsView } from './components/settings'

const settings = getSettings()

export function App() {
    return <SettingsView settings={settings} />
}
