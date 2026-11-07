import MaterialIcons from '@react-native-vector-icons/material-icons/static'
import { StyleSheet, Text, View } from 'react-native'

import { Chats } from '@lib/state/Chat'
import { Theme } from '@lib/theme/ThemeManager'

import ChatEditPopup from './ChatDrawerOptions'

type ListItem = Awaited<ReturnType<typeof Chats.db.query.chatListQuery>>[0]

type ChatDrawerItemProps = {
    item: ListItem
    onLoad: (id: number) => void
}

const ChatDrawerItem: React.FC<ChatDrawerItemProps> = ({ item, onLoad }) => {
    const styles = useStyles()
    const { spacing, color } = Theme.useTheme()
    const date = new Date(item.last_modified ?? 0)
    const { chatId } = Chats.useChat()
    return (
        <ChatEditPopup item={item} onPress={() => onLoad(item.id)}>
            <View style={item.id === chatId ? styles.chatItemActive : styles.chatItem}>
                <View
                    style={{ flex: 1, paddingHorizontal: 5, paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                        <View style={{
                            width: 5, height: 33, borderRadius: 5,
                            backgroundColor: item.id === chatId ? '#98E8DE' : '#76527A',
                        }} />
                        <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: spacing.xl,
                            justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons
                                name="chat-bubble-outline"
                                size={20}
                                color={color.text._700}
                            />
                            <Text style={styles.smallTextChat}>{item.entryCount}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.smallText}>{date.toLocaleDateString()}</Text>
                            <Text style={styles.smallText}>{date.toLocaleTimeString()}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ChatEditPopup>
    )
}

export default ChatDrawerItem

const useStyles = () => {
    const { color, spacing, borderWidth, borderRadius, fontSize } = Theme.useTheme()

    return StyleSheet.create({
        title: {
            color: color.text._100,
            fontSize: 14,
            fontWeight: '800',
            flexShrink: 1,
        },

        chatItem: {
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 10,
            flex: 1,
            marginBottom: 8,
            borderRadius: 13,
            backgroundColor: '#201A29',
            borderWidth: 1,
            borderColor: '#42304B',
        },

        chatItemActive: {
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 10,
            flex: 1,
            marginBottom: 8,
            borderRadius: 13,
            backgroundColor: '#2A2134',
            borderWidth: 1,
            borderColor: '#9550A3',
        },
        smallText: { color: color.text._500, marginLeft: 7, fontSize: 10 },
        smallTextChat: { color: '#BEA0C8', marginLeft: 5, fontSize: 11 },

        editButton: {
            paddingHorizontal: spacing.m,
            justifyContent: 'center',
        },
    })
}
