import {
    generateSpeech,
    getHistory,
    getHistoryItemAudio,
    getModels,
    getVoices,
} from './model/speech'
import assert from 'node:assert'
import { writeFileSync } from 'node:fs'

async function testVoices() {
    const voices = await getVoices()
    assert(voices.length)
}

async function testModels() {
    const models = await getModels()
    assert(models.length)
}

async function testHistory() {
    const items = await getHistory(20)
    assert(items.length > 0, 'No History items?')
    const id = items[0].history_item_id
    const blob = await getHistoryItemAudio(id)
    assert(blob.type == 'audio/mpeg', `Unexpected audio type: ${blob.type}`)
    const buffer = new DataView(await blob.arrayBuffer())
    const path = `./local/${id}.mpeg`
    writeFileSync(path, buffer)
    console.log(`Wrote audio to ${path}`)
}

const sentences = [
    "There's a message for you if you look up.",
    "It must be easy to commit crimes as a snake because you don't have to worry about leaving fingerprints.",
    'The complicated school homework left the parents trying to help their kids quite confused.',
    'As he waited for the shower to warm, he noticed that he could hear water change temperature.',
    'This is a Japanese doll.',
    "Don't step on the broken glass.",
    'There are few things better in life than a slice of pie.',
    'The changing of down comforters to cotton bedspreads always meant the squirrels had returned.',
]

async function testGeneration() {
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i]
        console.log(`Generating audio for: ${sentence}`)
        const startTime = performance.now()
        const blob = await generateSpeech(sentence)
        const endTime = performance.now()
        assert(blob.type == 'audio/mpeg', `Unexpected audio type: ${blob.type}`)
        console.log(
            `Generation of ${blob.size} bytes took ${endTime - startTime} milliseconds`,
        )
        const path = `local/test-sentence-${i}.mpeg`
        const buffer = new DataView(await blob.arrayBuffer())
        writeFileSync(path, buffer)
        console.log(`Wrote generated audio to ${path}`)
    }
}

async function testAll(...tests: string[]) {
    if (tests.length == 0) {
        tests = ['voice', 'model', 'history', 'generation']
    }
    if (tests.includes('voice')) {
        await testVoices()
    }
    if (tests.includes('model')) {
        await testModels()
    }
    if (tests.includes('history')) {
        await testHistory()
    }
    if (tests.includes('generation')) {
        await testGeneration()
    }
}

testAll(...process.argv.slice(2))
    .then(() => {
        console.log('Tests completed with no errors')
        process.exit(0)
    })
    .catch((reason) => {
        console.error(`Tests failed: ${reason}`)
        process.exit(1)
    })
