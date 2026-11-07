import MaterialIcons from '@react-native-vector-icons/material-icons/static'
import { randomUUID } from 'expo-crypto'
import { Image } from 'expo-image'
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import Animated from 'react-native-reanimated'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

import ThemedButton from '@components/buttons/ThemedButton'
import Alert from '@components/views/Alert'
import { useBottomSheetRef } from '@components/views/BottomSheet'
import CameraSheet from '@components/views/CameraSheet'
import ContextMenu from '@components/views/ContextMenu'
import { AppSettings } from '@lib/constants/GlobalValues'
import { generateResponse } from '@lib/engine/Inference'
import { useActiveProvider } from '@lib/hooks/ActiveProvider'
import { useUnfocusTextInput } from '@lib/hooks/UnfocusTextInput'
import { Characters } from '@lib/state/Characters'
import { Chats, useInference } from '@lib/state/Chat'
import { useChatInputTextStore } from '@lib/state/components/ChatInput'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'

import ChatOptions from './ChatInputOptions'

export type Attachment = {
    uri: string
    type: 'image' | 'audio' | 'document'
    name: string
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

type ChatInputHeightStoreProps = {
    height: number
    setHeight: (n: number) => void
}

export const useInputHeightStore = create<ChatInputHeightStoreProps>()((set) => ({
    height: 70,
    setHeight: (n) => set({ height: Math.ceil(n) }),
}))

/** PARC composer. Original send / regenerate / attachment paths are preserved. */
const ChatInput = () => {
    const { t } = useTranslation()
    const inputRef = useUnfocusTextInput()
    const { available: activeProvider, mode } = useActiveProvider()
    const { color } = Theme.useTheme()
    const [sendOnEnter] = useMMKVBoolean(AppSettings.SendOnEnter)
    const [disableSend, setDisableSend] = useState(false)
    const [generationSeconds, setGenerationSeconds] = useState(0)
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const cameraSheetRef = useBottomSheetRef()
    const { nowGenerating, abortFunction } = useInference(
        useShallow((state) => ({
            nowGenerating: state.nowGenerating,
            abortFunction: state.abortFunction,
        }))
    )
    const setHeight = useInputHeightStore(useShallow((state) => state.setHeight))
    const charName = Characters.useCharacterStore((state) => state.card?.name)
    const { chatId } = Chats.useChat()
    const userName = Characters.useUserStore((state) => state.card?.name)
    const { newMessage, setNewMessage } = useChatInputTextStore(
        useShallow((state) => ({ newMessage: state.text, setNewMessage: state.setText }))
    )

    // Count elapsed generation time without changing the inference engine.
    useEffect(() => {
        if (!nowGenerating) {
            setGenerationSeconds(0)
            return
        }
        const start = Date.now()
        const timer = setInterval(() => {
            setGenerationSeconds(Math.round((Date.now() - start) / 1000))
        }, 1000)
        return () => clearInterval(timer)
    }, [nowGenerating])

    const abortResponse = async () => {
        Logger.info(t('chat.input.errors.abortGeneration'))
        if (abortFunction) await abortFunction()
    }

    const handleSend = async () => {
        Keyboard.dismiss()
        if (!chatId) return
        setDisableSend(true)
        if (newMessage.trim() !== '' || attachments.length > 0)
            Chats.db.mutate.createEntry(
                chatId,
                userName ?? '',
                true,
                newMessage,
                attachments.map((item) => item.uri)
            )
        try {
            const result = await Chats.db.mutate.createEntry(chatId, charName ?? '', false, '')
            setNewMessage('')
            setAttachments([])
            const swipeId = result?.swipes?.[0]?.id
            if (swipeId) generateResponse(swipeId)
        } catch (e) {
            Logger.errorToast(t('chat.input.errors.failedToSend'))
            Logger.error(e)
        } finally {
            setDisableSend(false)
        }
    }

    const handlePickImage = async () => {
        const permission = await requestMediaLibraryPermissionsAsync()
        if (!permission.granted) {
            Alert.alert({
                title: t('common.errors.permissionRequired'),
                description: t('chat.input.errors.permissionDescription'),
                buttons: [{ label: t('common.actions.close') }],
            })
            return
        }
        const result = await launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        })
        if (result.canceled) return
        const newAttachments = result.assets
            .map((item) => ({
                uri: item.uri,
                type: 'image',
                name: item.fileName,
            }))
            .filter((item) => !attachments.some((a) => a.name === item.name)) as Attachment[]
        setAttachments([...attachments, ...newAttachments])
    }

    return (
        <Pressable
            onPress={() => {
                if (activeProvider) return
                router.push(
                    mode === 'local'
                        ? '/screens/ModelManagerScreen'
                        : '/screens/ConnectionsManagerScreen'
                )
            }}
            onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
            disabled={activeProvider}
            style={{
                position: 'absolute',
                width: '96%',
                alignSelf: 'center',
                bottom: 6,
                padding: 8,
                backgroundColor: color.neutral._200,
                borderWidth: 1,
                borderColor: color.primary._200,
                borderRadius: 18,
                rowGap: 6,
            }}>
            <Text
                style={{
                    color: activeProvider ? color.text._500 : color.primary._800,
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 1.3,
                    marginLeft: 5,
                }}>
                {nowGenerating
                    ? `GENERATING · ${generationSeconds}s · STOP TO END`
                    : activeProvider
                      ? 'MESSAGE'
                      : 'LOAD A MODEL TO CHAT'}
            </Text>

            {attachments.length > 0 && (
                <Animated.FlatList
                    horizontal
                    data={attachments}
                    keyExtractor={(item) => item.uri}
                    contentContainerStyle={{ columnGap: 10, paddingHorizontal: 6 }}
                    renderItem={({ item }) => (
                        <View>
                            <Image
                                source={{ uri: item.uri }}
                                style={{
                                    width: 76,
                                    height: 76,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: color.primary._400,
                                }}
                            />
                            <ThemedButton
                                iconName="close"
                                iconSize={17}
                                buttonStyle={{
                                    position: 'absolute',
                                    alignSelf: 'flex-end',
                                    margin: -5,
                                    backgroundColor: color.neutral._500,
                                    borderRadius: 25,
                                    paddingHorizontal: 2,
                                    paddingVertical: 2,
                                }}
                                onPress={() =>
                                    setAttachments(attachments.filter((a) => a.uri !== item.uri))
                                }
                            />
                        </View>
                    )}
                />
            )}
            <CameraSheet
                ref={cameraSheetRef}
                onTakePicture={(picture) =>
                    setAttachments((current) => [
                        ...current,
                        { name: randomUUID().toString(), uri: picture.uri, type: 'image' },
                    ])
                }
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
                <ChatOptions disabled={!activeProvider} />
                <ContextMenu
                    disabled={!activeProvider}
                    triggerIcon="paper-clip"
                    triggerIconSize={19}
                    triggerStyle={{
                        color: color.text._400,
                        padding: 8,
                        backgroundColor: color.neutral._300,
                        borderRadius: 15,
                        opacity: activeProvider ? 1 : 0.5,
                    }}
                    placement="top"
                    buttons={[
                        {
                            label: t('chat.input.actions.takePicture'),
                            icon: 'camera',
                            onPress: (close) => {
                                cameraSheetRef.current?.open()
                                close()
                            },
                        },
                        {
                            label: t('chat.input.actions.addImage'),
                            icon: 'picture',
                            onPress: (close) => {
                                close()
                                handlePickImage()
                            },
                        },
                    ]}
                />
                <AnimatedTextInput
                    ref={inputRef}
                    style={{
                        color: color.text._100,
                        backgroundColor: color.neutral._100,
                        flex: 1,
                        minHeight: 42,
                        maxHeight: 150,
                        borderWidth: 1,
                        borderColor: activeProvider ? color.primary._600 : color.neutral._400,
                        borderRadius: 16,
                        paddingHorizontal: 12,
                        paddingVertical: 9,
                        fontSize: 14,
                    }}
                    numberOfLines={8}
                    placeholder={
                        activeProvider
                            ? 'Write a message...'
                            : mode === 'local'
                              ? 'Tap to load a local model'
                              : 'Tap to connect a provider'
                    }
                    editable={activeProvider}
                    placeholderTextColor={color.text._500}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                    submitBehavior={sendOnEnter ? 'blurAndSubmit' : 'newline'}
                    onSubmitEditing={sendOnEnter ? handleSend : undefined}
                />
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={nowGenerating ? 'Stop generation' : 'Send message'}
                    disabled={disableSend || !chatId || !activeProvider}
                    style={{
                        width: 43,
                        height: 43,
                        borderRadius: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: !activeProvider
                            ? color.neutral._300
                            : nowGenerating
                              ? color.error._500
                              : color.primary._500,
                    }}
                    onPress={nowGenerating ? abortResponse : handleSend}>
                    <MaterialIcons
                        name={nowGenerating ? 'stop' : 'send'}
                        color={activeProvider ? '#FFFFFF' : color.text._700}
                        size={23}
                    />
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}

export default ChatInput
