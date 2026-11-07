import { BALANCED_ROLEPLAY_WRITING_STYLE, formatRoleplayStyleBlock } from './RoleplayStyle'

describe('PARC per-character roleplay writing style', () => {
    it('does not insert style instructions for existing blank cards', () => {
        expect(formatRoleplayStyleBlock('')).toBe('')
        expect(formatRoleplayStyleBlock('  ')).toBe('')
        expect(formatRoleplayStyleBlock(null)).toBe('')
        expect(formatRoleplayStyleBlock(undefined)).toBe('')
    })

    it('includes saved style instructions exactly once', () => {
        const result = formatRoleplayStyleBlock('  Use short sentences.  ')
        expect(result).toBe(
            '[ROLEPLAY WRITING STYLE]\nUse short sentences.\n[/ROLEPLAY WRITING STYLE]'
        )
        expect(result.match(/Use short sentences/g)).toHaveLength(1)
    })

    it('preserves user controls and a balanced prose/dialogue target', () => {
        expect(BALANCED_ROLEPLAY_WRITING_STYLE).toContain('50/50')
        expect(BALANCED_ROLEPLAY_WRITING_STYLE).toContain('Never dictate {{user}}')
    })
})
