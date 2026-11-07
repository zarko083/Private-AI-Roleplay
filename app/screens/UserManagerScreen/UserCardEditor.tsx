import AntDesign from '@react-native-vector-icons/ant-design/static'
import * as DocumentPicker from 'expo-document-picker'
import { useNavigation } from 'expo-router'
import { usePreventRemove } from 'expo-router/build/react-navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import ThemedButton from '@components/buttons/ThemedButton'
import ThemedTextInput from '@components/input/ThemedTextInput'
import Alert from '@components/views/Alert'
import Avatar from '@components/views/Avatar'
import AvatarPlacementModal from '@components/views/AvatarPlacementModal'
import AvatarViewer from '@components/views/AvatarViewer'
import ContextMenu from '@components/views/ContextMenu'
import { CharacterCardData, Characters } from '@lib/state/Characters'
import { useAvatarViewerStore } from '@lib/state/components/AvatarViewer'
import { useAvatarPlacementStore } from '@lib/state/AvatarPlacement'
import type { AvatarPlacement } from '@lib/utils/AvatarPlacement'
import { Theme } from '@lib/theme/ThemeManager'

const UserCardEditor = () => {
    const { t } = useTranslation()
    const styles = useStyles()
    const { color, spacing } = Theme.useTheme()
    const navigation = useNavigation()
    const [edited, setEdited] = useState(false)
    const [avatarEdit, setAvatarEdit] = useState<{ uri: string; existing: boolean } | null>(null)
    const setAvatarPlacement = useAvatarPlacementStore((state) => state.setPlacement)
    const { userCard, imageID, id, setCard, updateImage } = Characters.useUserStore(
        useShallow((state) => ({
            userCard: state.card,
            imageID: state.card?.image_id ?? 0,
            id: state.id,
            setCard: state.setCard,
            updateImage: state.updateImage,
        }))
    )

    const existingPlacement = useAvatarPlacementStore((state) => state.placements[imageID ?? -1])

    const [currentCard, setCurrentCard] = useState<CharacterCardData | undefined>(userCard)

    const setShowViewer = useAvatarViewerStore((state) => state.setShow)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentCard(userCard)
    }, [userCard])

    const updateCard = (card: CharacterCardData) => {
        setEdited(true)
        setCurrentCard(card)
    }

    const handleSaveCard = async () => {
        if (currentCard && id) {
            await Characters.db.mutate.updateCard(currentCard, id)
            setEdited(false)
            setCard(id)
        }
    }

    const handleUploadImage = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            type: 'image/*',
        })
        if (result.canceled || !id) return
        setAvatarEdit({ uri: result.assets[0].uri, existing: false })
    }

    const handleAdjustImage = () => {
        if (!imageID || imageID <= 0) return
        setAvatarEdit({ uri: Characters.getImageDir(imageID), existing: true })
    }

    const saveAvatarPlacement = async (placement: AvatarPlacement) => {
        if (!avatarEdit || !id) return
        if (avatarEdit.existing) {
            if (!imageID || imageID <= 0) throw new Error('No avatar to adjust')
            setAvatarPlacement(imageID, placement)
        } else {
            const newImageId = await updateImage(avatarEdit.uri)
            if (!newImageId) throw new Error('Unable to import avatar')
            setAvatarPlacement(newImageId, placement)
            setCurrentCard((previous) => previous
                ? { ...previous, image_id: newImageId } : previous)
        }
        setAvatarEdit(null)
    }

    const handleDeleteImage = () => {
        Alert.alert({
            title: t('users.edit.image.delete'),
            description: t('users.edit.image.deletedesc'),
            buttons: [
                { label: t('common.actions.cancel') },
                {
                    label: t('users.edit.image.delete'),
                    onPress: async () => {
                        if (currentCard && id) {
                            await Characters.db.mutate.deleteImage(currentCard.id)
                            await Characters.deleteImage(imageID)
                            await setCard(id)
                        }
                    },
                    type: 'warning',
                },
            ],
        })
    }

    usePreventRemove(edited, ({ data }) => {
        if (!userCard) return
        Alert.alert({
            title: t('character.editor.dialogs.unsavedChanges.title'),
            description: t('character.editor.dialogs.unsavedChanges.description'),
            buttons: [
                { label: t('common.actions.cancel') },
                {
                    label: t('common.actions.save'),
                    onPress: async () => {
                        await handleSaveCard()
                        navigation.dispatch(data.action)
                    },
                },
                {
                    label: t('character.editor.dialogs.unsavedChanges.discard'),
                    onPress: () => {
                        navigation.dispatch(data.action)
                    },
                    type: 'warning',
                },
            ],
        })
    })

    return (
        <View style={styles.userContainer}>
            <AvatarViewer editorButton={false} />
            <AvatarPlacementModal
                visible={avatarEdit !== null}
                sourceUri={avatarEdit?.uri ?? ''}
                initialPlacement={avatarEdit?.existing ? existingPlacement : undefined}
                onCancel={() => setAvatarEdit(null)}
                onSave={saveAvatarPlacement}
            />
            <View style={{
                paddingHorizontal: 13, paddingTop: 14, paddingBottom: 12,
                borderBottomWidth: 1, borderColor: '#483650',
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{
                        width: 15, height: 3, backgroundColor: '#98E8DE',
                        borderRadius: 2,
                    }} />
                    <Text style={{
                        color: '#98E8DE', fontSize: 10,
                        fontWeight: '900', letterSpacing: 1.8,
                    }}>PARC / USER PERSONA</Text>
                </View>
                <Text style={{
                    color: color.text._100, fontSize: 22, marginTop: 9,
                    fontWeight: '800', letterSpacing: -0.5,
                }}>Who are you in this story?</Text>
                <Text style={{
                    color: color.text._400, fontSize: 12,
                    lineHeight: 18, marginTop: 5,
                }}>Your name and description guide character interactions.</Text>
            </View>
            <View style={styles.nameBar}>
                <ContextMenu
                    placement="right"
                    buttons={[
                        {
                            label: t('users.edit.image.change'),
                            icon: 'picture',
                            onPress: (close) => {
                                close()
                                handleUploadImage()
                            },
                        },
                        {
                            label: 'Adjust Image Placement',
                            icon: 'edit',
                            disabled: !imageID || imageID <= 0,
                            onPress: (close) => {
                                close()
                                handleAdjustImage()
                            },
                        },
                        {
                            label: t('users.edit.image.view'),
                            icon: 'search',
                            onPress: (close) => {
                                close()
                                setShowViewer(true, true)
                            },
                        },
                        {
                            label: t('users.edit.image.delete'),
                            icon: 'delete',
                            onPress: (close) => {
                                close()
                                handleDeleteImage()
                            },
                            variant: 'warning',
                        },
                    ]}>
                    <Avatar
                        targetImage={Characters.getImageDir(imageID)}
                        style={styles.userImage}
                    />
                    <AntDesign name="edit" color={color.text._100} style={styles.editHover} />
                </ContextMenu>
                <View style={{ marginLeft: spacing.xl2, rowGap: 12, flex: 1 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            columnGap: 4,
                        }}>
                        <ThemedButton
                            disabled={!edited}
                            iconName="save"
                            iconSize={20}
                            label={t('common.actions.save')}
                            onPress={handleSaveCard}
                            variant={edited ? 'secondary' : 'disabled'}
                        />
                    </View>

                    <ThemedTextInput
                        style={{ height: 36 }}
                        value={currentCard?.name ?? ''}
                        onChangeText={(text) => {
                            if (currentCard)
                                updateCard({
                                    ...currentCard,
                                    name: text,
                                })
                        }}
                    />
                </View>
            </View>
            <ThemedTextInput
                multiline
                containerStyle={{
                    marginHorizontal: 16,
                }}
                style={{
                    backgroundColor: color.neutral._100,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                }}
                numberOfLines={10}
                label={t('common.labels.description')}
                value={currentCard?.description ?? ''}
                onChangeText={(text) => {
                    if (currentCard)
                        updateCard({
                            ...currentCard,
                            description: text,
                        })
                }}
                placeholder="Describe this user..."
            />
        </View>
    )
}

export default UserCardEditor

const useStyles = () => {
    const { color, spacing, borderWidth, borderRadius } = Theme.useTheme()

    return StyleSheet.create({
        userContainer: {
            flex: 1,
            paddingHorizontal: spacing.m,
            paddingTop: spacing.m,
            paddingBottom: spacing.s,
            rowGap: 15,
            backgroundColor: color.neutral._100,
        },

        nameBar: {
            alignContent: 'flex-start',
            borderRadius: 18,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#211A2A',
            borderWidth: 1,
            borderColor: '#4F3659',
            paddingVertical: 15,
            paddingHorizontal: 12,
        },

        userImage: {
            width: 105,
            height: 105,
            borderRadius: borderRadius.xl2,
            borderColor: color.primary._500,
            borderWidth: borderWidth.m,
        },

        editHover: {
            position: 'absolute',
            left: '75%',
            top: '75%',
            padding: spacing.m,
            borderColor: color.primary._500,
            borderWidth: borderWidth.s,
            backgroundColor: color.neutral._200,
            borderRadius: spacing.l,
        },
    })
}
