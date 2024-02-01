import { getSettings } from './settings'

export interface Voice {
    voice_id: string
    name: string
}

interface VoicePage {
    voices: Voice[]
}

export async function getVoices() {
    const settings = getSettings()
    const url = `${settings.api_root}/voices`
    const method = 'GET'
    const headers = { 'xi-api-key': settings.api_key }
    const response = await fetch(url, { method, headers })
    if (!response.ok) {
        let detail = JSON.stringify(await response.json())
        let message = `${url} got ${response.status}: ${detail}`
        console.error(message)
        throw Error(message)
    }
    const page: VoicePage = await response.json()
    return page.voices
}

export interface AutoCompleteOptions {
    label: string
    id: string
}

export class VoicesStore {
    static callbacks: (() => void)[] = []
    static voicesData: Voice[] = []
    static optionCache: AutoCompleteOptions[] = []
    static subscribe(callback: () => void) {
        console.log('Subscribed to voices')
        VoicesStore.callbacks = [...VoicesStore.callbacks, callback]
        if (VoicesStore.optionCache.length > 0) {
            VoicesStore.callbacks.map((c) => c())
        } else if (!getSettings().api_key) {
            console.warn("Can't fetch voices without api key")
        } else {
            console.log('Fetching voices...')
            getVoices().then((voices) => {
                VoicesStore.optionCache = voices.map((voice) => {
                    return { label: voice.name, id: voice.voice_id }
                })
                console.log('Fetched voices')
                VoicesStore.callbacks.map((c) => c())
            })
        }
        return () => {
            VoicesStore.callbacks = VoicesStore.callbacks.filter((c) => c !== callback)
        }
    }
    static getSnapshot() {
        return VoicesStore.optionCache
    }
}

export interface Language {
    language_id: string
    name: string
}

export interface Model {
    can_be_finetuned: boolean
    can_do_text_to_speech: boolean
    can_do_voice_conversion: boolean
    can_use_speaker_boost: boolean
    can_use_style: boolean
    description: string
    languages: Language[]
    max_characters_request_free_user: number
    max_characters_request_subscribed_user: number
    model_id: string
    name: string
    requires_alpha_access: boolean
    serves_pro_voices: boolean
    token_cost_factor: number
}

export async function getModels() {
    const settings = getSettings()
    const url = `${settings.api_root}/models`
    const method = 'GET'
    const headers = { 'xi-api-key': settings.api_key }
    const response = await fetch(url, { method, headers })
    if (!response.ok) {
        let detail = JSON.stringify(await response.json())
        let message = `${url} got ${response.status}: ${detail}`
        console.error(message)
        throw Error(message)
    }
    const models: Model[] = await response.json()
    return models
}

export class ModelsStore {
    static callbacks: (() => void)[] = []
    static modelsData: Model[] = []
    static optionCache: AutoCompleteOptions[] = []
    static subscribe(callback: () => void) {
        console.log('Subscribed to models')
        ModelsStore.callbacks = [...ModelsStore.callbacks, callback]
        if (ModelsStore.optionCache.length > 0) {
            ModelsStore.callbacks.map((c) => c())
        } else if (!getSettings().api_key) {
            console.warn("Can't fetch models without api key")
        } else {
            console.log('Fetching models...')
            getModels().then((models) => {
                ModelsStore.optionCache = models.map((model) => {
                    return { label: model.name, id: model.model_id }
                })
                console.log('Fetched models')
                ModelsStore.callbacks.map((c) => c())
            })
        }
        return () => {
            ModelsStore.callbacks = ModelsStore.callbacks.filter((c) => c !== callback)
        }
    }
    static getSnapshot() {
        return ModelsStore.optionCache
    }
}

export interface SpeechSettings {
    similarity_boost: number
    stability: number
    use_speaker_boost: boolean
}

export interface HistoryItem {
    history_item_id: string
    request_id: string
    voice_id: string
    model_id: string
    voice_name: string
    voice_category: string
    text: string
    date_unix: number
    content_type: string
    state: string
    settings: SpeechSettings
}

interface HistoryPage {
    history: HistoryItem[]
    last_history_item_id: string
    has_more: boolean
}

export async function getHistory(limit: number = 100) {
    const settings = getSettings()
    const items: HistoryItem[] = []
    const endpoint = `${settings.api_root}/history`
    const method = 'GET'
    const headers = { 'xi-api-key': settings.api_key }
    let start_after_history_item_id: string = ''
    for (let needed = limit; needed > 0; ) {
        const page_size = (needed < 100 ? needed : 100).toString()
        const query: { [p: string]: string } = start_after_history_item_id
            ? { page_size, start_after_history_item_id }
            : { page_size }
        const url = endpoint + '?' + new URLSearchParams(query).toString()
        const response = await fetch(url, { method, headers })
        if (!response.ok) {
            const err = JSON.stringify(await response.json())
            let message = `${url} got (${response.status}): ${err}`
            console.error(message)
            throw Error(message)
        }
        const body: HistoryPage = await response.json()
        if (!body.has_more) {
            break
        }
        start_after_history_item_id = body.last_history_item_id
        const newItems = body.history
        items.push(...newItems)
        needed -= newItems.length
    }
    return items
}

export async function getHistoryItemAudio(id: string) {
    const settings = getSettings()
    const url = `${settings.api_root}/history/${id}/audio`
    const method = 'GET'
    const headers = { 'xi-api-key': settings.api_key }
    const response = await fetch(url, { method, headers })
    if (!response.ok) {
        const err = JSON.stringify(await response.json())
        let message = `${url} got (${response.status}): ${err}`
        console.error(message)
        throw Error(message)
    }
    const mimeType = response.headers.get('Content-Type')
    if (!mimeType) {
        throw Error(`Audio mime type is: ${mimeType}`)
    }
    const blob = await response.blob()
    if (blob.type != mimeType) {
        console.warn(`Blob type (${blob.type}) isn't ${mimeType}`)
    }
    return blob
}

export interface GenerationSettings {
    output_format: string
    optimize_streaming_latency: number
    voice_id: string
    model_id: string
    voice_settings: SpeechSettings
}

export async function generateSpeech(text: string) {
    const settings = getSettings()
    const voiceId = 'rSBHNPN4dSn9C1StzJ58'
    const endpoint = `${settings.api_root}/text-to-speech/${voiceId}`
    const method = 'POST'
    const headers = { 'xi-api-key': settings.api_key, 'Content-Type': 'application/json' }
    const query: { [p: string]: string } = {
        output_format: settings.generation_settings.output_format,
        optimize_streaming_latency:
            settings.generation_settings.optimize_streaming_latency.toString(),
    }
    const url = endpoint + '?' + new URLSearchParams(query).toString()
    const body = JSON.stringify({
        model_id: settings.generation_settings.model_id,
        text,
        voice_settings: {
            similarity_boost: settings.generation_settings.voice_settings.similarity_boost,
            stability: settings.generation_settings.voice_settings.stability,
            use_speaker_boost: settings.generation_settings.voice_settings.use_speaker_boost,
        },
    })
    const response = await fetch(url, { method, headers, body })
    if (!response.ok) {
        const err = JSON.stringify(await response.json())
        let message = `${url} got (${response.status}): ${err}`
        console.error(message)
        throw Error(message)
    }
    return await response.blob()
}
