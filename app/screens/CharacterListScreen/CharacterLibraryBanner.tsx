import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, View } from 'react-native'

type CharacterLibraryBannerProps = {
    characterCount: number
}

/**
 * Offline-first PARC hero artwork.
 * Modern geometric / digital-audio visual, not fantasy scenery.
 * All art is rendered locally so the character library never needs Internet.
 */
const CharacterLibraryBanner: React.FC<CharacterLibraryBannerProps> = ({ characterCount }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2A1039', '#542177', '#8E1EA2']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Abstract contemporary illustration: glass tiles, signal ring and glow. */}
            <View pointerEvents="none" style={styles.artwork}>
                <View style={styles.orbitOuter} />
                <View style={styles.orbitInner} />
                <LinearGradient
                    colors={['#D552A3', '#8E1EA2', '#542177']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.orb}
                />
                <View style={styles.orbHighlight} />
                <View style={styles.glassPanel}>
                    <View style={styles.signalBars}>
                        <View style={[styles.signal, { height: 13 }]} />
                        <View style={[styles.signal, { height: 24 }]} />
                        <View style={[styles.signal, { height: 18 }]} />
                        <View style={[styles.signal, { height: 31 }]} />
                        <View style={[styles.signal, { height: 15 }]} />
                    </View>
                </View>
                <View style={styles.mintDot} />
                <View style={styles.pinkDot} />
            </View>

            <View style={styles.copy}>
                <View style={styles.eyebrowRow}>
                    <View style={styles.mintRule} />
                    <Text style={styles.eyebrow}>PARC / YOUR SPACE</Text>
                </View>
                <Text style={styles.heading} numberOfLines={1}>Characters</Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                    Your characters, your stories. Pick up where you left off.
                </Text>
                <View style={styles.countPill}>
                    <View style={styles.pillDot} />
                    <Text style={styles.pillText}>
                        {characterCount} {characterCount === 1 ? 'Character' : 'Characters'}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default CharacterLibraryBanner

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        marginTop: 6,
        marginBottom: 15,
        minHeight: 174,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(213, 82, 163, 0.50)',
        overflow: 'hidden',
        backgroundColor: '#542177',
    },
    copy: {
        width: '69%',
        minHeight: 174,
        paddingTop: 18,
        paddingBottom: 16,
        paddingHorizontal: 17,
        justifyContent: 'center',
        zIndex: 2,
    },
    eyebrowRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 6,
    },
    mintRule: {
        width: 13,
        height: 3,
        borderRadius: 3,
        backgroundColor: '#98E8DE',
    },
    eyebrow: {
        color: '#EAC9FA',
        fontWeight: '800',
        fontSize: 9,
        letterSpacing: 1.2,
    },
    heading: {
        color: '#FFFFFF',
        fontSize: 28,
        letterSpacing: -0.8,
        fontWeight: '800',
        marginTop: 10,
    },
    subtitle: {
        marginTop: 5,
        maxWidth: 225,
        color: '#E9D9ED',
        fontSize: 11,
        lineHeight: 16,
    },
    countPill: {
        marginTop: 13,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 7,
        backgroundColor: 'rgba(22, 9, 33, 0.58)',
        borderWidth: 1,
        borderColor: 'rgba(152, 232, 222, 0.42)',
        borderRadius: 99,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    pillDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#98E8DE',
    },
    pillText: {
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    artwork: {
        position: 'absolute',
        right: -18,
        top: -9,
        width: 192,
        height: 196,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    orbitOuter: {
        position: 'absolute',
        width: 178,
        height: 178,
        borderWidth: 1,
        borderColor: 'rgba(152, 232, 222, 0.36)',
        borderRadius: 90,
        right: -15,
        top: 10,
    },
    orbitInner: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.30)',
        borderRadius: 70,
        right: 10,
        top: 34,
    },
    orb: {
        width: 100,
        height: 100,
        borderRadius: 50,
        transform: [{ rotate: '-18deg' }],
        shadowColor: '#D552A3',
        shadowOpacity: 0.65,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 0 },
        elevation: 7,
        position: 'absolute',
        right: 24,
        top: 49,
    },
    orbHighlight: {
        position: 'absolute',
        right: 51,
        top: 58,
        width: 48,
        height: 22,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
        transform: [{ rotate: '-26deg' }],
    },
    glassPanel: {
        position: 'absolute',
        right: 8,
        bottom: 17,
        width: 115,
        height: 55,
        borderRadius: 15,
        backgroundColor: 'rgba(33, 12, 49, 0.66)',
        borderColor: 'rgba(152, 232, 222, 0.46)',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '-12deg' }],
    },
    signalBars: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 7,
    },
    signal: {
        width: 5,
        borderRadius: 3,
        backgroundColor: '#98E8DE',
    },
    mintDot: {
        position: 'absolute',
        right: 152,
        top: 30,
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#98E8DE',
    },
    pinkDot: {
        position: 'absolute',
        right: 11,
        top: 35,
        height: 11,
        width: 11,
        borderRadius: 6,
        backgroundColor: '#D552A3',
    },
})
