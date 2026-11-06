import { formatPinnedMemoryPrompt } from './PinnedMemory'

describe('formatPinnedMemoryPrompt', () => {
    const memory = 'The user found the map MAP-47, not Aria\'s pendant.'
    const question = 'What is the exact name of the object I found?'

    test('leaves a message unchanged with no saved facts', () => {
        expect(formatPinnedMemoryPrompt([], question)).toBe(question)
        expect(formatPinnedMemoryPrompt([' ', '\n'], question)).toBe(question)
    })

    test('places saved facts before the latest question exactly once', () => {
        const result = formatPinnedMemoryPrompt([memory], question)
        expect(result).toContain(memory)
        expect(result).toContain(question)
        expect(result.indexOf(memory)).toBeLessThan(result.indexOf(question))
        expect(result.split('[LATEST USER MESSAGE]').length).toBe(2)
        expect(result.split('MAP-47').length).toBe(2)
    })

    test('combines character and chat memories without nesting prompts', () => {
        const result = formatPinnedMemoryPrompt(
            ['Aria is a silver-haired mage.', memory],
            question
        )
        expect(result).toContain('Aria is a silver-haired mage.')
        expect(result).toContain(memory)
        expect(result.split('[ESTABLISHED CHARACTER AND STORY FACTS]').length).toBe(2)
        expect(result.split('[LATEST USER MESSAGE]').length).toBe(2)
    })
})
