import { StyleSheet, Text, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

type CharacterLibraryBannerProps = {
    characterCount: number
}

/** A small, read-only introduction to the local character library. */
const CharacterLibraryBanner: React.FC<CharacterLibraryBannerProps> = ({ characterCount }) => {
    const { color } = Theme.useTheme()

    const styles = StyleSheet.create({
        container: {
            marginHorizontal: 8,
            marginTop: 8,
            marginBottom: 18,
            paddingHorizontal: 18,
            paddingVertical: 18,
            borderRadius: 20,
            backgroundColor: color.neutral._200,
            borderColor: color.neutral._400,
            borderWidth: 1,
        },
        eyebrow: {
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 2.2,
            color: color.primary._800,
            marginBottom: 8,
        },
        heading: {
            color: color.text._100,
            fontSize: 26,
            fontWeight: '700',
            letterSpacing: -0.8,
        },
        body: {
            color: color.text._400,
            fontSize: 13,
            marginTop: 7,
            lineHeight: 19,
        },
        pill: {
            marginTop: 14,
            alignSelf: 'flex-start',
            backgroundColor: color.primary._100,
            borderColor: color.primary._400,
            borderWidth: 1,
            borderRadius: 99,
            paddingHorizontal: 12,
            paddingVertical: 7,
        },
        pillText: {
            color: color.primary._900,
            fontWeight: '700',
            fontSize: 11,
        },
    })

    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>YOUR PRIVATE WORLDS</Text>
            <Text style={styles.heading}>Character Library</Text>
            <Text style={styles.body}>
                Your characters, your stories. Choose a character to continue a conversation.
            </Text>
            <View style={styles.pill}>
                <Text style={styles.pillText}>
                    {characterCount} {characterCount === 1 ? 'CHARACTER' : 'CHARACTERS'}
                </Text>
            </View>
        </View>
    )
}

export default CharacterLibraryBanner
