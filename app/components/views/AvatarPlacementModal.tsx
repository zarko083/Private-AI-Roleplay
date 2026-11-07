import { Image as ExpoImage } from 'expo-image'
import { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator, Image, Modal, PanResponder, Pressable,
    Text, useWindowDimensions, View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Theme } from '@lib/theme/ThemeManager'
import {
    AvatarPlacement, constrainAvatarPlacement, DEFAULT_AVATAR_PLACEMENT,
    getAvatarImageRect, MAX_AVATAR_ZOOM, MIN_AVATAR_ZOOM, panAvatarPlacement,
} from '@lib/utils/AvatarPlacement'

type Props = {
    visible: boolean
    sourceUri: string
    initialPlacement?: AvatarPlacement
    onCancel: () => void
    onSave: (value: AvatarPlacement) => Promise<void> | void
}

const AvatarPlacementModal: React.FC<Props> = ({
    visible, sourceUri, initialPlacement, onCancel, onSave,
}) => {
    const { color } = Theme.useTheme()
    const { width: windowWidth } = useWindowDimensions()
    const frameSize = Math.min(windowWidth - 40, 370)
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
    const [placement, setPlacement] = useState<AvatarPlacement>(
        initialPlacement ?? DEFAULT_AVATAR_PLACEMENT
    )
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const placementRef = useRef(placement)
    const imageSizeRef = useRef(imageSize)
    const frameSizeRef = useRef(frameSize)
    const gesture = useRef({ count: 0, x: 0, y: 0, distance: 0 })

    frameSizeRef.current = frameSize
    imageSizeRef.current = imageSize

    const updatePlacement = (value: AvatarPlacement) => {
        placementRef.current = value
        setPlacement(value)
    }

    useEffect(() => {
        if (!visible || !sourceUri) return
        const current = initialPlacement ?? DEFAULT_AVATAR_PLACEMENT
        placementRef.current = current
        setPlacement(current)
        setImageSize({ width: 0, height: 0 })
        setError('')
        gesture.current.count = 0
        Image.getSize(
            sourceUri,
            (width, height) => setImageSize({ width, height }),
            () => setError('Unable to read this image. Please choose a different photo.')
        )
    }, [visible, sourceUri, initialPlacement])

    // PanResponder owns touch interaction. Each movement is incremental so
    // crossing between one and two fingers never makes the image jump.
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => true,
            onPanResponderGrant: () => { gesture.current.count = 0 },
            onPanResponderMove: (evt) => {
                const touches = evt.nativeEvent.touches
                const dims = imageSizeRef.current
                const frame = frameSizeRef.current
                if (!dims.width || !dims.height || !touches.length) return
                if (touches.length >= 2) {
                    const a = touches[0]
                    const b = touches[1]
                    const distance = Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY)
                    if (gesture.current.count === 2 && gesture.current.distance > 0) {
                        const zoom = Math.max(
                            MIN_AVATAR_ZOOM,
                            Math.min(MAX_AVATAR_ZOOM, placementRef.current.zoom * distance / gesture.current.distance)
                        )
                        const next = constrainAvatarPlacement(
                            { ...placementRef.current, zoom },
                            frame, frame, dims.width, dims.height
                        )
                        placementRef.current = next
                        setPlacement(next)
                    }
                    gesture.current = { count: 2, x: 0, y: 0, distance }
                } else {
                    const touch = touches[0]
                    if (gesture.current.count === 1) {
                        const next = panAvatarPlacement(
                            placementRef.current,
                            touch.pageX - gesture.current.x,
                            touch.pageY - gesture.current.y,
                            frame,
                            dims.width,
                            dims.height
                        )
                        placementRef.current = next
                        setPlacement(next)
                    }
                    gesture.current = { count: 1, x: touch.pageX, y: touch.pageY, distance: 0 }
                }
            },
            onPanResponderRelease: () => { gesture.current.count = 0 },
            onPanResponderTerminate: () => { gesture.current.count = 0 },
        })
    ).current

    const rect = imageSize.width && imageSize.height
        ? getAvatarImageRect(
            frameSize, frameSize, imageSize.width, imageSize.height, placement
        )
        : null

    const save = async () => {
        if (!rect || saving) return
        setSaving(true)
        try {
            await onSave(constrainAvatarPlacement(
                placementRef.current,
                frameSize, frameSize, imageSize.width, imageSize.height
            ))
        } catch (cause) {
            setError('Unable to save avatar placement. ' + String(cause))
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={() => { if (!saving) onCancel() }}
            statusBarTranslucent>
            <SafeAreaView
                style={{
                    flex: 1, backgroundColor: color.neutral._100,
                    paddingHorizontal: 20, justifyContent: 'center',
                }}>
                <Text style={{ color: color.primary._800, fontSize: 11, letterSpacing: 1.5, fontWeight: '800' }}>
                    PARC / AVATAR EDITOR
                </Text>
                <Text style={{ color: color.text._100, fontSize: 23, fontWeight: '800', marginTop: 6 }}>
                    Adjust Image Placement
                </Text>
                <Text style={{ color: color.text._400, fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 20 }}>
                    Drag to reposition. Pinch with two fingers to zoom. The original photo is preserved.
                </Text>
                <View
                    style={{
                        width: frameSize, height: frameSize,
                        alignSelf: 'center', borderRadius: 18, overflow: 'hidden',
                        borderWidth: 2, borderColor: color.primary._700,
                        backgroundColor: color.neutral._300,
                    }}
                    {...panResponder.panHandlers}>
                    {rect ? (
                        <ExpoImage
                            source={{ uri: sourceUri }}
                            cachePolicy="none"
                            contentFit="fill"
                            style={{
                                position: 'absolute', width: rect.width,
                                height: rect.height, left: rect.left, top: rect.top,
                            }}
                        />
                    ) : (
                        <ActivityIndicator style={{ flex: 1 }} color={color.primary._700} />
                    )}
                    <View pointerEvents="none" style={{
                        position: 'absolute', width: 24, height: 24,
                        top: 0, left: 0,
                        borderTopWidth: 2, borderLeftWidth: 2,
                        borderColor: color.primary._800,
                    }} />
                    <View pointerEvents="none" style={{
                        position: 'absolute', width: 24, height: 24,
                        bottom: 0, right: 0,
                        borderBottomWidth: 2, borderRightWidth: 2,
                        borderColor: color.primary._800,
                    }} />
                </View>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', marginTop: 15,
                }}>
                    <Text style={{ color: color.text._400, fontSize: 12 }}>
                        ZOOM {placement.zoom.toFixed(1)}×
                    </Text>
                    <Pressable
                        accessibilityRole="button" accessibilityLabel="Reset image position"
                        onPress={() => updatePlacement(DEFAULT_AVATAR_PLACEMENT)}
                        style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
                        <Text style={{ color: color.primary._800, fontWeight: '700' }}>Reset</Text>
                    </Pressable>
                </View>
                {error ? <Text style={{ color: color.error._300, fontSize: 12 }}>{error}</Text> : null}
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 25 }}>
                    <Pressable
                        disabled={saving}
                        onPress={onCancel}
                        style={{
                            flex: 1, borderWidth: 1, borderColor: color.neutral._500,
                            borderRadius: 14, paddingVertical: 15, alignItems: 'center',
                        }}>
                        <Text style={{ color: color.text._200, fontWeight: '700' }}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        disabled={!rect || saving}
                        accessibilityRole="button"
                        accessibilityLabel="Save avatar placement"
                        onPress={save}
                        style={{
                            flex: 1, borderRadius: 14,
                            backgroundColor: rect && !saving ? color.primary._700 : color.neutral._400,
                            paddingVertical: 15, alignItems: 'center',
                        }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>
                            {saving ? 'Saving...' : 'Save Avatar'}
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default AvatarPlacementModal
