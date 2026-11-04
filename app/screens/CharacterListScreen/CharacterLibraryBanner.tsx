
import { StyleSheet, Text, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

type CharacterLibraryBannerProps = {
    characterCount: number
}

/** Compact private character-library introduction for mobile screens. */
const CharacterLibraryBanner: React.FC<CharacterLibraryBannerProps> = ({ characterCount }) => {
    const { color } = Theme.useTheme()

    const styles = StyleSheet.create({
        container: {
            marginHorizontal: 8,
            marginTop: 4,
            marginBottom: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderRadius: 18,
            backgroundColor: color.neutral._200,
            borderColor: color.neutral._400,
            borderWidth: 1,
        },
        eyebrow: {
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 1.7,
            color: color.primary._800,
            marginBottom: 7,
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            columnGap: 10,
        },
        heading: {
            flex: 1,
            minWidth: 0,
            color: color.text._100,
            fontSize: 22,
            fontWeight: '700',
            letterSpacing: -0.5,
        },
        pill: {
            flexShrink: 0,
            backgroundColor: color.primary._100,
            borderColor: color.primary._400,
            borderWidth: 1,
            borderRadius: 99,
            paddingHorizontal: 11,
            paddingVertical: 6,
        },
        pillText: {
            color: color.primary._900,
            fontWeight: '700',
            fontSize: 11,
        },
        subtitle: {
            marginTop: 6,
            color: color.text._400,
            fontSize: 12,
            lineHeight: 17,
        },
    })

    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>YOUR PRIVATE WORLDS</Text>
            <View style={styles.titleRow}>
                <Text style={styles.heading} numberOfLines={1}>
                    Characters
                </Text>
                <View style={styles.pill}>
                    <Text style={styles.pillText}>
                        {characterCount} {characterCount === 1 ? 'CHARACTER' : 'CHARACTERS'}
                    </Text>
                </View>
            </View>
            <Text style={styles.subtitle} numberOfLines={2}>
                Your stories. Your characters. Continue where you left off.
            </Text>
        </View>
    )
}

export default CharacterLibraryBanner
