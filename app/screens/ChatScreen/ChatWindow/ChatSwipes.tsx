import AntDesign from '@react-native-vector-icons/ant-design/static'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useCallback } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { ChatSwipe } from '@db/schema'
import { continueResponse, generateResponse, regenerateResponse } from '@lib/engine/Inference'
import { Chats } from '@lib/state/Chat'
import { Theme } from '@lib/theme/ThemeManager'

type SwipesProps = {
    nowGenerating: boolean
    isGreeting: boolean
    swipe: ChatSwipe
}

/** Keeps the original swipe / regenerate / continue behavior. */
const ChatSwipes: React.FC<SwipesProps> = ({ nowGenerating, isGreeting, swipe }) => {
    const { color } = Theme.useTheme()
    const { data: swipeIdListData } = useLiveQuery(Chats.db.live.swipeIdList(swipe.entry_id), [])
    const swipeIdList = swipeIdListData.map((item) => item.id)
    const currentIndex = swipeIdList.indexOf(swipe.id)

    const getTextColor = useCallback(
        (disabled: boolean) => (disabled ? color.text._700 : color.text._300),
        [color]
    )

    if (currentIndex === -1 || (isGreeting && swipeIdList.length === 1)) return null

    const handleSwipeLeft = () => {
        if (currentIndex <= 0) return
        const newSwipeId = swipeIdList[currentIndex - 1]
        if (newSwipeId) Chats.db.mutate.activateSwipe(newSwipeId)
    }

    const handleSwipeRight = async (message: string) => {
        if (currentIndex >= swipeIdList.length - 1) {
            const newSwipe = await Chats.db.mutate.createSwipe(swipe.entry_id, message)
            if (!newSwipe) return
            if (message) continueResponse(newSwipe)
            else generateResponse(newSwipe.id)
        } else {
            const newSwipeId = swipeIdList[currentIndex + 1]
            if (newSwipeId) Chats.db.mutate.activateSwipe(newSwipeId)
        }
    }

    const disableSwipeLeft = nowGenerating || currentIndex === 0
    const disableSwipeRight = nowGenerating || (isGreeting && currentIndex === swipeIdList.length - 1)
    const iconButton = { paddingHorizontal: 8, paddingVertical: 7, alignItems: 'center' as const }

    return (
        <View
            style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
                marginBottom: 10,
                paddingHorizontal: 6,
                backgroundColor: color.neutral._200,
                borderColor: color.neutral._400,
                borderWidth: 1,
                borderRadius: 17,
                maxWidth: 310,
            }}>
            <TouchableOpacity style={iconButton} onPress={handleSwipeLeft} disabled={disableSwipeLeft}>
                <AntDesign name="left" size={17} color={getTextColor(disableSwipeLeft)} />
            </TouchableOpacity>
            {!isGreeting && (
                <TouchableOpacity
                    style={iconButton}
                    onPress={() => regenerateResponse(swipe)}
                    onLongPress={() => regenerateResponse(swipe, false)}
                    disabled={nowGenerating}>
                    <AntDesign name="retweet" size={17} color={getTextColor(nowGenerating)} />
                </TouchableOpacity>
            )}
            <Text
                style={{
                    color: color.text._200,
                    fontSize: 12,
                    fontWeight: '700',
                    minWidth: 42,
                    textAlign: 'center',
                }}>
                {currentIndex + 1} / {swipeIdList.length}
            </Text>
            {!isGreeting && (
                <TouchableOpacity
                    style={iconButton}
                    onPress={() => continueResponse(swipe)}
                    disabled={nowGenerating}>
                    <AntDesign name="forward" size={17} color={getTextColor(nowGenerating)} />
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={iconButton}
                onPress={() => handleSwipeRight('')}
                onLongPress={() => handleSwipeRight(swipe.swipe ?? '')}
                disabled={disableSwipeRight}>
                <AntDesign name="right" size={17} color={getTextColor(disableSwipeRight)} />
            </TouchableOpacity>
        </View>
    )
}

export default ChatSwipes
