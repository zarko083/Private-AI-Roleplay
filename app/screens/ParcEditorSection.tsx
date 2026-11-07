import React, { ReactNode, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

type Props = {
    title: string
    subtitle: string
    index: string
    children: ReactNode
    initiallyOpen?: boolean
}

const ParcEditorSection: React.FC<Props> = ({
    title, subtitle, index, children, initiallyOpen = false,
}) => {
    const [open, setOpen] = useState(initiallyOpen)
    const { color } = Theme.useTheme()
    return (
        <View style={{
            backgroundColor: color.neutral._200,
            borderWidth: 1,
            borderColor: open ? '#694078' : color.neutral._400,
            borderRadius: 17,
            overflow: 'hidden',
            marginBottom: 3,
        }}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={title + (open ? ', collapse' : ', expand')}
                onPress={() => setOpen((value) => !value)}
                style={{
                    minHeight: 67, paddingVertical: 13, paddingHorizontal: 14,
                    flexDirection: 'row', alignItems: 'center', columnGap: 12,
                }}>
                <View style={{
                    width: 32, height: 32, borderRadius: 10,
                    backgroundColor: open ? '#542177' : '#30263C',
                    justifyContent: 'center', alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: 11, fontWeight: '900', color: open ? '#98E8DE' : '#B49EBC',
                    }}>{index}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{
                        color: color.text._100, fontSize: 15,
                        fontWeight: '800', letterSpacing: -0.2,
                    }}>{title}</Text>
                    <Text numberOfLines={1} style={{
                        color: color.text._400, fontSize: 11,
                        marginTop: 4,
                    }}>{subtitle}</Text>
                </View>
                <View style={{
                    width: 28, height: 28, borderRadius: 9,
                    backgroundColor: '#30243A',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Text style={{
                        fontSize: 19, color: '#E494CE',
                        lineHeight: 23, fontWeight: '600',
                    }}>{open ? '−' : '+'}</Text>
                </View>
            </Pressable>
            {open && (
                <View style={{
                    paddingTop: 12, paddingBottom: 16, paddingHorizontal: 12,
                    borderTopWidth: 1, borderColor: color.neutral._400,
                    rowGap: 12, backgroundColor: color.neutral._100,
                }}>{children}</View>
            )}
        </View>
    )
}

export default ParcEditorSection
