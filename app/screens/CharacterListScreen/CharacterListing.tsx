import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { useShallow } from 'zustand/react/shallow'

import Avatar from '@components/views/Avatar'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Characters, CharInfo } from '@lib/state/Characters'
import { CharacterSorter } from '@lib/state/CharacterSorter'
import { Theme } from '@lib/theme/ThemeManager'

import CharacterEditPopup from './CharacterEditPopup'
import CharacterListingTags from './CharacterListingTags'

type CharacterListingProps = {
    character: CharInfo
    nowLoading: boolean
    setNowLoading: (b: boolean) => void
}

/** Poster-style character card; original tap/long-press action is retained. */
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
    const { color } = Theme.useTheme()
    const hasChat = character.latestSwipe !== undefined && Boolean(character.latestName)
    const preview = hasChat
        ? `${character.latestName}: ${character.latestSwipe?.trim() ?? ''}`
        : t('character.list.emptyStates.noMessages')

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
                    <LinearGradient
                        colors={['transparent', 'rgba(9, 7, 18, 0.65)', 'rgba(9, 7, 18, 0.99)']}
                        locations={[0, 0.38, 1]}
                        style={styles.gradient}>
                        <Text style={styles.name} numberOfLines={2}>
                            {character.name}
                        </Text>
                        <Text style={styles.preview} numberOfLines={2}>
                            {preview}
                        </Text>
                        <View style={styles.bottomRow}>
                            <Text style={styles.action} numberOfLines={1}>
                                {hasChat ? 'CONTINUE STORY' : 'START STORY'}
                            </Text>
                            <Text style={{ color: color.primary._900, fontSize: 18 }}>›</Text>
                        </View>
                    </LinearGradient>
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
            borderRadius: 20,
            borderWidth: 1,
            borderColor: color.neutral._400,
            backgroundColor: color.neutral._200,
        },
        cover: {
            width: '100%',
            aspectRatio: 0.68,
            backgroundColor: color.neutral._300,
        },
        gradient: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 13,
            paddingTop: 80,
            paddingBottom: 13,
            justifyContent: 'flex-end',
        },
        name: {
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: '800',
            letterSpacing: -0.3,
        },
        preview: {
            color: '#D3CEDD',
            marginTop: 5,
            fontSize: 11,
            lineHeight: 15,
            minHeight: 15,
        },
        bottomRow: {
            marginTop: 12,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(255,255,255,0.22)',
            paddingTop: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        action: {
            fontSize: 10,
            fontWeight: '800',
            color: '#C9B2FF',
            letterSpacing: 1,
            flex: 1,
        },
    })
}
