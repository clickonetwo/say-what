import React, { useSyncExternalStore } from 'react'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import { HistoryStore } from '../model/history'
import { GeneratedItem } from '../model/speech'

export function History() {
    const history = useSyncExternalStore(HistoryStore.subscribe, HistoryStore.getSnapshot)
    const [favorites, recents] = history.reduce(
        (acc, gi) => (gi.favorite ? (acc[0].push(gi), acc) : (acc[1].push(gi), acc)),
        [[] as GeneratedItem[], [] as GeneratedItem[]],
    )
    return (
        <>
            <Typography variant="h4" gutterBottom>
                Favorites
            </Typography>
            {favorites.map((gi) => (
                <Favorite item={gi} />
            ))}
            <Typography variant="h4" gutterBottom>
                Recents
            </Typography>
            {recents.map((gi) => (
                <Recent item={gi} />
            ))}
        </>
    )
}

export function Favorite(props: { item: GeneratedItem }) {
    return (
        <>
            <TextField multiline fullWidth value={props.item.text} label="Text" disabled />
            <Typography>
                {`Generation of ${props.item.kb_blob_size}KB took ${props.item.ms_time}ms`}
            </Typography>
            {props.item.blob_url.length > 0 && <audio controls src={props.item.blob_url} />}
        </>
    )
}

export function Recent(props: { item: GeneratedItem }) {
    return (
        <>
            <TextField multiline fullWidth value={props.item.text} label="Text" disabled />
            <Typography>
                {`Generation of ${props.item.kb_blob_size} KB took ${props.item.ms_time} ms`}
            </Typography>
            {props.item.blob_url.length > 0 && <audio controls src={props.item.blob_url} />}
        </>
    )
}
