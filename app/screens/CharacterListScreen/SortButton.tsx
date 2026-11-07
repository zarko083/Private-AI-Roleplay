import AntDesign from '@react-native-vector-icons/ant-design/static'
import { Pressable, Text, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { CharacterSorter, SearchType } from '@lib/state/CharacterSorter'

type Props = { type: SearchType; label: string }

const SortButton: React.FC<Props> = ({ type, label }) => {
    const { searchType, setSearchType, searchOrder, setSearchOrder } =
        CharacterSorter.useSorterStore(
            useShallow((state) => ({
                searchType: state.searchType,
                setSearchType: state.setType,
                searchOrder: state.searchOrder,
                setSearchOrder: state.setOrder,
            }))
        )
    const selected = type === searchType
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={'Sort by ' + label}
            onPress={() => {
                setSearchOrder(searchType !== type || searchOrder === 'asc' ? 'desc' : 'asc')
                setSearchType(type)
            }}
            style={{
                flexDirection: 'row', alignItems: 'center', gap: 5,
                minHeight: 38, borderRadius: 9, paddingHorizontal: 11,
                borderWidth: 1, borderColor: selected ? '#A046B6' : '#382A44',
                backgroundColor: selected ? '#41244D' : '#221B2C',
            }}>
            <Text style={{ color: selected ? '#FFFFFF' : '#A898B4', fontSize: 12, fontWeight: '700' }}>
                {label}
            </Text>
            {selected && (
                <AntDesign
                    size={11}
                    name={(searchOrder === 'asc' && type === 'modified') ||
                          (searchOrder === 'desc' && type === 'name') ? 'caret-up' : 'caret-down'}
                    color="#98E8DE"
                />
            )}
        </Pressable>
    )
}

export default SortButton
