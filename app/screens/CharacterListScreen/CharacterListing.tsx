import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { useShallow } from 'zustand/react/shallow'

import Avatar from '@components/views/Avatar'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Characters, CharInfo } from '@lib/state/Characters'
import { CharacterSorter } from '@lib/state/CharacterSorter'
import { Theme } from '@lib/theme/ThemeManager'
import { getFriendlyTimeStamp } from '@lib/utils/Time'

import CharacterEditPopup from './CharacterEditPopup'
import CharacterListingTags from './CharacterListingTags'

type CharacterListingProps = {
    character: CharInfo
    nowLoading: boolean
    setNowLoading: (b: boolean) => void
}

const CharacterListing: React.FC<CharacterListingProps> = ({
    character,
    nowLoading,
    setNowLoading,
}) => {
    const { t } = useTranslation()
    const [showTags] = useMMKVBoolean(AppSettings.ShowTags)
    const { setShowSearch, setTagFilter, tagFilter } = CharacterSorter.useSorterStore(
        useShallow((state) => ({
            setShowSearch: state.setShowSearch,
            setTagFilter: state.setTagFilter,
            tagFilter: state.tagFilter,
        }))
    )
    const styles = useStyles()

    const getPreviewText = () => {
        if (character.latestSwipe === undefined || !character.latestName)
            return t('character.list.emptyStates.noMessages')
        return character.latestName + ': ' + character.latestSwipe.trim()
    }

    return (
        <View style={{ flex: 1 }}>
            <CharacterEditPopup
                character={character}
                setNowLoading={setNowLoading}
                nowLoading={nowLoading}>
                <View style={styles.card}>
                    <Avatar
                        targetImage={Characters.getImageDir(character.image_id)}
                        style={styles.cover}
                        contentFit="cover"
                    />
                    <View style={styles.info}>
                        <Text style={styles.name} numberOfLines={1}>
                            {character.name}
                        </Text>
                        <Text style={styles.preview} numberOfLines={2} ellipsizeMode="tail">
                            {getPreviewText()}
                        </Text>
                        <Text style={styles.timestamp} numberOfLines={1}>
                            {getFriendlyTimeStamp(character.last_modified)}
                        </Text>
                    </View>
                </View>
            </CharacterEditPopup>
            <CharacterListingTags
                tags={character.tags}
                showTags={Boolean(showTags)}
                onPress={(tag: string) => {
                    setShowSearch(true)
                    if (tagFilter.includes(tag)) return
                    setTagFilter([...tagFilter, tag])
                }}
            />
        </View>
    )
}

export default CharacterListing

const useStyles = () => {
    const { color } = Theme.useTheme()

    return StyleSheet.create({
        card: {
            overflow: 'hidden',
            borderRadius: 18,
            borderWidth: 1,
            borderColor: color.neutral._400,
            backgroundColor: color.neutral._200,
        },
        cover: {
            width: '100%',
            aspectRatio: 0.94,
            backgroundColor: color.neutral._300,
        },
        info: {
            minHeight: 110,
            paddingHorizontal: 12,
            paddingTop: 12,
            paddingBottom: 14,
        },
        name: {
            fontSize: 16,
            fontWeight: '700',
            color: color.text._100,
        },
        preview: {
            fontSize: 12,
            color: color.text._400,
            lineHeight: 18,
            marginTop: 6,
            minHeight: 36,
        },
        timestamp: {
            fontSize: 10,
            color: color.primary._700,
            marginTop: 9,
        },
    })
}
