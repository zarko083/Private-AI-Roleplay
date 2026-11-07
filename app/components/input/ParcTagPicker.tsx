import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { getParcTagGroup, PARC_DEFAULT_TAGS, PARC_TAG_GROUPS, uniqueParcTags } from '@lib/constants/ParcTags'
import { Theme } from '@lib/theme/ThemeManager'

type ParcTagPickerProps = {
    value: string[]
    setValue: (tags: string[]) => void
    availableTags?: string[]
    filterOnly?: boolean
    label?: string
}

const GROUP_NAMES = ['All', ...PARC_TAG_GROUPS.map((group) => group.name), 'Custom']

/**
 * PARC tag browser for the Character Editor and Library filter.
 *
 * Editor: 59 curated suggestions + existing/imported tags + custom entry.
 * Filter: tags used by the user's library only (doesn't show empty results).
 * Both preserve the existing string[] database format and multi-selection.
 */
const ParcTagPicker: React.FC<ParcTagPickerProps> = ({
    value,
    setValue,
    availableTags = [],
    filterOnly = false,
    label = 'Tags',
}) => {
    const { color } = Theme.useTheme()
    const [activeGroup, setActiveGroup] = useState(filterOnly ? 'All' : 'Genre')
    const [search, setSearch] = useState('')
    const [customTag, setCustomTag] = useState('')

    const selected = useMemo(() => uniqueParcTags(value), [value])
    const available = useMemo(() => {
        const options = filterOnly
            ? [...availableTags]
            : [...PARC_DEFAULT_TAGS, ...availableTags, ...selected]
        return uniqueParcTags(options)
    }, [availableTags, filterOnly, selected])
    const selectedKeys = useMemo(
        () => new Set(selected.map((tag) => tag.toLocaleLowerCase())),
        [selected]
    )

    const matching = useMemo(() => {
        const query = search.trim().toLocaleLowerCase()
        return available.filter((tag) => {
            if (query) return tag.toLocaleLowerCase().includes(query)
            return activeGroup === 'All' || getParcTagGroup(tag) === activeGroup
        })
    }, [activeGroup, available, search])

    const visibleGroups = GROUP_NAMES.filter((group) =>
        group === 'All' || available.some((tag) => getParcTagGroup(tag) === group)
    )

    const toggleTag = (tag: string) => {
        const key = tag.toLocaleLowerCase()
        setValue(
            selectedKeys.has(key)
                ? selected.filter((current) => current.toLocaleLowerCase() !== key)
                : [...selected, tag]
        )
    }

    const addCustom = () => {
        const candidate = customTag.trim().replace(/\s+/g, ' ').slice(0, 48)
        if (!candidate) return
        const known = available.find((tag) => tag.toLocaleLowerCase() === candidate.toLocaleLowerCase())
        const tag = known ?? candidate
        if (!selectedKeys.has(tag.toLocaleLowerCase())) setValue([...selected, tag])
        setCustomTag('')
        setSearch('')
        setActiveGroup(getParcTagGroup(tag))
    }

    return (
        <View style={[styles.root, { backgroundColor: color.neutral._100 }]}>
            <View style={styles.headingRow}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.heading, { color: color.text._100 }]}>{label}</Text>
                    <Text style={[styles.subheading, { color: color.text._400 }]}>
                        {filterOnly
                            ? 'Filter characters by one or more tags'
                            : 'Choose categories or add your own tags'}
                    </Text>
                </View>
                <View style={styles.counter}>
                    <Text style={styles.counterText}>{selected.length} selected</Text>
                </View>
            </View>

            {selected.length > 0 && (
                <View style={styles.selectedArea}>
                    {selected.map((tag) => (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => toggleTag(tag)}
                            accessibilityRole="button"
                            accessibilityLabel={`Remove tag ${tag}`}
                            style={styles.selectedChip}>
                            <Text style={styles.selectedText}>{tag}  ×</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        onPress={() => setValue([])}
                        accessibilityRole="button"
                        style={styles.clearChip}>
                        <Text style={[styles.clearText, { color: color.text._400 }]}>Clear all</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TextInput
                style={[styles.search, {
                    backgroundColor: color.neutral._200,
                    borderColor: 'rgba(152,232,222,0.30)',
                    color: color.text._100,
                }]}
                value={search}
                onChangeText={setSearch}
                placeholder="Search tags..."
                placeholderTextColor={color.text._500}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Search tags"
            />

            {!search.trim() && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={styles.groups}>
                    {visibleGroups.map((group) => {
                        const chosen = activeGroup === group
                        return (
                            <TouchableOpacity
                                key={group}
                                accessibilityRole="button"
                                accessibilityState={{ selected: chosen }}
                                onPress={() => setActiveGroup(group)}
                                style={[styles.groupButton, {
                                    backgroundColor: chosen ? '#542177' : color.neutral._200,
                                    borderColor: chosen ? '#D552A3' : 'rgba(152,232,222,0.18)',
                                }]}>
                                <Text style={[styles.groupText, {
                                    color: chosen ? '#FFFFFF' : color.text._400,
                                }]}>{group}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            )}

            <View style={styles.options}>
                {matching.map((tag) => {
                    const isSelected = selectedKeys.has(tag.toLocaleLowerCase())
                    return (
                        <TouchableOpacity
                            key={tag}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: isSelected }}
                            onPress={() => toggleTag(tag)}
                            style={[styles.option, {
                                backgroundColor: isSelected ? '#542177' : color.neutral._200,
                                borderColor: isSelected ? '#D552A3' : 'rgba(152,232,222,0.20)',
                            }]}>
                            <Text style={[styles.optionText, { color: isSelected ? '#FFFFFF' : color.text._200 }]}>
                                {isSelected ? '✓ ' : '+ '}{tag}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
                {matching.length === 0 && (
                    <Text style={[styles.empty, { color: color.text._400 }]}>
                        {filterOnly ? 'No matching tags on your characters.' : 'No matches. Add a custom tag below.'}
                    </Text>
                )}
            </View>

            {!filterOnly && (
                <View style={styles.customRow}>
                    <TextInput
                        style={[styles.customInput, {
                            backgroundColor: color.neutral._200,
                            borderColor: 'rgba(152,232,222,0.30)',
                            color: color.text._100,
                        }]}
                        value={customTag}
                        onChangeText={setCustomTag}
                        onSubmitEditing={addCustom}
                        returnKeyType="done"
                        maxLength={48}
                        placeholder="New custom tag"
                        placeholderTextColor={color.text._500}
                        autoCorrect={false}
                        accessibilityLabel="New custom tag"
                    />
                    <TouchableOpacity
                        onPress={addCustom}
                        accessibilityRole="button"
                        accessibilityLabel="Add custom tag"
                        style={[styles.addButton, { opacity: customTag.trim() ? 1 : 0.5 }]}>
                        <Text style={styles.addText}>Add</Text>
                    </TouchableOpacity>
                </View>
            )}
            {!filterOnly && (
                <Text style={[styles.note, { color: color.text._500 }]}>
                    Tags organise your library. They do not change how the character behaves.
                </Text>
            )}
        </View>
    )
}

export default ParcTagPicker

const styles = StyleSheet.create({
    root: {
        borderRadius: 16,
        padding: 13,
        rowGap: 12,
        borderWidth: 1,
        borderColor: 'rgba(152,232,222,0.18)',
    },
    headingRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
    heading: { fontSize: 16, fontWeight: '800' },
    subheading: { marginTop: 4, fontSize: 11, lineHeight: 16 },
    counter: {
        backgroundColor: 'rgba(142,30,162,0.25)',
        borderColor: 'rgba(213,82,163,0.45)',
        borderWidth: 1,
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 20,
    },
    counterText: { fontSize: 10, fontWeight: '700', color: '#EFC9EB' },
    selectedArea: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    selectedChip: {
        borderRadius: 20,
        backgroundColor: '#8E1EA2',
        paddingVertical: 7,
        paddingHorizontal: 10,
    },
    selectedText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
    clearChip: { justifyContent: 'center', paddingHorizontal: 8 },
    clearText: { fontSize: 11, fontWeight: '700' },
    search: { height: 42, borderWidth: 1, borderRadius: 10, paddingHorizontal: 11, fontSize: 13 },
    groups: { flexDirection: 'row', columnGap: 6, paddingRight: 5 },
    groupButton: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 20 },
    groupText: { fontSize: 11, fontWeight: '700' },
    options: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
    option: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1 },
    optionText: { fontSize: 12, fontWeight: '600' },
    empty: { fontSize: 12, lineHeight: 18, paddingVertical: 8 },
    customRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    customInput: { flex: 1, height: 43, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, fontSize: 13 },
    addButton: { backgroundColor: '#8E1EA2', minHeight: 43, borderRadius: 10, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' },
    addText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
    note: { fontSize: 10, lineHeight: 15 },
})
