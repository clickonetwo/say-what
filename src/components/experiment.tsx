import React, { useState } from 'react'
import { generateSpeech } from '../model/speech'

function Experiment() {
    const [url, setUrl] = useState('')
    const [text, setText] = useState('')
    const [state, setState] = useState('Ready')
    const [elapsed, setElapsed] = useState(0)

    function generate() {
        setState('Processing...')
        setUrl('')
        console.log(`Generating voice for: ${text}`)
        const start = performance.now()
        generateSpeech(text)
            .then((blob) => {
                const duration = performance.now() - start
                setUrl(window.URL.createObjectURL(blob))
                console.log(`Generation complete in ${duration} milliseconds.`)
                setElapsed(Math.ceil(duration))
                setState('Ready')
            })
            .catch((error) => {
                setState(`Failed: ${error}`)
            })
    }

    function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(e.target.value)
    }

    return (
        <div>
            <h1>Test Voice Generation</h1>
            <textarea rows={4} cols={80} onChange={onChange}></textarea>
            <p>State: {state}</p>
            <button onClick={generate}>Generate</button>
            <p>{url.length > 0 ? `Generation took ${elapsed} milliseconds` : ''}</p>
            <audio controls={url.length > 0} src={url} />
        </div>
    )
}
