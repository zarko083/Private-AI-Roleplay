import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

type Props = {
    description?: string
    personality?: string
    scenario?: string
    firstMessage?: string
    exampleMessages?: string
}

const essentials: Array<{ key: keyof Props; name: string; advice: string }> = [
    {
        key: 'description',
        name: 'Description',
        advice: 'Physical details, background, identity and any fixed character facts.',
    },
    {
        key: 'personality',
        name: 'Personality',
        advice: 'Voice, temperament, motivations, habits and what the character avoids.',
    },
    {
        key: 'scenario',
        name: 'Scenario',
        advice: 'Where the story takes place, who knows whom and the current objective.',
    },
    {
        key: 'firstMessage',
        name: 'First Message',
        advice: 'A grounded opening that demonstrates the character voice and setting.',
    },
    {
        key: 'exampleMessages',
        name: 'Example Messages',
        advice: 'One or two short replies showing how the character speaks and acts.',
    },
]

/** A read-only completeness checklist; no changes to character card or save logic. */
const CharacterConsistencyGuide: React.FC<Props> = (props) => {
    const { color } = Theme.useTheme()
    const [expanded, setExpanded] = useState(false)
    const finished = essentials.filter(({ key }) => (props[key] ?? '').trim().length > 0).length

    return (
        <View
            style={{
                borderRadius: 18,
                backgroundColor: color.neutral._200,
                borderWidth: 1,
                borderColor: color.neutral._400,
                padding: 16,
                marginVertical: 8,
            }}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show character consistency checklist"
                onPress={() => setExpanded((value) => !value)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: color.primary._800, fontSize: 11, letterSpacing: 1.8, fontWeight: '800' }}>
                        CHARACTER CONSISTENCY
                    </Text>
                    <Text style={{ color: color.text._100, fontSize: 17, marginTop: 6, fontWeight: '800' }}>
                        {finished}/5 story foundations filled
                    </Text>
                    <Text style={{ color: color.text._400, fontSize: 12, lineHeight: 18, marginTop: 6 }}>
                        {finished === 5
                            ? 'Character card is ready for a consistency test.'
                            : 'Incomplete fields often cause unexpected role-play details.'}
                    </Text>
                </View>
                <Text style={{ color: color.primary._800, fontSize: 22 }}>
                    {expanded ? '−' : '+'}
                </Text>
            </Pressable>
            <View
                style={{
                    height: 6,
                    backgroundColor: color.neutral._400,
                    borderRadius: 99,
                    marginTop: 13,
                    overflow: 'hidden',
                }}>
                <View
                    style={{
                        width: `${finished * 20}%` as `${number}%`,
                        height: '100%',
                        backgroundColor: color.primary._500,
                        borderRadius: 99,
                    }}
                />
            </View>
            {expanded && (
                <View style={{ marginTop: 14, gap: 11 }}>
                    {essentials.map(({ key, name, advice }) => {
                        const ready = (props[key] ?? '').trim().length > 0
                        return (
                            <View key={key} style={{ flexDirection: 'row', gap: 10 }}>
                                <Text style={{ color: ready ? color.primary._800 : color.text._500, fontWeight: '800' }}>
                                    {ready ? '✓' : '○'}
                                </Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: color.text._100, fontWeight: '700', fontSize: 13 }}>
                                        {name}
                                    </Text>
                                    <Text style={{ color: color.text._400, fontSize: 12, marginTop: 2, lineHeight: 17 }}>
                                        {advice}
                                    </Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
            )}
        </View>
    )
}

export default CharacterConsistencyGuide
