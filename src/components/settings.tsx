import React, { useState, useSyncExternalStore } from 'react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

import { saveSettings, Settings } from '../model/settings'
import {
    AutoCompleteOptions,
    GenerationSettings,
    ModelsStore,
    VoicesStore,
} from '../model/speech'

import { ZeroToOneSlider } from './slider'
import { ToggleSwitch } from './switch'
import { IdPicker } from './IdPicker'

export function SettingsView(props: { settings: Settings }) {
    const [apiKey, setApiKey] = useState(props.settings.api_key)
    if (apiKey) {
        props.settings.api_key = apiKey
        saveSettings()
        return <GenerationSettings settings={props.settings.generation_settings} />
    } else {
        return <ApiKey apiKey={apiKey} setApiKey={setApiKey} />
    }
}

function ApiKey(props: {
    apiKey: string
    setApiKey: React.Dispatch<React.SetStateAction<string>>
}) {
    const [input, setInput] = useState(props.apiKey)
    const onSubmit = () => props.setApiKey(input)
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '32ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                id="outlined-basic"
                label="ElevenLabs API Key"
                variant="outlined"
                onChange={onChange}
            />
            <Button variant="contained" onClick={onSubmit}>
                Set API Key
            </Button>
        </Box>
    )
}

function GenerationSettings(props: { settings: GenerationSettings }) {
    const voices = useSyncExternalStore(VoicesStore.subscribe, VoicesStore.getSnapshot)
    const voiceId = props.settings.voice_id
    const setVoiceId = (val: string) => {
        props.settings.voice_id = val
        saveSettings()
    }
    const models = useSyncExternalStore(ModelsStore.subscribe, ModelsStore.getSnapshot)
    const modelId = props.settings.model_id
    const setModelId = (val: string) => {
        props.settings.model_id = val
        saveSettings()
    }
    const stability = props.settings.voice_settings.stability
    const setStability = (val: number) => {
        props.settings.voice_settings.stability = val
        saveSettings()
    }
    const similarityBoost = props.settings.voice_settings.similarity_boost
    const setSimilarityBoost = (val: number) => {
        props.settings.voice_settings.similarity_boost = val
        saveSettings()
    }
    const speakerBoost = props.settings.voice_settings.use_speaker_boost
    const setSpeakerBoost = (val: boolean) => {
        props.settings.voice_settings.use_speaker_boost = val
        saveSettings()
    }
    return (
        <Stack spacing={2}>
            {voices.length ? (
                <IdPicker
                    name="VoiceId"
                    options={voices}
                    initial={voiceId}
                    label={'Voice'}
                    updater={setVoiceId}
                />
            ) : (
                <Typography>Retrieving voices...</Typography>
            )}
            {models.length ? (
                <IdPicker
                    name="ModelId"
                    options={models}
                    initial={modelId}
                    label={'Model'}
                    updater={setModelId}
                />
            ) : (
                <Typography>Retrieving models...</Typography>
            )}
            <ZeroToOneSlider
                name="Stability"
                initial={stability}
                label={'Stability'}
                updater={setStability}
            />
            <ZeroToOneSlider
                name="SimilarityBoost"
                initial={similarityBoost}
                label={'Similarity Boost'}
                updater={setSimilarityBoost}
            />
            <ToggleSwitch
                name={'speakerBoost'}
                initial={speakerBoost}
                label={'Speaker Boost'}
                updater={setSpeakerBoost}
            />
        </Stack>
    )
}
