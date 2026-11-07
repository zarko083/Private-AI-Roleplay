/**
 * Speaker identity only. Does not impose a voice style or require repeated
 * vocative names. Names are taken from the active Character Card and User Persona.
 */
export const sanitizeSpeakerName = (value: string | undefined | null): string =>
    (value ?? '')
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/[<>\{\}\[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 64)

export const formatSpeakerPrefix = (name: string | undefined | null): string => {
    const normalized = sanitizeSpeakerName(name)
    return normalized ? normalized + ': ' : ''
}

export const formatIncludedNamesBlock = (
    characterName: string | undefined | null,
    userPersonaName: string | undefined | null
): string => {
    const character = sanitizeSpeakerName(characterName)
    const userPersona = sanitizeSpeakerName(userPersonaName)
    if (!character && !userPersona) return ''

    const names = [
        character ? 'Character Card name: ' + JSON.stringify(character) : '',
        userPersona ? 'User persona name: ' + JSON.stringify(userPersona) : '',
    ].filter(Boolean)

    return [
        '[PARC SPEAKER IDENTITIES]',
        ...names,
        'Names identify participants in the roleplay; do not repeat them unnecessarily.',
        '[/PARC SPEAKER IDENTITIES]',
    ].join('\n')
}

/**
 * Hide model-generated role labels at the beginning of assistant text.
 * Only exact speaker names followed by a colon are stripped.
 * Kept separate from stored chat data so original messages remain editable.
 */
export const stripLeadingSpeakerPrefix = (
    text: string,
    speakerName: string | null | undefined
): string => {
    const name = sanitizeSpeakerName(speakerName)
    if (!name || !text) return text

    // Quoting the speaker name prevents characters such as '+' being regex operators.
    const escaped = name.replace(/[.*+?^\u0024{}()|\[\]\\]/g, '\\$&')
    const prefix = new RegExp('^\\s*' + escaped + '\\s*[:：]\\s*', 'iu')
    let result = text
    for (let i = 0; i < 4 && prefix.test(result); i++) {
        result = result.replace(prefix, '')
    }
    return result
}
