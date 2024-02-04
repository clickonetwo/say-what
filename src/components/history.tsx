import React, { useState, useSyncExternalStore } from 'react'

import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import RecentIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DeleteIcon from '@mui/icons-material/Delete'

import { HistoryStore } from '../model/history'
import { GeneratedItem } from '../model/speech'
import Checkbox from '@mui/material/Checkbox'

export function History() {
    const history = useSyncExternalStore(HistoryStore.subscribe, HistoryStore.getSnapshot)
    const [favorites, recents] = history.reduce(
        (acc, gi) => (gi.favorite ? (acc[0].push(gi), acc) : (acc[1].push(gi), acc)),
        [[] as GeneratedItem[], [] as GeneratedItem[]],
    )
    const topItems = favorites.map((gi) => <GeneratedSummary key={gi.history_item_id} item={gi} />)
    const bottomItems = recents.map((gi) => <GeneratedSummary key={gi.history_item_id} item={gi} />)
    const message = (text: string) => (
        <Typography style={{ paddingBottom: '1em' }}>{text}</Typography>
    )
    return (
        <>
            <Typography variant="h4" gutterBottom>
                Favorites
            </Typography>
            {topItems.length ? topItems : message(`You have no favorites`)}
            <Typography variant="h4" gutterBottom>
                Recents
            </Typography>
            {bottomItems.length ? bottomItems : message(`You have no recents`)}
        </>
    )
}

export function GeneratedSummary(props: { item: GeneratedItem }) {
    const [checked, setChecked] = useState(props.item.favorite)
    const [visible, setVisible] = useState(true)
    const label = () => {
        const gen_date = new Date(props.item.gen_date)
        const midnight = new Date().setHours(0, 0, 0, 0)
        const dayString = () => {
            if (gen_date.valueOf() >= midnight) {
                return 'Today'
            } else if (gen_date.valueOf() >= midnight - 24 * 60 * 60 * 1000) {
                return 'Yesterday'
            } else {
                const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' })
                return formatter.format(gen_date)
            }
        }
        const timeString = () => {
            const formatter = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' })
            return formatter.format(gen_date)
        }
        return `Item ${props.item.history_item_id} (${dayString()} ${timeString()})`
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.item.favorite = event.target.checked
        setChecked(event.target.checked)
        HistoryStore.updateFavorites()
    }
    const player = () => {
        return (
            <audio
                controls
                src={props.item.blob_url}
                style={{ height: 27, position: 'relative', top: '8px' }}
            />
        )
    }
    const deleteItem = () => {
        setVisible(false)
        HistoryStore.removeFromHistory(props.item)
    }
    if (visible) {
        return (
            <>
                <TextField multiline fullWidth value={props.item.text} label={label()} disabled />
                <Typography style={{ paddingBottom: '10px' }}>
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        icon={<RecentIcon />}
                        checkedIcon={<FavoriteIcon />}
                    />
                    {`Generation of ${props.item.kb_blob_size} KB took ${props.item.gen_ms} ms`}
                    &nbsp;
                    {props.item.blob_url.length > 0 && player()}
                    <IconButton aria-label="delete" onClick={deleteItem}>
                        <DeleteIcon />
                    </IconButton>
                </Typography>
            </>
        )
    } else {
        return <Typography style={{ paddingBottom: '1em' }}>(Deleted)</Typography>
    }
}
