import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'

type Props = { characterCount: number }

/**
 * PARC Studio: a compact library masthead rather than ChatterUI's gallery hero.
 * No network assets or marketing-style illustrations.
 */
const CharacterLibraryBanner: React.FC<Props> = ({ characterCount }) => (
    <View style={{
        paddingHorizontal: 14,
        paddingTop: 17,
        paddingBottom: 16,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#382846',
    }}>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 8,
            }}>
                <LinearGradient colors={['#D552A3', '#8E1EA2']} style={{
                    width: 30, height: 30, borderRadius: 10, alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900' }}>P</Text>
                </LinearGradient>
                <Text style={{ color: '#CDB3D9', fontSize: 11, letterSpacing: 2.2, fontWeight: '800' }}>
                    PARC / STUDIO
                </Text>
            </View>
            <View style={{
                flexDirection: 'row', gap: 6, alignItems: 'center',
                borderWidth: 1, borderColor: '#2D4E4D',
                backgroundColor: '#122A2C', paddingHorizontal: 10,
                paddingVertical: 6, borderRadius: 8,
            }}>
                <View style={{ width: 5, height: 5, backgroundColor: '#98E8DE', borderRadius: 3 }} />
                <Text style={{ color: '#98E8DE', fontSize: 9, letterSpacing: 1, fontWeight: '800' }}>
                    PRIVATE
                </Text>
            </View>
        </View>

        <View style={{
            flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
            marginTop: 17,
        }}>
            <View style={{ flex: 1 }}>
                <Text style={{
                    color: '#F8F3FA', fontSize: 32, letterSpacing: -1.4,
                    fontWeight: '900', lineHeight: 37,
                }}>
                    Your stories.
                </Text>
                <Text style={{
                    color: '#9D8BA8', fontSize: 12, lineHeight: 18,
                    marginTop: 5,
                }}>
                    Choose a character. Continue the moment.
                </Text>
            </View>
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                minWidth: 64, height: 64,
                borderRadius: 16, backgroundColor: '#2A1934',
                borderWidth: 1, borderColor: '#60426D',
            }}>
                <Text style={{
                    fontSize: 26, fontWeight: '900', lineHeight: 29, color: '#F8F3FA',
                }}>
                    {characterCount}
                </Text>
                <Text style={{
                    color: '#BEA3CE', fontSize: 9, fontWeight: '800',
                    letterSpacing: 1,
                }}>
                    CARDS
                </Text>
            </View>
        </View>
    </View>
)

export default CharacterLibraryBanner
