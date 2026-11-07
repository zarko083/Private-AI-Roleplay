import AntDesign from '@react-native-vector-icons/ant-design/static'
import { Text, View } from 'react-native'
import * as Progress from 'react-native-progress'
import { useShallow } from 'zustand/react/shallow'

import { Llama } from '@lib/engine/Local/LlamaLocal'
import { Theme } from '@lib/theme/ThemeManager'

type Props = {
    modelImporting: boolean
    modelLoading: boolean
    modelListLength: number
    modelUpdatedAt: Date | undefined
}

/** PARC Engine module: a status console for private on-device generation. */
const ModelInfoHeader: React.FC<Props> = ({
    modelImporting, modelLoading, modelListLength, modelUpdatedAt,
}) => {
    const { color } = Theme.useTheme()
    const { modelName, loadProgress } = Llama.useLlamaModelStore(
        useShallow((state) => ({
            modelName: state.model?.name,
            loadProgress: state.loadProgress,
        }))
    )
    const ready = Boolean(modelName) && !modelLoading
    const status = modelImporting ? 'IMPORTING'
        : modelLoading ? 'LOADING'
        : ready ? 'READY' : 'IDLE'
    const description = modelImporting
        ? 'Adding a model to this device'
        : modelLoading ? 'Loading a private model into memory'
        : ready ? 'Everything stays on your device'
        : modelListLength ? 'Choose a model to start a conversation'
        : modelUpdatedAt ? 'Import or link your first GGUF model' : 'Checking model library'

    return (
        <View style={{
            borderRadius: 20, borderWidth: 1, borderColor: '#5C3B63',
            backgroundColor: '#201629', padding: 16, marginBottom: 14,
        }}>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Text style={{
                    color: '#98E8DE', fontSize: 10,
                    fontWeight: '900', letterSpacing: 2,
                }}>PARC / LOCAL ENGINE</Text>
                <View style={{
                    gap: 6, flexDirection: 'row', alignItems: 'center',
                    borderRadius: 8, backgroundColor: ready ? '#193637' : '#34243C',
                    paddingHorizontal: 9, paddingVertical: 6,
                }}>
                    <AntDesign
                        name={ready ? 'check-circle' : 'clock-circle'}
                        size={11}
                        color={ready ? '#98E8DE' : '#DEA0D3'}
                    />
                    <Text style={{
                        fontSize: 10, fontWeight: '900',
                        letterSpacing: 0.7, color: ready ? '#98E8DE' : '#DEA0D3',
                    }}>{status}</Text>
                </View>
            </View>
            <Text numberOfLines={2} style={{
                color: color.text._100, fontSize: 21,
                fontWeight: '800', letterSpacing: -0.6, marginTop: 14,
            }}>{modelName || 'Your private AI'}</Text>
            <Text style={{
                color: color.text._400, fontSize: 12, marginTop: 5,
                lineHeight: 18,
            }}>{description}</Text>
            <View style={{
                marginTop: 15, borderTopWidth: 1, borderColor: '#49304F',
                paddingTop: 11, flexDirection: 'row', justifyContent: 'space-between',
            }}>
                <Text style={{ color: color.text._500, fontSize: 11 }}>
                    AVAILABLE MODELS
                </Text>
                <Text style={{ color: '#F0C1DF', fontWeight: '900', fontSize: 12 }}>
                    {modelListLength}
                </Text>
            </View>
            {(modelLoading || modelImporting) && (
                <View style={{
                    marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 9,
                }}>
                    <View style={{ flex: 1 }}>
                        <Progress.Bar
                            indeterminate={modelImporting}
                            progress={modelLoading ? Math.max(0, Math.min(1, loadProgress / 100)) : undefined}
                            color="#98E8DE"
                            borderColor="#54405B"
                            height={6}
                            borderRadius={5}
                            width={null}
                        />
                    </View>
                    <Text style={{ color: '#98E8DE', fontSize: 12 }}>
                        {modelLoading ? String(loadProgress) + '%' : '...'}
                    </Text>
                </View>
            )}
        </View>
    )
}

export default ModelInfoHeader
