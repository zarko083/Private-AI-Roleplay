import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Characters } from '@lib/state/Characters'
import { Chats } from '@lib/state/Chat'
import { MAX_MEMORY_CHARS, StoryMemory } from '@lib/state/StoryMemory'
import type { MemoryScope } from '@lib/state/StoryMemory'
import { Theme } from '@lib/theme/ThemeManager'

type Props = { visible: boolean; onClose: () => void }

/** Persistent, editable memory for one chat or one character; never auto-summarises. */
const StoryMemorySheet: React.FC<Props> = ({ visible, onClose }) => {
    const { color } = Theme.useTheme()
    const chatId = Chats.useChatState((state) => state.id)
    const charId = Characters.useCharacterStore((state) => state.id)
    const [scope, setScope] = useState<MemoryScope>('chat')
    const [drafts, setDrafts] = useState({ chat: '', character: '' })
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!visible) return
        let cancelled = false
        setLoading(true)
        setMessage('')
        Promise.all([
            chatId ? StoryMemory.load('chat', chatId) : Promise.resolve(''),
            charId ? StoryMemory.load('character', charId) : Promise.resolve(''),
        ])
            .then(([chat, character]) => {
                if (!cancelled) setDrafts({ chat, character })
            })
            .catch((error) => {
                if (!cancelled) setMessage(`Unable to load memory: ${String(error)}`)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [visible, chatId, charId])

    const ownerId = scope === 'chat' ? chatId : charId
    const draft = drafts[scope]

    const save = async () => {
        if (!ownerId || saving || loading) return
        setSaving(true)
        setMessage('')
        try {
            await StoryMemory.save(scope, ownerId, draft)
            // Confirm persistence instead of reporting success for an unverified write.
            const persisted = await StoryMemory.load(scope, ownerId)
            if (persisted !== draft.trim().slice(0, MAX_MEMORY_CHARS)) {
                throw new Error('Memory read-back did not match the saved text.')
            }
            setMessage(
                persisted
                    ? 'Memory verified on this device. It will be included in the next reply.'
                    : 'Memory cleared and verified on this device.'
            )
        } catch (error) {
            setMessage(`Save failed: ${String(error)}`)
        } finally {
            setSaving(false)
        }
    }

    const scopeButton = (value: MemoryScope, label: string) => (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => {
                setScope(value)
                setMessage('')
            }}
            style={{
                flex: 1,
                paddingVertical: 11,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: scope === value ? color.primary._400 : color.neutral._400,
                backgroundColor: scope === value ? color.primary._100 : color.neutral._200,
                alignItems: 'center',
            }}>
            <Text
                style={{
                    fontWeight: '700',
                    fontSize: 13,
                    color: scope === value ? color.primary._900 : color.text._400,
                }}>
                {label}
            </Text>
        </Pressable>
    )

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#000000aa' }}>
                <Pressable
                    onPress={onClose}
                    accessibilityLabel="Close memory panel"
                    style={{ flex: 1 }}
                />
                <SafeAreaView
                    edges={['bottom']}
                    style={{
                        backgroundColor: color.neutral._100,
                        borderTopLeftRadius: 26,
                        borderTopRightRadius: 26,
                        borderWidth: 1,
                        borderColor: color.neutral._400,
                        maxHeight: '84%',
                    }}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 24 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, paddingRight: 8 }}>
                                <Text style={{ color: color.primary._800, fontSize: 11, letterSpacing: 2, fontWeight: '800' }}>
                                    PARC / MEMORY
                                </Text>
                                <Text style={{ color: color.text._100, fontSize: 25, fontWeight: '800', marginTop: 6 }}>
                                    Story Memory
                                </Text>
                            </View>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Close Story Memory"
                                onPress={onClose}
                                style={{ padding: 10 }}>
                                <Text style={{ color: color.text._300, fontSize: 20 }}>✕</Text>
                            </Pressable>
                        </View>
                        <Text style={{ color: color.text._400, fontSize: 13, lineHeight: 20, marginTop: 12 }}>
                            Save established facts for your story. They accompany future replies,
                            even after older messages leave context.
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                            {scopeButton('chat', 'This story')}
                            {scopeButton('character', 'This character')}
                        </View>
                        <Text style={{ color: color.text._400, fontSize: 12, marginTop: 10, lineHeight: 18 }}>
                            {scope === 'chat'
                                ? 'Applies only to the open conversation. Other stories stay separate.'
                                : 'Applies to every conversation with this character.'}
                        </Text>
                        {loading ? (
                            <ActivityIndicator color={color.primary._700} style={{ marginVertical: 40 }} />
                        ) : (
                            <>
                                <TextInput
                                    multiline
                                    accessibilityLabel="Continuity memory facts"
                                    placeholder="Example: Aria is an adult silver-haired mage. She wears an ancient pendant. The user found a matching map. They agreed to explore the lost temple together."
                                    placeholderTextColor={color.text._600}
                                    textAlignVertical="top"
                                    maxLength={MAX_MEMORY_CHARS}
                                    editable={!!ownerId && !saving}
                                    value={draft}
                                    onChangeText={(text) => {
                                        setDrafts((previous) => ({ ...previous, [scope]: text }))
                                        setMessage('Unsaved changes')
                                    }}
                                    style={{
                                        marginTop: 16,
                                        minHeight: 174,
                                        padding: 14,
                                        color: color.text._100,
                                        borderColor: color.primary._400,
                                        backgroundColor: color.neutral._200,
                                        borderWidth: 1,
                                        borderRadius: 16,
                                        fontSize: 15,
                                        lineHeight: 22,
                                    }}
                                />
                                <Text style={{ color: color.text._500, textAlign: 'right', marginTop: 6, fontSize: 12 }}>
                                    {draft.length}/{MAX_MEMORY_CHARS} characters
                                </Text>
                            </>
                        )}
                        <Text style={{ color: color.text._500, fontSize: 12, lineHeight: 18, marginTop: 12 }}>
                            Saved locally. Clearing this text removes the selected memory. Keep facts short
                            to preserve context for the conversation.
                        </Text>
                        {message ? (
                            <Text style={{ color: color.primary._800, fontSize: 12, marginTop: 10 }}>
                                {message}
                            </Text>
                        ) : null}
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Save story memory"
                            disabled={!ownerId || loading || saving}
                            onPress={save}
                            style={{
                                backgroundColor: ownerId && !saving ? color.primary._500 : color.neutral._400,
                                borderRadius: 14,
                                alignItems: 'center',
                                paddingVertical: 14,
                                marginTop: 16,
                            }}>
                            <Text style={{ color: color.text._100, fontWeight: '800', fontSize: 15 }}>
                                {saving ? 'Saving...' : 'Save memory'}
                            </Text>
                        </Pressable>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default StoryMemorySheet
