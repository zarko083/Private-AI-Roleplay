import AntDesign from '@react-native-vector-icons/ant-design/static'
import { Text, View } from 'react-native'
import * as Progress from 'react-native-progress'
import { useShallow } from 'zustand/react/shallow'

import { Llama } from '@lib/engine/Local/LlamaLocal'
import { Theme } from '@lib/theme/ThemeManager'

type ModelInfoHeaderProps = {
    modelImporting: boolean
    modelLoading: boolean
    modelListLength: number
    modelUpdatedAt: Date | undefined
}

/** Status dashboard for local GGUF. Model lifecycle is still owned by ChatterUI. */
const ModelInfoHeader: React.FC<ModelInfoHeaderProps> = ({
    modelImporting,
    modelLoading,
    modelListLength,
    modelUpdatedAt,
}) => {
    const { color } = Theme.useTheme()
    const { modelName, loadProgress } = Llama.useLlamaModelStore(
        useShallow((state) => ({
            modelName: state.model?.name,
            loadProgress: state.loadProgress,
        }))
    )
    const ready = Boolean(modelName) && !modelLoading
    const label = modelImporting
        ? 'IMPORTING MODEL'
        : modelLoading
          ? 'LOADING LOCAL MODEL'
          : ready
            ? 'LOCAL MODEL READY'
            : 'NO MODEL LOADED'
    const statusText = modelImporting
        ? 'Adding a GGUF model to your device'
        : modelLoading
          ? 'Preparing the model for private conversations'
          : ready
            ? 'Your conversations run on this device'
            : modelListLength > 0
              ? 'Select a model below to start your story'
              : modelUpdatedAt
                ? 'Import or link a GGUF model to get started'
                : 'Checking your local models'

    return (
        <View
            style={{
                backgroundColor: color.neutral._200,
                borderColor: color.neutral._400,
                borderWidth: 1,
                borderRadius: 22,
                paddingHorizontal: 17,
                paddingVertical: 17,
                marginBottom: 12,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 9 }}>
                <View
                    style={{
                        width: 30,
                        height: 30,
                        backgroundColor: ready ? color.primary._100 : color.neutral._300,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 11,
                    }}>
                    <AntDesign name={ready ? 'check-circle' : 'database'} size={17} color={ready ? color.primary._800 : color.text._400} />
                </View>
                <Text style={{ color: ready ? '#98E8DE' : color.text._400, fontSize: 11, letterSpacing: 1, fontWeight: '800', flex: 1 }}>
                    {label}
                </Text>
            </View>
            <Text numberOfLines={2} style={{ marginTop: 12, fontSize: 18, fontWeight: '700', color: color.text._100 }}>
                {modelName ?? 'Your local AI models'}
            </Text>
            <Text style={{ marginTop: 5, fontSize: 12, lineHeight: 18, color: color.text._400 }}>
                {statusText}
            </Text>
            {(modelLoading || modelImporting) && (
                <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', columnGap: 12 }}>
                    <View style={{ flex: 1 }}>
                        <Progress.Bar
                            indeterminate={modelImporting}
                            progress={modelLoading ? Math.max(0, Math.min(1, loadProgress / 100)) : undefined}
                            color={color.primary._500}
                            borderColor={color.neutral._400}
                            height={8}
                            borderRadius={10}
                            width={null}
                        />
                    </View>
                    <Text style={{ color: color.text._300, fontSize: 12 }}>{modelLoading ? `${loadProgress}%` : '...'}</Text>
                </View>
            )}
        </View>
    )
}

export default ModelInfoHeader
