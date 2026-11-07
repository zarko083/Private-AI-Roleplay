import AntDesign, { AntDesignIconName } from '@react-native-vector-icons/ant-design/static'
import { Href, useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

import { useAppMode } from '@lib/state/AppMode'
import { Theme } from '@lib/theme/ThemeManager'

type DockItem = {
    label: string
    icon: AntDesignIconName
    path?: Href
}

/**
 * PARC Studio's one-handed navigation dock.
 * Keeps the existing route destinations and local engine unchanged.
 */
const ParcLibraryDock = () => {
    const router = useRouter()
    const { color } = Theme.useTheme()
    const { appMode } = useAppMode()

    const items: DockItem[] = [
        { label: 'LIBRARY', icon: 'book' },
        {
            label: 'ENGINE',
            icon: 'branches',
            path: appMode === 'remote'
                ? '/screens/ConnectionsManagerScreen'
                : '/screens/ModelManagerScreen',
        },
        { label: 'SAMPLERS', icon: 'control', path: '/screens/SamplerManagerScreen' },
        { label: 'SETTINGS', icon: 'setting', path: '/screens/AppSettingsScreen' },
    ]

    return (
        <View
            style={{
                flexDirection: 'row',
                backgroundColor: '#1B1423',
                borderTopColor: '#47334F',
                borderTopWidth: 1,
                paddingHorizontal: 5,
                paddingTop: 7,
                paddingBottom: 5,
            }}>
            {items.map((item) => {
                const selected = item.path === undefined
                return (
                    <Pressable
                        key={item.label}
                        accessibilityRole="button"
                        accessibilityLabel={item.label}
                        accessibilityState={{ selected, disabled: selected }}
                        disabled={selected}
                        onPress={() => {
                            if (item.path) router.push(item.path)
                        }}
                        style={{
                            flex: 1,
                            minHeight: 51,
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 5,
                            borderRadius: 12,
                            backgroundColor: selected ? '#34213F' : 'transparent',
                        }}>
                        <AntDesign
                            name={item.icon}
                            size={18}
                            color={selected ? '#98E8DE' : color.text._400}
                        />
                        <Text style={{
                            fontSize: 9,
                            fontWeight: '800',
                            letterSpacing: 0.7,
                            color: selected ? '#98E8DE' : color.text._400,
                        }}>
                            {item.label}
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

export default ParcLibraryDock
