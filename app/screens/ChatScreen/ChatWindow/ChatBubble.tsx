import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { useShallow } from 'zustand/react/shallow'

import { AppSettings } from '@lib/constants/GlobalValues'
import { useAppMode } from '@lib/state/AppMode'
import { Chats } from '@lib/state/Chat'
import { Theme } from '@lib/theme/ThemeManager'

import ChatAttachments from './ChatAttachments'
import { useChatEditorStore } from './ChatEditor'
import ChatQuickActions, { useChatActionsState } from './ChatQuickActions'
import ChatSwipes from './ChatSwipes'
import ChatText from './ChatText'
import ChatTextLast from './ChatTextLast'

type ChatTextProps = {
    index: number
    nowGenerating: boolean
    isLastMessage: boolean
    isGreeting: boolean
    entry: Chats.db.live.LiveEntry
}

/** Restyled message body. Editing, regeneration, swipes and attachments stay intact. */
const ChatBubble: React.FC<ChatTextProps> = ({
    index,
    nowGenerating,
    entry,
    isLastMessage,
    isGreeting,
}) => {
    const { t } = useTranslation()
    const { appMode } = useAppMode()
    const [showTPS] = useMMKVBoolean(AppSettings.ShowTokenPerSecond)
    const { color, spacing, fontSize } = Theme.useTheme()
    const setShowOptions = useChatActionsState(useShallow((state) => state.setActiveIndex))
    const showEditor = useChatEditorStore((state) => state.show)
    const swipe = entry?.swipes?.[0]

    if (!entry || !swipe) return null

    const showSwipe = !entry.is_user && isLastMessage
    const timings = swipe.timings

    return (
        <View>
            <Pressable
                accessibilityRole="button"
                onPress={() => setShowOptions(nowGenerating ? undefined : entry.id)}
                onLongPress={() => {
                    if (!nowGenerating) showEditor(entry.id)
                }}
                style={{
                    backgroundColor: entry.is_user ? '#2A1B35' : '#191522',
                    borderColor: entry.is_user ? '#69366E' : '#352943',
                    borderWidth: 1,
                    borderLeftWidth: entry.is_user ? 1 : 3,
                    borderLeftColor: entry.is_user ? '#69366E' : '#98E8DE',
                    marginBottom: showSwipe ? 2 : 6,
                    paddingVertical: spacing.l,
                    paddingHorizontal: spacing.l,
                    minHeight: 48,
                    borderRadius: 9,
                }}>
                {isLastMessage ? (
                    <ChatTextLast nowGenerating={nowGenerating} swipe={swipe} />
                ) : (
                    <ChatText swipeText={swipe.swipe} />
                )}
                <ChatAttachments entry={entry} />
                <View style={{ flexDirection: 'row' }}>
                    {showTPS && appMode === 'local' && timings && (
                        <Text
                            style={{
                                color: color.text._500,
                                fontWeight: '300',
                                fontSize: fontSize.s,
                                marginTop: 6,
                            }}>
                            {t('chat.bubble.promptSpeed', {
                                tokens: getFiniteValue(timings.prompt_per_second),
                                seconds: getFiniteValue(timings.prompt_ms / 1000),
                            })}
                            {t('chat.bubble.textGenerationSpeed', {
                                tokens: getFiniteValue(timings.predicted_per_second),
                                seconds: getFiniteValue(timings.predicted_ms / 1000),
                            })}
                        </Text>
                    )}
                    <ChatQuickActions
                        nowGenerating={nowGenerating}
                        isLastMessage={isLastMessage}
                        entryId={entry.id}
                        swipe={swipe}
                        index={index}
                    />
                </View>
            </Pressable>
            {showSwipe && (
                <ChatSwipes swipe={swipe} nowGenerating={nowGenerating} isGreeting={isGreeting} />
            )}
        </View>
    )
}

const getFiniteValue = (value: number | null) => {
    if (!value || !isFinite(value)) return (0).toFixed(2)
    return value.toFixed(2)
}

export default ChatBubble
