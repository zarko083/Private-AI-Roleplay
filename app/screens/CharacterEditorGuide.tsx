import { Text, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

type Props = { name: string; descriptionTokens: number; edited: boolean }

/** A compact PARC Studio editing masthead. */
const CharacterEditorGuide: React.FC<Props> = ({ name, descriptionTokens, edited }) => {
    const { color } = Theme.useTheme()
    return (
        <View style={{
            marginBottom: 3, paddingHorizontal: 7, paddingTop: 12,
            paddingBottom: 11, borderBottomWidth: 1, borderColor: color.neutral._400,
        }}>
            <Text style={{
                fontSize: 9, fontWeight: '900', letterSpacing: 2.2, color: '#98E8DE',
            }}>PARC / CHARACTER STUDIO</Text>
            <Text numberOfLines={1} style={{
                fontSize: 25, fontWeight: '900', letterSpacing: -0.8,
                color: color.text._100, marginTop: 7,
            }}>{name || 'Untitled character'}</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 7, alignItems: 'center' }}>
                <Text style={{ color: color.text._400, fontSize: 11 }}>
                    {descriptionTokens} tokens in profile
                </Text>
                <View style={{
                    width: 3, height: 3, borderRadius: 2, backgroundColor: '#98E8DE',
                }} />
                <Text style={{
                    color: edited ? '#EBA0D2' : '#98E8DE',
                    fontWeight: '700', fontSize: 11,
                }}>{edited ? 'UNSAVED EDITS' : 'UP TO DATE'}</Text>
            </View>
        </View>
    )
}

export default CharacterEditorGuide
