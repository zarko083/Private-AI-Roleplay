export type AvatarPlacement = {
    zoom: number
    centerX: number
    centerY: number
}

export const DEFAULT_AVATAR_PLACEMENT: AvatarPlacement = {
    zoom: 1,
    centerX: 0.5,
    centerY: 0.5,
}

export const MIN_AVATAR_ZOOM = 1
export const MAX_AVATAR_ZOOM = 4

export const clamp = (value: number, minimum: number, maximum: number) =>
    Math.min(Math.max(value, minimum), maximum)

/**
 * Computes a cover crop while keeping the image large enough to fill the frame.
 * The normalized center survives changes in display size and device resolution.
 */
export const getAvatarImageRect = (
    frameWidth: number,
    frameHeight: number,
    imageWidth: number,
    imageHeight: number,
    value: AvatarPlacement
) => {
    const frameW = Math.max(1, frameWidth)
    const frameH = Math.max(1, frameHeight)
    const sourceW = Math.max(1, imageWidth)
    const sourceH = Math.max(1, imageHeight)
    const zoom = clamp(value.zoom, MIN_AVATAR_ZOOM, MAX_AVATAR_ZOOM)
    const cover = Math.max(frameW / sourceW, frameH / sourceH)
    const width = sourceW * cover * zoom
    const height = sourceH * cover * zoom
    const minimumX = frameW / (2 * width)
    const minimumY = frameH / (2 * height)
    const centerX = clamp(value.centerX, minimumX, 1 - minimumX)
    const centerY = clamp(value.centerY, minimumY, 1 - minimumY)

    return {
        width,
        height,
        left: frameW / 2 - centerX * width,
        top: frameH / 2 - centerY * height,
        centerX,
        centerY,
    }
}

export const constrainAvatarPlacement = (
    value: AvatarPlacement,
    frameWidth: number,
    frameHeight: number,
    imageWidth: number,
    imageHeight: number
): AvatarPlacement => {
    const zoom = clamp(value.zoom, MIN_AVATAR_ZOOM, MAX_AVATAR_ZOOM)
    const rect = getAvatarImageRect(
        frameWidth, frameHeight, imageWidth, imageHeight, { ...value, zoom }
    )
    return { zoom, centerX: rect.centerX, centerY: rect.centerY }
}

export const panAvatarPlacement = (
    value: AvatarPlacement,
    deltaX: number,
    deltaY: number,
    frameSize: number,
    imageWidth: number,
    imageHeight: number
): AvatarPlacement => {
    const rect = getAvatarImageRect(frameSize, frameSize, imageWidth, imageHeight, value)
    return constrainAvatarPlacement({
        ...value,
        centerX: value.centerX - deltaX / rect.width,
        centerY: value.centerY - deltaY / rect.height,
    }, frameSize, frameSize, imageWidth, imageHeight)
}
