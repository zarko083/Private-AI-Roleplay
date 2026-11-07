import { formatIncludedNamesBlock, formatSpeakerPrefix, sanitizeSpeakerName } from './NameContext'

describe('PARC Include Names', () => {
    it('includes both character card and user persona names', () => {
        const result = formatIncludedNamesBlock('Aria', 'Alex')
        expect(result).toContain('Character Card name: "Aria"')
        expect(result).toContain('User persona name: "Alex"')
        expect(result).toContain('do not repeat them unnecessarily')
        expect(result).not.toContain('address them by this name')
    })

    it('works with only one defined name and skips blank identity blocks', () => {
        expect(formatIncludedNamesBlock('Aria', '')).toContain('Character Card name: "Aria"')
        expect(formatIncludedNamesBlock('', 'Alex')).toContain('User persona name: "Alex"')
        expect(formatIncludedNamesBlock(' ', undefined)).toBe('')
    })

    it('formats speaker names only when present', () => {
        expect(formatSpeakerPrefix('Aria')).toBe('Aria: ')
        expect(formatSpeakerPrefix(undefined)).toBe('')
    })

    it('preserves Unicode names while stripping control chars and markup', () => {
        expect(sanitizeSpeakerName(' Nguyễn\n  Anh\t ')).toBe('Nguyễn Anh')
        expect(sanitizeSpeakerName('<A>{B}')).toBe('AB')
    })

    it('bounds the size of injected names', () => {
        expect(sanitizeSpeakerName('X'.repeat(100))).toHaveLength(64)
    })
})
