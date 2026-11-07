import Slider from '@react-native-community/slider'
import { useCallback, useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

type Props = {
    label: string
    value: number
    onValueChange: (value: number) => void
    min?: number
    max?: number
    step?: number
    precision?: number
    showInput?: boolean
    disabled?: boolean
}

const clamp = (value: number, min: number, max: number, precision: number) =>
    Math.min(Math.max(Number(value.toFixed(precision)), min), max)

/**
 * PARC compact sampler control.
 * Keeps the existing numeric value and change callback unchanged.
 */
const ThemedSlider: React.FC<Props> = ({
    label,
    value,
    onValueChange,
    min = 0,
    max = 1,
    step = 0,
    precision = 0,
    showInput = true,
    disabled = false,
}) => {
    const { color } = Theme.useTheme()
    const [textValue, setTextValue] = useState(String(value))
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (!editing) setTextValue(String(value))
    }, [value, editing])

    const normalize = useCallback(
        (v: number) => clamp(v, min, max, precision),
        [min, max, precision]
    )

    const handleSlider = (v: number) => {
        const parsed = normalize(v)
        if (Number.isFinite(parsed)) {
            onValueChange(parsed)
            setTextValue(String(parsed))
        }
    }
    const commitInput = () => {
        const parsed = Number(textValue.trim())
        if (Number.isFinite(parsed)) {
            const next = normalize(parsed)
            onValueChange(next)
            setTextValue(String(next))
        } else {
            setTextValue(String(value))
        }
        setEditing(false)
    }

    return (
        <View style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: disabled ? color.neutral._400 : '#423249',
            backgroundColor: '#1E1827',
            paddingHorizontal: 13,
            paddingTop: 11,
            paddingBottom: 9,
            opacity: disabled ? 0.55 : 1,
        }}>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', columnGap: 9,
            }}>
                <Text style={{
                    flex: 1, fontSize: 13, fontWeight: '700',
                    color: color.text._200,
                }}>
                    {label}
                </Text>
                {showInput ? (
                    <TextInput
                        editable={!disabled}
                        accessibilityLabel={label + ' value'}
                        keyboardType={precision > 0 ? 'decimal-pad' : 'number-pad'}
                        selectTextOnFocus
                        style={{
                            minWidth: 73, maxWidth: 115,
                            minHeight: 37, paddingVertical: 5,
                            paddingHorizontal: 10, textAlign: 'center',
                            color: '#F8F3FA', fontSize: 14, fontWeight: '800',
                            borderWidth: 1, borderColor: editing ? '#D552A3' : '#594064',
                            borderRadius: 10, backgroundColor: '#2C2037',
                        }}
                        value={textValue}
                        onChangeText={(text) => {
                            setTextValue(text)
                            const next = Number(text)
                            if (text.trim() !== '' && Number.isFinite(next)) {
                                onValueChange(normalize(next))
                            }
                        }}
                        onFocus={() => setEditing(true)}
                        onBlur={commitInput}
                        onSubmitEditing={commitInput}
                        returnKeyType="done"
                    />
                ) : (
                    <Text style={{ color: color.text._100, fontWeight: '800', fontSize: 13 }}>
                        {value}
                    </Text>
                )}
            </View>
            <Slider
                disabled={disabled}
                style={{ height: 32, width: '100%', marginTop: 4 }}
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={value}
                onSlidingComplete={handleSlider}
                minimumTrackTintColor="#D552A3"
                maximumTrackTintColor="#4D3A59"
                thumbTintColor="#98E8DE"
            />
        </View>
    )
}

export default ThemedSlider
