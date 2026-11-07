/**
 * PARC's discovery vocabulary. These are suggestions, not database seed data:
 * imported and user-defined tags continue to work without any migration.
 * Tags never modify a character's prompt or behaviour.
 */
export const PARC_TAG_GROUPS = [
    {
        name: 'Genre',
        tags: ['Romance', 'Slice of Life', 'Drama', 'Comedy', 'Mystery', 'Thriller', 'Horror', 'Fantasy', 'Sci-Fi', 'Adventure', 'Historical'],
    },
    {
        name: 'Relationship',
        tags: ['Stranger', 'Friend', 'Best Friend', 'Partner', 'Crush', 'Rival', 'Mentor', 'Colleague', 'Family', 'Companion'],
    },
    {
        name: 'Personality',
        tags: ['Friendly', 'Shy', 'Confident', 'Caring', 'Cold', 'Playful', 'Sarcastic', 'Protective', 'Mysterious', 'Introverted', 'Outgoing'],
    },
    {
        name: 'Setting',
        tags: ['Modern', 'School', 'University', 'Workplace', 'City Life', 'Home', 'Travel', 'Medieval', 'Cyberpunk', 'Post-Apocalyptic', 'Space'],
    },
    {
        name: 'Character Type',
        tags: ['Human', 'AI', 'Android', 'Elf', 'Vampire', 'Demon', 'Supernatural', 'Anime', 'Original Character'],
    },
    {
        name: 'Roleplay Style',
        tags: ['Casual Chat', 'Story-Driven', 'Slow Burn', 'Emotional', 'Action', 'Immersive', 'Long-Term Story'],
    },
] as const

export const PARC_DEFAULT_TAGS: readonly string[] = PARC_TAG_GROUPS.flatMap((group) => [...group.tags])

export const getParcTagGroup = (tag: string): string => {
    const lower = tag.trim().toLocaleLowerCase()
    return PARC_TAG_GROUPS.find((group) =>
        group.tags.some((preset) => preset.toLocaleLowerCase() === lower)
    )?.name ?? 'Custom'
}

export const uniqueParcTags = (values: readonly string[]): string[] => {
    const seen = new Set<string>()
    return values.map((tag) => tag.trim()).filter((tag) => {
        const key = tag.toLocaleLowerCase()
        if (!key || seen.has(key)) return false
        seen.add(key)
        return true
    })
}
