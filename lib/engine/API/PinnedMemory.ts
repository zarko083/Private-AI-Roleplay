/**
 * Put manually pinned continuity facts in the same user turn as the
 * latest question. A two-role chat template (such as Gemma 2) must not
 * depend on a separate system message to receive these facts.
 *
 * Keep this formatter independent of React Native for regression testing.
 */
export const formatPinnedMemoryPrompt = (facts: string[], userMessage: string): string => {
    const activeFacts = facts.map((fact) => fact.trim()).filter(Boolean)
    if (activeFacts.length === 0) return userMessage

    return [
        '[ESTABLISHED CHARACTER AND STORY FACTS]',
        'The following are saved facts for this role-play, not new dialogue.',
        'Prioritise these facts over contradictory recollections in old messages.',
        'Do not invent a different answer when the facts already state one.',
        ...activeFacts,
        '[/ESTABLISHED FACTS]',
        '',
        '[LATEST USER MESSAGE]',
        userMessage,
    ].join('\n')
}
