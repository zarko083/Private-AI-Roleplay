/**
 * User-facing PARC preference. This is a soft style instruction, not a post-processing
 * rewrite of model output. User Cards and all existing chat entries remain unchanged.
 */
export const formatNameAddressingRule = (userName: string | null | undefined): string => {
    const name = (userName ?? '')
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/[{}<>]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 64)

    // Upstream's starter User Card is named "User". Do not make characters
    // literally address a person as "User" until they choose a personal name.
    if (!name || name.toLowerCase() === 'user') return ''

    return [
        '[PARC USER NAME PREFERENCE]',
        `The person you are speaking to prefers to be called ${JSON.stringify(name)}.`,
        'In direct dialogue, address them by this name naturally when it suits the scene.',
        'Do not force their name into every reply, repeat it unnecessarily or break character.',
        'Keep the established character personality, relationship and conversation context.',
        '[/PARC USER NAME PREFERENCE]',
    ].join('\n')
}
