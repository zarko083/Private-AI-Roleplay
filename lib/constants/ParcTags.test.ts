import { getParcTagGroup, PARC_DEFAULT_TAGS, PARC_TAG_GROUPS, uniqueParcTags } from './ParcTags'

describe('PARC tag catalogue', () => {
    it('contains exactly 59 distinct curated suggestions in six groups', () => {
        expect(PARC_TAG_GROUPS).toHaveLength(6)
        expect(PARC_DEFAULT_TAGS).toHaveLength(59)
        expect(uniqueParcTags(PARC_DEFAULT_TAGS)).toHaveLength(59)
    })

    it('groups known tags while keeping arbitrary imported tags as Custom', () => {
        expect(getParcTagGroup('Romance')).toBe('Genre')
        expect(getParcTagGroup(' university ')).toBe('Setting')
        expect(getParcTagGroup('Slow Burn')).toBe('Roleplay Style')
        expect(getParcTagGroup('My Imported Tag')).toBe('Custom')
    })

    it('trims and deduplicates tags without changing display casing', () => {
        expect(uniqueParcTags([' Romance ', 'romance', ' AI ', '', 'aI', 'Original']))
            .toEqual(['Romance', 'AI', 'Original'])
    })
})
