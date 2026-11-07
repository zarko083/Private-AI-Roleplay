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

/**
 * PARC character tile.
 * The character image uses a true 1:1 square. Labels and the action sit
 * underneath the avatar so they never hide a face or crop over the portrait.
 * CharacterEditPopup continues to own tap and long-press actions.
 */
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
    const hasChat = character.latestSwipe !== undefined && Boolean(character.latestName)
    const preview = hasChat
        ? `${character.latestName}: ${character.latestSwipe?.trim() ?? ''}`
        : t('character.list.emptyStates.noMessages')

    return (
        <View style={styles.root}>
            <CharacterEditPopup
                character={character}
                setNowLoading={setNowLoading}
                nowLoading={nowLoading}>
                <View style={styles.card}>
                    <View style={styles.avatarFrame}>
                        <Avatar
                            targetImage={Characters.getImageDir(character.image_id)}
                            style={styles.squareAvatar}
                            contentFit="cover"
                            accessibilityLabel={`${character.name} avatar`}
                        />
                        <View style={styles.cornerAccent} pointerEvents="none" />
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.name} numberOfLines={1}>
                            {character.name}
                        </Text>
                        <Text style={styles.preview} numberOfLines={1}>
                            {preview}
                        </Text>
                        <LinearGradient
                            colors={['#D552A3', '#8E1EA2', '#542177']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.actionPill}>
                            <Text style={styles.actionText} numberOfLines={1}>
                                {hasChat ? 'CONTINUE' : 'START STORY'}
                            </Text>
                            <Text style={styles.chevron}>›</Text>
                        </LinearGradient>
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
        root: {
            flex: 1,
            minWidth: 0,
        },
        card: {
            overflow: 'hidden',
            borderRadius: 18,
            borderWidth: 1,
            borderColor: 'rgba(152, 232, 222, 0.22)',
            backgroundColor: color.neutral._200,
        },
        avatarFrame: {
            width: '100%',
            aspectRatio: 1,
            overflow: 'hidden',
            backgroundColor: color.neutral._300,
        },
        squareAvatar: {
            width: '100%',
            height: '100%',
        },
        cornerAccent: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 28,
            height: 3,
            borderTopLeftRadius: 3,
            backgroundColor: '#98E8DE',
        },
        details: {
            paddingTop: 11,
            paddingBottom: 12,
            paddingHorizontal: 11,
        },
        name: {
            color: color.text._100,
            fontSize: 16,
            fontWeight: '800',
            letterSpacing: -0.3,
        },
        preview: {
            marginTop: 4,
            color: color.text._400,
            fontSize: 11,
            lineHeight: 16,
            minHeight: 16,
        },
        actionPill: {
            marginTop: 11,
            borderRadius: 99,
            paddingVertical: 9,
            paddingHorizontal: 10,
            minHeight: 35,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: 6,
        },
        actionText: {
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.5,
            flexShrink: 1,
        },
        chevron: {
            color: '#98E8DE',
            fontSize: 18,
            fontWeight: '700',
            lineHeight: 18,
        },
    })
}
