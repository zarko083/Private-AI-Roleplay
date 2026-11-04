import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import Avatar from '@components/views/Avatar'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Characters } from '@lib/state/Characters'
import { Chats } from '@lib/state/Chat'
import { useAvatarViewerStore } from '@lib/state/components/AvatarViewer'
import { Theme } from '@lib/theme/ThemeManager'

type ChatFrameProps = {
    children?: ReactNode
    index: number
    entry: Chats.db.live.LiveEntry
    nowGenerating: boolean
    isLast?: boolean
}

/** More compact message framing while preserving Wide and Alternating settings. */
const ChatFrame: React.FC<ChatFrameProps> = ({ children, index, nowGenerating, isLast, entry }) => {
    const { t } = useTranslation()
    const { color, spacing, fontSize } = Theme.useTheme()
    const [wide] = useMMKVBoolean(AppSettings.WideChatMode)
    const [alternate] = useMMKVBoolean(AppSettings.AlternatingChatMode)
    const setShowViewer = useAvatarViewerStore((state) => state.setShow)
    const charImageId = Characters.useCharacterStore((state) => state.card?.image_id) ?? 0
    const userImageId = Characters.useUserStore((state) => state.card?.image_id) ?? 0
    const swipe = entry.swipes[0]
    if (!swipe) return null

    const isReverse = entry.is_user && Boolean(alternate)
    const direction = isReverse ? 'row-reverse' : 'row'
    const align = isReverse ? 'flex-end' : 'flex-start'
    const elapsedSeconds = Math.round(
        Math.max(
            0,
            // eslint-disable-next-line react-hooks/purity
            ((nowGenerating && isLast ? Date.now() : swipe.gen_finished.getTime()) -
                swipe.gen_started.getTime()) /
                1000
        )
    )

    const avatar = (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`View ${entry.name} avatar`}
            onPress={() => setShowViewer(true, entry.is_user)}>
            <Avatar
                style={{
                    width: wide ? 42 : 36,
                    height: wide ? 42 : 36,
                    borderRadius: 13,
                }}
                targetImage={Characters.getImageDir(
                    entry.is_user ? userImageId : charImageId
                )}
                contentFit="cover"
            />
        </TouchableOpacity>
    )

    const label = (
        <View
            style={{
                flexDirection: direction,
                alignItems: 'center',
                flexWrap: 'wrap',
                columnGap: 10,
                rowGap: 2,
                marginBottom: 8,
            }}>
            <Text
                numberOfLines={1}
                style={{ fontSize: fontSize.m, fontWeight: '700', color: color.text._100 }}>
                {entry.name}
            </Text>
            <Text style={{ fontSize: fontSize.s, color: color.text._500 }}>
                {swipe.gen_finished.toLocaleTimeString()}
            </Text>
            <Text style={{ fontSize: 10, color: color.text._700 }}>
                {t('chat.frame.entryNumber', { index })}
            </Text>
            {!entry.is_user && index !== 0 && (
                <Text style={{ fontSize: 10, color: color.text._700 }}>
                    {t('chat.frame.seconds', { seconds: elapsedSeconds })}
                </Text>
            )}
        </View>
    )

    if (wide) {
        return (
            <View
                style={{
                    borderWidth: 1,
                    borderColor: color.neutral._400,
                    borderRadius: 18,
                    marginHorizontal: 8,
                    padding: 11,
                    backgroundColor: color.neutral._100 + 'dd',
                }}>
                <View
                    style={{
                        flexDirection: direction,
                        alignItems: 'center',
                        columnGap: spacing.m,
                        marginBottom: 6,
                    }}>
                    {avatar}
                    <View style={{ flex: 1 }}>{label}</View>
                </View>
                {children}
            </View>
        )
    }

    return (
        <View
            style={{
                flexDirection: direction,
                alignItems: 'flex-start',
                marginHorizontal: 10,
                marginVertical: 5,
                columnGap: 10,
            }}>
            {avatar}
            <View style={{ flex: 1, minWidth: 0, alignItems: align }}>
                {label}
                <View style={{ width: '100%' }}>{children}</View>
            </View>
        </View>
    )
}

export default ChatFrame
