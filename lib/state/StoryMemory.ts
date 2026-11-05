/**
 * Private Roleplay v0.5: explicit, user-edited continuity memory.
 * Reuses ChatterUI's existing author_notes table and inference datasource.
 * No schema change, network request, or automatic generation is involved.
 */
import { and, eq } from 'drizzle-orm'

import { db } from '@db/db'
import { authorNotes } from '@db/schema'
import { Tokenizer } from '@lib/engine/Tokenizer'
import { AuthorNotes } from '@lib/state/AuthorNotes'

export type MemoryScope = 'chat' | 'character'
export const MAX_MEMORY_CHARS = 600
export const STORY_MEMORY_NOTE_NAME = 'Private Roleplay · Continuity Memory'

const PREFIX =
    '[Story continuity facts. These are background facts, not a new dialogue turn. Keep character identity and story events consistent unless new events change them.]\n'

const notesFor = (scope: MemoryScope, ownerId: number) =>
    and(
        eq(authorNotes.name, STORY_MEMORY_NOTE_NAME),
        scope === 'chat'
            ? eq(authorNotes.chat_id, ownerId)
            : eq(authorNotes.character_id, ownerId)
    )

export const toMemoryText = (content: string) => content.trim().slice(0, MAX_MEMORY_CHARS)
export const formatMemory = (content: string) =>
    content ? PREFIX + toMemoryText(content) : ''
export const unformatMemory = (content: string) =>
    (content.startsWith(PREFIX) ? content.slice(PREFIX.length) : content).trim()

export namespace StoryMemory {
    export const load = async (scope: MemoryScope, ownerId: number): Promise<string> => {
        const [note] = await db
            .select({ content: authorNotes.content })
            .from(authorNotes)
            .where(notesFor(scope, ownerId))
            .limit(1)
        return note ? unformatMemory(note.content) : ''
    }

    export const save = async (scope: MemoryScope, ownerId: number, text: string) => {
        if (!Number.isInteger(ownerId) || ownerId <= 0) {
            throw new Error('Choose a character or conversation first.')
        }

        const cleanText = toMemoryText(text)
        const formatted = formatMemory(cleanText)
        const [existing] = await db
            .select({ id: authorNotes.id })
            .from(authorNotes)
            .where(notesFor(scope, ownerId))
            .limit(1)

        // Keep empty notes deactivated, so deleting a memory stops injecting it.
        const active = cleanText.length > 0
        let tokenLength = 0
        if (active) {
            try {
                tokenLength = await Tokenizer.getTokenizer()(formatted)
            } catch {
                // If no tokenizer is available, reserve a conservative context budget.
            }
            tokenLength = Math.max(tokenLength, Math.ceil(formatted.length / 2))
        }

        const changes = {
            content: formatted,
            active,
            token_length: tokenLength,
            depth: 1,
        }

        if (existing) {
            await AuthorNotes.db.mutate.updateNote(existing.id, changes)
        } else if (active) {
            await AuthorNotes.db.mutate.createNote({
                ...changes,
                name: STORY_MEMORY_NOTE_NAME,
                note: 'Private Roleplay v0.5. Editable through Story Memory or Author Notes.',
                priority: 100,
                chat_id: scope === 'chat' ? ownerId : null,
                character_id: scope === 'character' ? ownerId : null,
            })
        }
    }
}
