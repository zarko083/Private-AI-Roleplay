import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import ThemedButton from '@components/buttons/ThemedButton'
import AvatarViewer from '@components/views/AvatarViewer'
import Drawer from '@components/views/Drawer'
import HeaderButton from '@components/views/HeaderButton'
import HeaderTitle from '@components/views/HeaderTitle'
import SettingsDrawer from '@components/views/SettingsDrawer'
import { Characters } from '@lib/state/Characters'
import { Chats } from '@lib/state/Chat'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'
import { ChatImportSchema } from '@lib/utils/ChatSchema'
import { FileUtils } from '@lib/utils/File'
import ChatInput from '@screens/ChatScreen/ChatInput'
import ChatsDrawer from '@screens/ChatScreen/ChatsDrawer'
import ChatWindow from '@screens/ChatScreen/ChatWindow'

import AuthorNoteSheet from './AuthorNote'
import AuthorNoteEditor from './AuthorNote/AuthorNoteEditor'
import ChatIdentityBar from './ChatIdentityBar'
import ChatEditor from './ChatWindow/ChatEditor'

/** Private roleplay layout: visible character identity + model state + original chat engine. */
const ChatScreen = () => {
    const { t } = useTranslation()
    const { color } = Theme.useTheme()
    const insets = useSafeAreaInsets()
    const { unloadCharacter, charId } = Characters.useCharacterStore(
        useShallow((state) => ({
            unloadCharacter: state.unloadCard,
            charId: state.id,
        }))
    )
    const userId = Characters.useUserStore(useShallow((state) => state.id))

    const { height } = useReanimatedKeyboardAnimation()
    const animatedStyle = useAnimatedStyle(() => ({
        paddingBottom: -height.value - insets.bottom,
        flex: 1,
    }))

    const { chatId, setId, resetId, scrollData } = Chats.useChat()
    const { showSettings, showChats } = Drawer.useDrawerStore(
        useShallow((state) => ({
            showSettings: state.values?.[Drawer.ID.SETTINGS],
            showChats: state.values?.[Drawer.ID.CHATLIST],
        }))
    )

    useEffect(() => {
        return () => {
            unloadCharacter()
            resetId()
        }
    }, [unloadCharacter, resetId])

    const handleCreateChat = async () => {
        if (charId)
            Chats.db.mutate.createChat(charId).then((newChatId) => {
                if (newChatId) setId(newChatId)
            })
    }

    const handleImportChat = async () => {
        if (!charId || !userId) {
            Logger.errorToast(t('chat.import.errors.noChatCharacter'))
            return
        }
        const file = await FileUtils.pickText({ type: 'application/json' })
        if (!file.success) return
        const result = ChatImportSchema.safeParse(JSON.parse(file.data))
        if (!result.success) {
            Logger.errorToast(t('chat.import.errors.failedToImport'))
            return
        }
        const chat = result.data
        chat.character_id = charId
        chat.scroll_offset = 0
        delete chat.id
        chat.messages = chat.messages.map((message) => {
            delete message.id
            message.swipes = message.swipes.map((swipe) => {
                delete swipe.id
                return swipe
            })
            message.attachments = []
            return message
        })
        if (chat.user_id) {
            const userExists = await Characters.db.query.card(chat.user_id)
            if (!userExists) chat.user_id = null
        }
        chat.last_modified = Date.now()
        Chats.db.mutate.cloneChat(chat)
    }

    const renderHeaderButtonRight = () =>
        !showSettings && (
            <>
                {!showChats ? (
                    <ThemedButton
                        buttonStyle={{ marginRight: 16 }}
                        iconName="plus"
                        variant="tertiary"
                        iconSize={24}
                        onPress={handleCreateChat}
                    />
                ) : (
                    <ThemedButton
                        buttonStyle={{ marginRight: 16 }}
                        iconName="upload"
                        variant="tertiary"
                        iconSize={20}
                        onPress={handleImportChat}
                    />
                )}
                <Drawer.Button drawerID={Drawer.ID.CHATLIST} openIcon="message" />
            </>
        )

    const renderHeaderButtonLeft = () =>
        !showChats && <Drawer.Button drawerID={Drawer.ID.SETTINGS} />

    return (
        <Drawer.Gesture
            config={[
                { drawerID: Drawer.ID.CHATLIST, openDirection: 'left', closeDirection: 'right' },
                { drawerID: Drawer.ID.SETTINGS, openDirection: 'right', closeDirection: 'left' },
            ]}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: color.neutral._100,
                    paddingBottom: insets.bottom + 4,
                }}>
                <Animated.View style={animatedStyle}>
                    <HeaderTitle />
                    <HeaderButton
                        headerLeft={renderHeaderButtonLeft}
                        headerRight={renderHeaderButtonRight}
                    />
                    {!showSettings && !showChats && <ChatIdentityBar />}
                    <View style={{ flex: 1 }}>
                        {typeof chatId === 'number' && (
                            <ChatWindow chatId={chatId} scrollData={scrollData} />
                        )}
                        <ChatInput />
                        <AvatarViewer />
                        <ChatEditor />
                        <AuthorNoteSheet />
                        <AuthorNoteEditor />
                    </View>
                </Animated.View>
                <SettingsDrawer />
                <ChatsDrawer />
            </View>
        </Drawer.Gesture>
    )
}

export default ChatScreen
