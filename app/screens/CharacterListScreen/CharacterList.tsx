import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { usePathname } from 'expo-router'
import { useMemo, useState } from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import Drawer from '@components/views/Drawer'
import HeaderButton from '@components/views/HeaderButton'
import HeaderTitle from '@components/views/HeaderTitle'
import { Characters, CharInfo } from '@lib/state/Characters'
import { CharacterSorter } from '@lib/state/CharacterSorter'
import { TagHider } from '@lib/state/TagHider'
import { Theme } from '@lib/theme/ThemeManager'

import CharacterLibraryBanner from './CharacterLibraryBanner'
import CharacterListHeader from './CharacterListHeader'
import CharacterListing from './CharacterListing'
import CharacterNewMenu from './CharacterNewMenu'
import ParcLibraryDock from './ParcLibraryDock'
import CharactersEmpty from './CharactersEmpty'
import CharactersSearchEmpty from './CharactersSearchEmpty'

const PAGE_SIZE = 30

const CharacterList: React.FC = () => {
    const [nowLoading, setNowLoading] = useState(false)
    const { color } = Theme.useTheme()
    const { searchType, searchOrder, tagFilter, textFilter } = CharacterSorter.useSorterStore(
        useShallow((state) => ({
            searchType: state.searchType,
            searchOrder: state.searchOrder,
            tagFilter: state.tagFilter,
            textFilter: state.textFilter,
        }))
    )
    const hiddenTags = TagHider.useHiddenTags()
    const [pages, setPages] = useState(3)
    const [previousLength, setPreviousLength] = useState(0)
    const { data, updatedAt } = useLiveQuery(
        Characters.db.query.cardListQueryWindow(
            'character',
            searchType,
            searchOrder,
            PAGE_SIZE * pages,
            0,
            textFilter,
            tagFilter,
            hiddenTags
        ),
        [searchType, searchOrder, textFilter, tagFilter, hiddenTags, pages]
    )

    const characterList: CharInfo[] = useMemo(() => {
        return data.map((item) => ({
            ...item,
            latestChat: item.chats[0]?.id,
            latestSwipe: item.chats[0]?.messages[0]?.swipes[0]?.swipe,
            latestName: item.chats[0]?.messages[0]?.name,
            last_modified: item.last_modified ?? 0,
            tags: item.tags.map((item) => item.tag.tag),
        }))
    }, [data])

    // Only render this screen while it is the active route.
    const path = usePathname()
    if (path !== '/') return null

    return (
        <View style={{ paddingTop: 6, paddingHorizontal: 11, flex: 1, backgroundColor: color.neutral._100 }}>
            <HeaderTitle />
            <HeaderButton
                headerLeft={() => <Drawer.Button drawerID={Drawer.ID.SETTINGS} />}
                headerRight={() => (
                    <CharacterNewMenu nowLoading={nowLoading} setNowLoading={setNowLoading} />
                )}
            />

            <CharacterLibraryBanner characterCount={characterList.length} />
            <CharacterListHeader resultLength={characterList.length} />
            <View style={{ flex: 1 }}>
                <Animated.FlatList
                    key="parc-studio-list-v2"
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 5, paddingTop: 4, paddingBottom: 44 }}
                    data={characterList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CharacterListing
                            character={item}
                            nowLoading={nowLoading}
                            setNowLoading={setNowLoading}
                        />
                    )}
                    onEndReachedThreshold={1}
                    onEndReached={() => {
                        if (previousLength === data.length) return
                        setPreviousLength(data.length)
                        setPages((previous) => previous + 1)
                    }}
                    windowSize={3}
                    onStartReachedThreshold={0.1}
                    onStartReached={() => {
                        if (pages !== 3) setPages(3)
                    }}
                    ListEmptyComponent={() => data.length === 0 && updatedAt && (
                        textFilter.trim() || tagFilter.length > 0
                            ? <CharactersSearchEmpty />
                            : <CharactersEmpty />
                    )}
                />
            </View>
            <ParcLibraryDock />
        </View>
    )
}

export default CharacterList
