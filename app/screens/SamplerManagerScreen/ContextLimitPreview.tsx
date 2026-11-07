import AntDesign from '@react-native-vector-icons/ant-design/static'
import { Text, View } from 'react-native'

import { useContextLimit } from '@lib/hooks/ContextLimit'
import { Theme } from '@lib/theme/ThemeManager'

type Props = { generatedLength: number }

/** Context numbers are unchanged; PARC renders them in a compact budget panel. */
const ContextLimitPreview: React.FC<Props> = ({ generatedLength }) => {
    const { color } = Theme.useTheme()
    const contextLimit = useContextLimit()
    const chatBudget = Math.max(0, contextLimit - generatedLength)
    const ratio = contextLimit > 0 ? Math.max(0, Math.min(1, chatBudget / contextLimit)) : 0
    const warning = chatBudget < Math.min(2048, contextLimit * 0.25)

    return (
        <View style={{
            borderRadius: 17, borderWidth: 1,
            borderColor: warning ? '#88445C' : '#493653',
            paddingHorizontal: 14, paddingVertical: 13,
            backgroundColor: '#20192A', rowGap: 10,
        }}>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Text style={{
                    color: '#98E8DE', fontSize: 10,
                    letterSpacing: 1.6, fontWeight: '900',
                }}>CONTEXT BUDGET</Text>
                <Text style={{
                    color: color.text._100, fontWeight: '900', fontSize: 14,
                }}>{contextLimit.toLocaleString()}</Text>
            </View>
            <View style={{
                height: 7, borderRadius: 7,
                backgroundColor: '#5A2F6E', overflow: 'hidden',
            }}>
                <View style={{
                    height: '100%', borderRadius: 7,
                    width: (ratio * 100) + '%',
                    backgroundColor: '#D552A3',
                }} />
            </View>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text style={{ color: color.text._400, fontSize: 11 }}>
                    CHAT   <Text style={{
                        color: color.text._100, fontWeight: '800',
                    }}>{chatBudget.toLocaleString()}</Text>
                </Text>
                <Text style={{ color: color.text._400, fontSize: 11 }}>
                    REPLY   <Text style={{
                        color: '#E59DCD', fontWeight: '800',
                    }}>{generatedLength.toLocaleString()}</Text>
                </Text>
            </View>
            {warning && (
                <View style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}>
                    <AntDesign name="exclamation-circle" color="#FFA6B8" size={12} />
                    <Text style={{ color: '#FFA6B8', fontSize: 11 }}>
                        Chat context is low. Reduce generated tokens.
                    </Text>
                </View>
            )}
        </View>
    )
}

export default ContextLimitPreview
