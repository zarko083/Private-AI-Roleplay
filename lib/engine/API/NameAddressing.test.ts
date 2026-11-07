import { formatNameAddressingRule } from './NameAddressing'

describe('PARC user name addressing', () => {
    it('skips missing and starter profile names', () => {
        expect(formatNameAddressingRule(undefined)).toBe('')
        expect(formatNameAddressingRule(' ')).toBe('')
        expect(formatNameAddressingRule('User')).toBe('')
    })

    it('keeps the chosen name but discourages repetitive addressing', () => {
        const rule = formatNameAddressingRule('Alex')
        expect(rule).toContain('"Alex"')
        expect(rule).toContain('Do not force their name into every reply')
    })

    it('preserves Unicode names and sanitizes embedded control characters', () => {
        const rule = formatNameAddressingRule(' Nguyễn\n  Anh\t ')
        expect(rule).toContain('"Nguyễn Anh"')
        expect(rule).not.toContain('\t')
        expect(rule).not.toContain('Anh\n')
    })

    it('keeps the instruction short for low-context local models', () => {
        const rule = formatNameAddressingRule('X'.repeat(100))
        expect(rule).toContain('"' + 'X'.repeat(64) + '"')
        expect(rule).not.toContain('X'.repeat(65))
    })
})
