import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { useShallow } from 'zustand/react/shallow'

import Avatar from '@components/views/Avatar'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Characters, CharInfo } from '@lib/state/Characters'
import { CharacterSorter } from '@lib/state/CharacterSorter'
import { Theme } from '@lib/theme/ThemeManager'

import CharacterEditPopup from './CharacterEditPopup'
import CharacterListingTags from './CharacterListingTags'

type Props = {
    character: CharInfo
    nowLoading: boolean
    setNowLoading: (value: boolean) => void
}

/**
 * Editorial row layout with the 1:1 portrait preserved.
 * The original CharacterEditPopup controls navigation and long-press actions.
 */
const CharacterListing: React.FC<Props> = ({ character, nowLoading, setNowLoading }) => {
    const { color } = Theme.useTheme()
    const [showTags] = useMMKVBoolean(AppSettings.ShowTags)
    const { setShowSearch, setTagFilter, tagFilter } = CharacterSorter.useSorterStore(
        useShallow((state) => ({
            setShowSearch: state.setShowSearch,
            setTagFilter: state.setTagFilter,
            tagFilter: state.tagFilter,
        }))
    )
    const hasChat = character.latestSwipe !== undefined && Boolean(character.latestName)
    const preview = hasChat
        ? character.latestSwipe?.trim() || 'Continue your story'
        : 'A new story starts here.'

    return (
        <View style={{ marginBottom: 10 }}>
            <CharacterEditPopup
                character={character}
                nowLoading={nowLoading}
                setNowLoading={setNowLoading}>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: color.neutral._200,
                    borderRadius: 19, overflow: 'hidden',
                    borderWidth: 1, borderColor: '#493452',
                    minHeight: 135,
                }}>
                    <View style={{
                        width: 128, minHeight: 135,
                        overflow: 'hidden', backgroundColor: color.neutral._300,
                    }}>
                        <Avatar
                            targetImage={Characters.getImageDir(character.image_id)}
                            style={{ width: 128, height: 135 }}
                            contentFit="cover"
                            accessibilityLabel={character.name + ' portrait'}
                        />
                        <View pointerEvents="none" style={{
                            height: 3, width: '100%', position: 'absolute',
                            bottom: 0, backgroundColor: '#98E8DE',
                        }} />
                    </View>
                    <View style={{
                        flex: 1, minWidth: 0,
                        paddingHorizontal: 14, paddingVertical: 13,
                        justifyContent: 'space-between',
                    }}>
                        <View>
                            <Text style={{
                                fontSize: 9, letterSpacing: 1.7,
                                fontWeight: '800', color: '#98E8DE',
                            }}>
                                {hasChat ? 'CONTINUE STORY' : 'NEW STORY'}
                            </Text>
                            <Text numberOfLines={1} style={{
                                color: color.text._100, fontSize: 19,
                                letterSpacing: -0.4, fontWeight: '800',
                                marginTop: 6,
                            }}>
                                {character.name}
                            </Text>
                            <Text numberOfLines={2} style={{
                                marginTop: 4, lineHeight: 16,
                                color: color.text._400, fontSize: 11,
                            }}>
                                {preview}
                            </Text>
                        </View>
                        <LinearGradient
                            colors={['#8E1EA2', '#D552A3']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{
                                alignSelf: 'stretch', marginTop: 11,
                                borderRadius: 10, flexDirection: 'row',
                                minHeight: 32, paddingHorizontal: 12,
                                alignItems: 'center', justifyContent: 'space-between',
                            }}>
                            <Text style={{
                                fontSize: 10, color: '#FFFFFF',
                                letterSpacing: 1.0, fontWeight: '900',
                            }}>
                                {hasChat ? 'RESUME' : 'START STORY'}
                            </Text>
                            <Text style={{ fontSize: 16, color: '#FFFFFF' }}>›</Text>
                        </LinearGradient>
                    </View>
                </View>
            </CharacterEditPopup>
            <CharacterListingTags
                tags={character.tags}
                showTags={Boolean(showTags)}
                onPress={(tag) => {
                    setShowSearch(true)
                    if (!tagFilter.includes(tag)) setTagFilter([...tagFilter, tag])
                }}
            />
        </View>
    )
}

export default CharacterListing
