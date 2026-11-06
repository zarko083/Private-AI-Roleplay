import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import Avatar from '@components/views/Avatar'
import { Llama } from '@lib/engine/Local/LlamaLocal'
import { useActiveProvider } from '@lib/hooks/ActiveProvider'
import { Characters } from '@lib/state/Characters'
import { Theme } from '@lib/theme/ThemeManager'

import StoryMemorySheet from './StoryMemorySheet'

/** Presentation only. Model loading and inference remain owned by ChatterUI. */
const ChatIdentityBar = () => {
    const { color } = Theme.useTheme()
    const router = useRouter()
    const [memoryOpen, setMemoryOpen] = useState(false)
    const { available, mode } = useActiveProvider()
    const card = Characters.useCharacterStore((state) => state.card)
    const localModelName = Llama.useLlamaModelStore((state) => state.model?.name)

    const status = !available
        ? mode === 'local'
            ? 'LOAD MODEL'
            : 'CONNECT API'
        : mode === 'local'
          ? 'LOCAL READY'
          : 'API READY'

    return (
        <>
        <View
            style={{
                marginHorizontal: 14,
                marginTop: 2,
                marginBottom: 8,
                paddingHorizontal: 12,
                paddingVertical: 9,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: color.neutral._400,
                backgroundColor: color.neutral._200,
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 8,
            }}>
            <Avatar
                targetImage={Characters.getImageDir(card?.image_id ?? 0)}
                style={{ width: 43, height: 43, borderRadius: 14 }}
                contentFit="cover"
            />
            <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
                <Text
                    numberOfLines={1}
                    style={{ fontSize: 16, fontWeight: '700', color: color.text._100 }}>
                    {card?.name || 'Your story'}
                </Text>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    accessibilityLabel={mode === 'local' && localModelName ? localModelName : 'Private conversation'}
                    style={{
                        fontSize: 10,
                        marginTop: 3,
                        letterSpacing: 0.3,
                        fontWeight: '700',
                        color: color.text._500,
                    }}>
                    {mode === 'local' && localModelName ? localModelName : 'PRIVATE CONVERSATION'}
                </Text>
            </View>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={status}
                onPress={() =>
                    router.push(
                        mode === 'local'
                            ? '/screens/ModelManagerScreen'
                            : '/screens/ConnectionsManagerScreen'
                    )
                }
                style={{
                    flexShrink: 0,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: available ? color.primary._400 : color.neutral._400,
                    backgroundColor: available ? color.primary._100 : color.neutral._300,
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                }}>
                <Text
                    numberOfLines={2}
                    style={{
                        maxWidth: 70,
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 9,
                        lineHeight: 12,
                        color: available ? color.primary._900 : color.text._400,
                    }}>
                    {status}
                </Text>
            </Pressable>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open Story Memory"
                onPress={() => setMemoryOpen(true)}
                style={{
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: color.primary._400,
                    paddingVertical: 9,
                    paddingHorizontal: 7,
                    backgroundColor: color.neutral._300,
                }}>
                <Text style={{ color: color.primary._800, fontSize: 10, fontWeight: '800' }}>
                    MEMORY
                </Text>
            </Pressable>
        </View>
        <StoryMemorySheet visible={memoryOpen} onClose={() => setMemoryOpen(false)} />
        </>
    )
}

export default ChatIdentityBar
