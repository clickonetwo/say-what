import Cookies from 'js-cookie'

import { GenerationSettings } from './speech'
import { ApiExternalStore } from './externalStore'

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
        optimize_streaming_latency: '0',
        voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam
        model_id: 'eleven_turbo_v2',
        voice_settings: {
            similarity_boost: 0.5,
            stability: 0.5,
            use_speaker_boost: true,
        },
    },
}

export class SettingsStore {
    static keyChangeCallbacks: (() => void)[] = []
    static anyChangeCallbacks: (() => void)[] = []
    static settings: Settings

    static subscribeKeyChange(cfn: () => void) {
        SettingsStore.keyChangeCallbacks = [...SettingsStore.keyChangeCallbacks, cfn]
        return () => {
            SettingsStore.keyChangeCallbacks = SettingsStore.keyChangeCallbacks.filter(
                (c) => c !== cfn,
            )
        }
    }
    static subscribe(cfn: () => void) {
        SettingsStore.anyChangeCallbacks = [...SettingsStore.anyChangeCallbacks, cfn]
        return () => {
            SettingsStore.anyChangeCallbacks = SettingsStore.anyChangeCallbacks.filter(
                (c) => c !== cfn,
            )
        }
    }

    static notifyKeyChange() {
        SettingsStore.keyChangeCallbacks.map((c) => c())
    }
    static notifyAnyChange() {
        SettingsStore.anyChangeCallbacks.map((c) => c())
    }

    static updateSettings(
        apiKey: string,
        outputFormat: string,
        optimizeStreamingLatency: string,
        voiceId: string,
        modelId: string,
        similarityBoost: number,
        stability: number,
        useSpeakerBoost: boolean,
    ) {
        const notifyApiKeyChange = apiKey != SettingsStore.settings.api_key
        SettingsStore.settings = {
            api_key: apiKey,
            api_root: SettingsStore.settings.api_root,
            generation_settings: {
                output_format: outputFormat,
                optimize_streaming_latency: optimizeStreamingLatency,
                voice_id: voiceId,
                model_id: modelId,
                voice_settings: {
                    similarity_boost: similarityBoost,
                    stability: stability,
                    use_speaker_boost: useSpeakerBoost,
                },
            },
        }
        SettingsStore.saveSettings()
        if (notifyApiKeyChange) {
            SettingsStore.notifyKeyChange()
        }
        SettingsStore.notifyAnyChange()
    }

    static getSnapshot() {
        if (!SettingsStore.settings) {
            SettingsStore.loadSettings()
        }
        return SettingsStore.settings
    }

    static loadSettings() {
        if (!isNode) {
            const stored = localStorage.getItem('say_what_settings')
            if (stored) {
                SettingsStore.settings = JSON.parse(stored)
                return
            }
        }
        SettingsStore.settings = defaultSettings
        if (isNode) {
            const dotenv = require('dotenv')
            dotenv.config()
            SettingsStore.settings.api_key = process.env['ELEVENLABS_API_KEY']!
            SettingsStore.settings.generation_settings.voice_id =
                process.env['ELEVENLABS_VOICE_ID'] || 'pNInz6obpgDQGcFmaJgB'
        } else {
            SettingsStore.settings.api_key = Cookies.get('elevenlabs_api_key') || ''
            SettingsStore.settings.generation_settings.voice_id =
                Cookies.get('elevenlabs_voice_id') || 'pNInz6obpgDQGcFmaJgB'
        }
        SettingsStore.saveSettings()
    }
    static saveSettings() {
        if (isNode) {
            console.log(JSON.stringify(SettingsStore.settings, null, 2))
        } else {
            localStorage.setItem('say_what_settings', JSON.stringify(SettingsStore.settings))
        }
    }
}
