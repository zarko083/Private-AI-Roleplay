import React, { ReactNode, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

type Props = {
    title: string
    subtitle: string
    count: number
    initiallyOpen?: boolean
    children: ReactNode
}

/** Expand and collapse sampling panels without resetting selected preset values. */
const ParcSamplerGroup: React.FC<Props> = ({
    title, subtitle, count, initiallyOpen = false, children,
}) => {
    const [open, setOpen] = useState(initiallyOpen)
    const { color } = Theme.useTheme()
    if (count === 0) return null
    return (
        <View style={{
            borderRadius: 17, overflow: 'hidden',
            borderWidth: 1, borderColor: open ? '#5C376D' : '#3C2B48',
            backgroundColor: color.neutral._200,
            marginBottom: 5,
        }}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={title + (open ? ', collapse' : ', expand')}
                onPress={() => setOpen((prev) => !prev)}
                style={{
                    minHeight: 68, flexDirection: 'row',
                    alignItems: 'center', columnGap: 10,
                    paddingVertical: 12, paddingHorizontal: 14,
                }}>
                <View style={{
                    width: 5, height: 29, borderRadius: 3,
                    backgroundColor: open ? '#98E8DE' : '#A34AA8',
                }} />
                <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{
                        color: color.text._100, fontSize: 16, fontWeight: '800',
                    }}>{title}</Text>
                    <Text style={{
                        color: color.text._400, fontSize: 11, marginTop: 4,
                    }}>{subtitle}</Text>
                </View>
                <View style={{
                    width: 27, height: 27, justifyContent: 'center',
                    alignItems: 'center', borderRadius: 9,
                    backgroundColor: '#352540',
                }}>
                    <Text style={{ fontSize: 18, color: '#E89ECF' }}>
                        {open ? '−' : '+'}
                    </Text>
                </View>
            </Pressable>
            {open && (
                <View style={{
                    gap: 9, padding: 12,
                    borderTopWidth: 1, borderColor: '#423149',
                    backgroundColor: color.neutral._100,
                }}>
                    {children}
                </View>
            )}
        </View>
    )
}

export default ParcSamplerGroup
