import Cookies from 'js-cookie'

import { GenerationSettings, SpeechSettings } from './speech'

export const isNode =
    typeof process !== 'undefined' && typeof process?.versions?.node !== 'undefined'

export interface Settings {
    api_key: string
    api_root: string
    generation_settings: GenerationSettings
}

const defaultSettings: Settings = {
    api_key: '',
    api_root: 'https://api.elevenlabs.io/v1',
    generation_settings: {
        output_format: 'mp3_44100_128',
        optimize_streaming_latency: 0,
        voice_id: '',
        model_id: 'eleven_turbo_v2',
        voice_settings: {
            similarity_boost: 0.5,
            stability: 0.5,
            use_speaker_boost: true,
        },
    },
}

let currentSettings: Settings

export function getSettings(reset_to_defaults: boolean = false) {
    if (!reset_to_defaults) {
        if (currentSettings) {
            return currentSettings
        }
        if (!isNode) {
            const stored = localStorage.getItem('say_what_settings')
            if (stored) {
                currentSettings = JSON.parse(stored)
                return currentSettings
            }
        }
    }
    currentSettings = defaultSettings
    if (isNode) {
        const dotenv = require('dotenv')
        dotenv.config()
        currentSettings.api_key = process.env['ELEVENLABS_API_KEY']!
        currentSettings.generation_settings.voice_id = process.env['ELEVENLABS_VOICE_ID']!
    } else {
        currentSettings.api_key = Cookies.get('elevenlabs_api_key') || ''
        currentSettings.generation_settings.voice_id = Cookies.get('elevenlabs_voice_id') || ''
    }
    saveSettings()
    return currentSettings
}

export function saveSettings() {
    if (isNode) {
        console.log(JSON.stringify(currentSettings, null, 4))
    } else {
        localStorage.setItem('say_what_settings', JSON.stringify(currentSettings))
    }
}
