import { Image, ImageProps } from 'expo-image'
import { useEffect, useState } from 'react'
import { Image as NativeImage, StyleProp, View, ViewStyle } from 'react-native'

import { useAvatarPlacementStore } from '@lib/state/AvatarPlacement'
import { getAvatarImageRect } from '@lib/utils/AvatarPlacement'

interface AvatarProps extends Omit<ImageProps, 'source' | 'onError'> {
    targetImage: string
    /** Full-size viewers always use the untouched original picture. */
    usePlacement?: boolean
}

const dimensionsCache = new Map<string, { width: number; height: number }>()

const Avatar: React.FC<AvatarProps> = ({
    targetImage, usePlacement = true, style, ...rest
}) => {
    const imageId = Number(targetImage.match(/\/characters\/(\d+)\.png(?:\?.*)?$/)?.[1] ?? -1)
    const placement = useAvatarPlacementStore((state) => state.placements[imageId])
    const [frame, setFrame] = useState({ width: 0, height: 0 })
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (!usePlacement || !placement || imageId < 0) return
        const cached = dimensionsCache.get(targetImage)
        if (cached) {
            setImageSize(cached)
            return
        }
        let active = true
        NativeImage.getSize(
            targetImage,
            (width, height) => {
                const dimensions = { width, height }
                dimensionsCache.set(targetImage, dimensions)
                if (active) setImageSize(dimensions)
            },
            () => { if (active) setImageSize({ width: 0, height: 0 }) }
        )
        return () => { active = false }
    }, [targetImage, imageId, usePlacement, !!placement])

    if (!usePlacement || !placement) {
        return (
            <Image
                {...rest}
                source={{ uri: targetImage }}
                style={style}
                placeholder={require('@assets/user.png')}
                cachePolicy="none"
                placeholderContentFit="contain"
            />
        )
    }

    const rect = frame.width > 0 && frame.height > 0 &&
        imageSize.width > 0 && imageSize.height > 0
        ? getAvatarImageRect(
            frame.width, frame.height, imageSize.width, imageSize.height, placement
        ) : null

    return (
        <View
            style={[style as StyleProp<ViewStyle>, { overflow: 'hidden' }]}
            accessibilityLabel={rest.accessibilityLabel}
            onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout
                if (Math.abs(frame.width - width) >= 1 || Math.abs(frame.height - height) >= 1) {
                    setFrame({ width, height })
                }
            }}>
            <Image
                {...rest}
                source={{ uri: targetImage }}
                cachePolicy="none"
                placeholder={require('@assets/user.png')}
                placeholderContentFit="contain"
                contentFit={rect ? 'fill' : 'cover'}
                style={rect ? {
                    position: 'absolute',
                    width: rect.width, height: rect.height,
                    left: rect.left, top: rect.top,
                } : { width: '100%', height: '100%' }}
            />
        </View>
    )
}

export default Avatar
