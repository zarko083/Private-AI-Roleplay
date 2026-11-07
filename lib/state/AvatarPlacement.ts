import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AvatarPlacement } from '@lib/utils/AvatarPlacement'
import { createMMKVStorage } from '@lib/storage/MMKV'

type AvatarPlacementState = {
    placements: Record<number, AvatarPlacement>
    setPlacement: (imageId: number, placement: AvatarPlacement) => void
    removePlacement: (imageId: number) => void
}

/**
 * Stores only framing metadata. Original Character Card pictures remain untouched.
 * The same crop renders in the library, chat, and character/profile editor.
 */
export const useAvatarPlacementStore = create<AvatarPlacementState>()(
    persist(
        (set) => ({
            placements: {},
            setPlacement: (imageId, placement) => set((state) => ({
                placements: { ...state.placements, [imageId]: placement },
            })),
            removePlacement: (imageId) => set((state) => {
                if (!state.placements[imageId]) return state
                const placements = { ...state.placements }
                delete placements[imageId]
                return { placements }
            }),
        }),
        {
            name: 'parc-avatar-placement-v1',
            storage: createMMKVStorage(),
            partialize: (state) => ({ placements: state.placements }),
        }
    )
)
