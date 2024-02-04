import React, { useState } from 'react'
import { generateSpeech } from '../model/speech'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Settings } from '../model/settings'

export function Generate(props: { settings: Settings }) {
    const [text, setText] = useState('')
    const [state, setState] = useState('Please enter text')

    function generate() {
        setState('Processing...')
        console.log(`Generating voice for: ${text}`)
        generateSpeech(text)
            .then((gi) => {
                console.log(`Generation complete in ${gi.gen_ms} milliseconds.`)
                setState('Ready to generate')
            })
            .catch((error) => {
                setState(`Generation failed: ${JSON.stringify(error, null, 2)}`)
            })
    }

    function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        let val = e.target.value
        setText(val)
        setState(val ? 'Ready to generate' : 'Enter text')
    }

    return (
        <>
            {props.settings.api_key ? (
                <>
                    <TextField multiline fullWidth label="Text to Speak" onChange={onChange} />
                    <Button variant="contained" onClick={generate} disabled={!text}>
                        {state}
                    </Button>
                </>
            ) : (
                <Typography>An API key is required for generation</Typography>
            )}
        </>
    )
}
