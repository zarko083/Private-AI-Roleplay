/**
 * PARC Studio's optional per-character writing-style preset.
 *
 * The saved value uses the existing Character Card V2
 * post_history_instructions field. No database migration or model download.
 */
export const BALANCED_ROLEPLAY_WRITING_STYLE = [
    'Write immersive, natural English role-play responses.',
    'Aim for approximately equal lengths of spoken dialogue and combined actions, body language, sensory details, and the character\'s internal thoughts (about 50/50).',
    'Give actions and thoughts meaningful substance. Avoid pairing a long speech with only one brief gesture.',
    'Use *italics* for third-person actions and the character\'s thoughts. Use "quotation marks" for spoken dialogue.',
    'Let emotions emerge through believable behaviour, reactions, and internal reflection.',
    'Vary structure and pacing according to the scene. Do not pad replies solely to reach a word count.',
    'Stay consistent with the character\'s personality, established facts, and conversation history.',
    'Never dictate {{user}}\'s words, actions, decisions, or private thoughts.',
].join('\n')

/**
 * Returns an empty block when this character has no writing-style instructions.
 * Existing characters therefore keep their previous generation behaviour.
 */
export const formatRoleplayStyleBlock = (instructions?: string | null): string => {
    const value = instructions?.trim()
    if (!value) return ''
    return '[ROLEPLAY WRITING STYLE]\n' + value + '\n[/ROLEPLAY WRITING STYLE]'
}
