import { Text, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

type CharacterEditorGuideProps = {
    name: string
    descriptionTokens: number
    edited: boolean
}

type EditorChapterProps = {
    title: string
    description: string
}

/** Visual editor guidance only. Character Card schema and save logic remain unchanged. */
const CharacterEditorGuide: React.FC<CharacterEditorGuideProps> = ({ name, descriptionTokens, edited }) => {
    const { color } = Theme.useTheme()
    return (
        <View style={{ backgroundColor: color.neutral._200, borderColor: color.neutral._400, borderWidth: 1, borderRadius: 20, padding: 16, marginHorizontal: 14, marginBottom: 13 }}>
            <Text style={{ fontSize: 10, letterSpacing: 1.6, fontWeight: '800', color: color.primary._800 }}>CHARACTER WORKSHOP</Text>
            <Text numberOfLines={1} style={{ fontSize: 21, fontWeight: '700', color: color.text._100, marginTop: 8 }}>{name || 'New character'}</Text>
            <Text style={{ fontSize: 12, lineHeight: 18, color: color.text._400, marginTop: 5 }}>
                Give your character a voice, define their world, and write the first scene.
            </Text>
            <View style={{ flexDirection: 'row', columnGap: 8, flexWrap: 'wrap', marginTop: 13 }}>
                <View style={{ backgroundColor: color.neutral._300, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20 }}>
                    <Text style={{ color: color.text._300, fontSize: 11 }}>{descriptionTokens} description tokens</Text>
                </View>
                <View style={{ backgroundColor: edited ? color.primary._100 : color.neutral._300, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20 }}>
                    <Text style={{ color: edited ? color.primary._800 : color.text._300, fontSize: 11, fontWeight: '600' }}>
                        {edited ? 'Unsaved changes' : 'All changes saved'}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export const EditorChapter: React.FC<EditorChapterProps> = ({ title, description }) => {
    const { color } = Theme.useTheme()
    return (
        <View style={{ marginTop: 15, marginBottom: 4, marginHorizontal: 15 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.2, color: color.primary._800 }}>{title}</Text>
            <Text style={{ marginTop: 4, fontSize: 12, lineHeight: 17, color: color.text._400 }}>{description}</Text>
        </View>
    )
}

export default CharacterEditorGuide
