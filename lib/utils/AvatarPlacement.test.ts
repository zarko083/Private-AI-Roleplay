import {
    constrainAvatarPlacement, DEFAULT_AVATAR_PLACEMENT,
    getAvatarImageRect, panAvatarPlacement,
} from './AvatarPlacement'

describe('PARC avatar pan and zoom', () => {
    test('a portrait fills a square without blank edges', () => {
        const rect = getAvatarImageRect(300, 300, 600, 1200, DEFAULT_AVATAR_PLACEMENT)
        expect(rect.width).toBe(300)
        expect(rect.height).toBe(600)
        expect(rect.left).toBe(0)
        expect(rect.top).toBe(-150)
    })

    test('pan shifts a tall portrait vertically, but not horizontally at minimum zoom', () => {
        const p = panAvatarPlacement(DEFAULT_AVATAR_PLACEMENT, 100, 75, 300, 600, 1200)
        expect(p.centerX).toBe(0.5)
        expect(p.centerY).toBeCloseTo(0.375)
        const rect = getAvatarImageRect(300, 300, 600, 1200, p)
        expect(rect.top).toBeCloseTo(-75)
    })

    test('zoom and pan always cover the frame', () => {
        const p = constrainAvatarPlacement(
            { zoom: 99, centerX: -20, centerY: 50 }, 300, 300, 900, 600
        )
        expect(p.zoom).toBe(4)
        const rect = getAvatarImageRect(300, 300, 900, 600, p)
        expect(rect.left).toBeLessThanOrEqual(0)
        expect(rect.top).toBeLessThanOrEqual(0)
        expect(rect.left + rect.width).toBeGreaterThanOrEqual(300)
        expect(rect.top + rect.height).toBeGreaterThanOrEqual(300)
    })

    test('square photos have no panning space at 1x', () => {
        const p = panAvatarPlacement(DEFAULT_AVATAR_PLACEMENT, 200, -150, 200, 400, 400)
        expect(p.centerX).toBe(0.5)
        expect(p.centerY).toBe(0.5)
    })
})
