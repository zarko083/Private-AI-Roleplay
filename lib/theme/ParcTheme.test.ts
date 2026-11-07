import { DefaultColorSchemes, themeColorSchemaV1 } from './ThemeColor'

describe('PARC visual identity', () => {
    const theme = DefaultColorSchemes.parcDark

    it('has a complete valid dark theme', () => {
        expect(themeColorSchemaV1.safeParse(theme).success).toBe(true)
        expect(DefaultColorSchemes.schemes[0].name).toBe('PARC Dark')
    })

    it('uses the approved PARC palette', () => {
        expect(theme.primary._200).toBe('#542177')
        expect(theme.primary._400).toBe('#8E1EA2')
        expect(theme.primary._700).toBe('#D552A3')
    })

    it('keeps accessible light text on the dark background', () => {
        expect(theme.neutral._100).toBe('#100D17')
        expect(theme.text._100).toBe('#F8F3FA')
    })
})
