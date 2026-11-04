import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

import Avatar from '@components/views/Avatar'
import { useActiveProvider } from '@lib/hooks/ActiveProvider'
import { Characters } from '@lib/state/Characters'
import { Theme } from '@lib/theme/ThemeManager'

const ChatFooter = ({ chatLength }: { chatLength: number }) => {
    const { color } = Theme.useTheme()
    const card = Characters.useCharacterStore((state) => state.card)
    const { available, mode } = useActiveProvider()
    const router = useRouter()
    const empty = chatLength <= 1

    if (!empty) {
        return (
            <View style={{ alignItems: 'center', paddingVertical: 18 }}>
                <Text style={{ color: color.text._500, fontSize: 11, letterSpacing: 2 }}>
                    BEGINNING OF YOUR STORY
                </Text>
            </View>
        )
    }

    return (
        <View
            style={{
                marginHorizontal: 24,
                marginTop: 20,
                marginBottom: 13,
                paddingHorizontal: 18,
                paddingVertical: 18,
                alignItems: 'center',
                borderRadius: 22,
                borderWidth: 1,
                borderColor: color.neutral._400,
                backgroundColor: color.neutral._200 + 'dd',
            }}>
            <Avatar
                targetImage={Characters.getImageDir(card?.image_id ?? 0)}
                contentFit="cover"
                style={{ width: 64, height: 64, borderRadius: 21 }}
            />
            <Text
                numberOfLines={2}
                style={{
                    color: color.text._100,
                    fontSize: 19,
                    fontWeight: '700',
                    marginTop: 11,
                    textAlign: 'center',
                }}>
                {card?.name || 'A new story'}
            </Text>
            <Text
                style={{
                    marginTop: 7,
                    textAlign: 'center',
                    color: color.text._400,
                    fontSize: 13,
                    lineHeight: 20,
                }}>
                Set the scene, choose your words, and begin a new chapter.
            </Text>
            {!available && (
                <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                        router.push(
                            mode === 'local'
                                ? '/screens/ModelManagerScreen'
                                : '/screens/ConnectionsManagerScreen'
                        )
                    }
                    style={{
                        backgroundColor: color.primary._100,
                        borderWidth: 1,
                        borderColor: color.primary._400,
                        marginTop: 18,
                        paddingVertical: 11,
                        paddingHorizontal: 18,
                        borderRadius: 15,
                    }}>
                    <Text style={{ color: color.primary._900, fontWeight: '700', fontSize: 12 }}>
                        {mode === 'local' ? 'Load a local model' : 'Connect a model provider'}
                    </Text>
                </Pressable>
            )}
        </View>
    )
}

export default ChatFooter
