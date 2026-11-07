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
