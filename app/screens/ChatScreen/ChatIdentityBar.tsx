import AntDesign from '@react-native-vector-icons/ant-design/static'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import Avatar from '@components/views/Avatar'
import { Llama } from '@lib/engine/Local/LlamaLocal'
import { useActiveProvider } from '@lib/hooks/ActiveProvider'
import { Characters } from '@lib/state/Characters'
import { Theme } from '@lib/theme/ThemeManager'

import StoryMemorySheet from './StoryMemorySheet'

/**
 * PARC Studio chapter header, distinct from the upstream ChatterUI toolbar.
 * Uses original model routing and Story Memory sheet.
 */
const ChatIdentityBar = () => {
    const { color } = Theme.useTheme()
    const router = useRouter()
    const [memoryOpen, setMemoryOpen] = useState(false)
    const { available, mode } = useActiveProvider()
    const card = Characters.useCharacterStore((state) => state.card)
    const modelName = Llama.useLlamaModelStore((state) => state.model?.name)
    const status = !available ? 'NOT CONNECTED' : mode === 'local' ? 'ON DEVICE' : 'API CONNECTED'

    return (
        <>
            <View style={{
                flexDirection: 'row', alignItems: 'center', columnGap: 11,
                paddingHorizontal: 17, paddingTop: 13, paddingBottom: 14,
                borderBottomWidth: 1, borderBottomColor: '#493451',
                backgroundColor: color.neutral._100,
            }}>
                <View style={{
                    width: 54, height: 54, borderRadius: 15,
                    borderWidth: 1.5, borderColor: '#D552A3', overflow: 'hidden',
                }}>
                    <Avatar
                        targetImage={Characters.getImageDir(card?.image_id ?? 0)}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                    />
                </View>
                <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
                    <Text style={{
                        color: '#98E8DE', fontSize: 9,
                        letterSpacing: 1.8, fontWeight: '900',
                    }}>
                        PARC / LIVE STORY
                    </Text>
                    <Text numberOfLines={1} style={{
                        color: color.text._100, fontSize: 19, fontWeight: '800',
                        letterSpacing: -0.4, marginTop: 4,
                    }}>
                        {card?.name || 'Your story'}
                    </Text>
                    <Text numberOfLines={1} style={{
                        color: color.text._500, fontSize: 10, marginTop: 3,
                    }}>
                        {mode === 'local' && modelName ? modelName : 'PRIVATE CONVERSATION'}
                    </Text>
                </View>
                <View style={{ gap: 7, alignItems: 'flex-end' }}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Story Memory"
                        onPress={() => setMemoryOpen(true)}
                        style={{
                            minWidth: 75, alignItems: 'center', justifyContent: 'center',
                            paddingVertical: 9, borderRadius: 11,
                            backgroundColor: '#412450', borderWidth: 1, borderColor: '#724383',
                        }}>
                        <Text style={{ color: '#F0C4E1', fontSize: 10, fontWeight: '900' }}>
                            MEMORY
                        </Text>
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={'Model status: ' + status}
                        onPress={() => router.push(
                            mode === 'local'
                                ? '/screens/ModelManagerScreen'
                                : '/screens/ConnectionsManagerScreen'
                        )}
                        style={{
                            flexDirection: 'row', gap: 5,
                            alignItems: 'center', paddingVertical: 4,
                        }}>
                        <AntDesign
                            name={available ? 'check-circle' : 'exclamation-circle'}
                            size={11}
                            color={available ? '#98E8DE' : '#D552A3'}
                        />
                        <Text style={{
                            color: available ? '#98E8DE' : '#DDA8CE',
                            fontSize: 9, fontWeight: '800',
                        }}>
                            {status}
                        </Text>
                    </Pressable>
                </View>
            </View>
            <StoryMemorySheet visible={memoryOpen} onClose={() => setMemoryOpen(false)} />
        </>
    )
}

export default ChatIdentityBar
