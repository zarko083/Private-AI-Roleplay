import {
    formatIncludedNamesBlock,
    formatSpeakerPrefix,
    sanitizeSpeakerName,
    stripLeadingSpeakerPrefix,
} from './NameContext'

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

    it('hides one or multiple generated speaker labels from assistant responses', () => {
        expect(stripLeadingSpeakerPrefix('Thư: I missed you.', 'Thư')).toBe('I missed you.')
        expect(stripLeadingSpeakerPrefix('Thư: Thư: I missed you.', 'Thư')).toBe('I missed you.')
        expect(stripLeadingSpeakerPrefix('  Thư：  Hello.', 'Thư')).toBe('Hello.')
    })

    it('preserves normal dialogue and other character names', () => {
        expect(stripLeadingSpeakerPrefix('I said Thư: please listen.', 'Thư')).toBe(
            'I said Thư: please listen.'
        )
        expect(stripLeadingSpeakerPrefix('Alex: Hello.', 'Thư')).toBe('Alex: Hello.')
        expect(stripLeadingSpeakerPrefix('Thư is here.', 'Thư')).toBe('Thư is here.')
        expect(stripLeadingSpeakerPrefix('Thư: Hi', '')).toBe('Thư: Hi')
    })

    it('bounds the size of injected names', () => {
        expect(sanitizeSpeakerName('X'.repeat(100))).toHaveLength(64)
    })
})
