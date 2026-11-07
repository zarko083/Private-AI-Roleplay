import { useFocusEffect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Platform, Pressable, Text, View } from 'react-native'
import { useMMKVBoolean, useMMKVNumber } from 'react-native-mmkv'
import Animated, { Easing, SlideInRight, SlideOutRight } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import ThemedButton from '@components/buttons/ThemedButton'
import HorizontalSelector from '@components/input/HorizontalSelector'
import ThemedSlider from '@components/input/ThemedSlider'
import ThemedSwitch from '@components/input/ThemedSwitch'
import SectionTitle from '@components/text/SectionTitle'
import Alert from '@components/views/Alert'
import { AppSettings, Global } from '@lib/constants/GlobalValues'
import { Llama } from '@lib/engine/Local/LlamaLocal'
import { KV } from '@lib/engine/Local/Model'
import useBackendDevices from '@lib/hooks/BackendDevices'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'
import { readableFileSize } from '@lib/utils/File'

type ModelSettingsProp = {
    modelImporting: boolean
    modelLoading: boolean
    exit: () => void
}

const deviceLabels = { GPUOpenCL: 'OpenCL', HTP0: 'Hexagon', CPU: 'CPU' }

type PresetName = 'FAST' | 'BALANCED' | 'STORY'

const ModelSettings: React.FC<ModelSettingsProp> = ({ modelImporting, modelLoading, exit }) => {
    const { t } = useTranslation()
    const { color } = Theme.useTheme()
    const { config, setConfig } = Llama.useLlamaPreferencesStore(
        useShallow((state) => ({ config: state.config, setConfig: state.setConfiguration }))
    )
    const devices = useBackendDevices()
    const [saveKV, setSaveKV] = useMMKVBoolean(AppSettings.SaveLocalKV)
    const [autoloadLocal, setAutoloadLocal] = useMMKVBoolean(AppSettings.AutoLoadLocal)
    const [showModelInChat, setShowModelInChat] = useMMKVBoolean(AppSettings.ShowModelInChat)
    const [threadCount] = useMMKVNumber(Global.CPUThreads)
    const [kvSize, setKVSize] = useState(0)
    const [selectedPreset, setSelectedPreset] = useState<PresetName | null>(null)
    const currentProfile = selectedPreset ?? (
        config?.context_length === 2048 && config?.batch === 256 ? 'FAST'
        : config?.context_length === 4096 && config?.batch === 512 ? 'BALANCED'
        : config?.context_length === 6144 && config?.batch === 512 ? 'STORY'
        : null
    )

    const getKVSize = async () => setKVSize(await KV.getKVSize())
    useEffect(() => { KV.getKVSize().then(setKVSize) }, [])

    useFocusEffect(() => {
        const handler = BackHandler.addEventListener('hardwareBackPress', () => {
            exit()
            return true
        })
        return () => handler.remove()
    })

    const applyPreset = (preset: PresetName) => {
        if (modelImporting || modelLoading) return
        const cores = Math.max(1, Math.min(4, threadCount ?? 4))
        setConfig({
            ...config,
            context_length: preset === 'FAST' ? 2048 : preset === 'BALANCED' ? 4096 : 6144,
            threads: cores,
            batch: preset === 'FAST' ? 256 : 512,
            // Preserve any manually chosen backend and GPU layers.
        })
        setSelectedPreset(preset)
    }

    const handleDeleteKV = () => {
        Alert.alert({
            title: t('model.alert.deletekv.title'),
            description: t('model.alert.deletekv.description', { size: readableFileSize(kvSize) }),
            buttons: [
                { label: t('common.actions.cancel') },
                {
                    label: t('model.alert.deletekv.title'),
                    onPress: async () => {
                        await KV.deleteKV()
                        Logger.info(t('model.toast.deletekv'))
                        getKVSize()
                    },
                    type: 'warning',
                },
            ],
        })
    }

    return (
        <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            style={{ flex: 1 }}
            entering={SlideInRight.easing(Easing.inOut(Easing.cubic))}
            exiting={SlideOutRight.easing(Easing.inOut(Easing.cubic))}>
            <View style={{ backgroundColor: color.neutral._200, borderRadius: 19, borderColor: color.neutral._400, borderWidth: 1, marginVertical: 13, padding: 16 }}>
                <Text style={{ color: color.primary._800, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }}>PERFORMANCE PROFILES</Text>
                <Text style={{ color: color.text._100, fontSize: 18, fontWeight: '700', marginTop: 8 }}>Choose your story pace</Text>
                <Text style={{ color: color.text._400, fontSize: 12, lineHeight: 18, marginTop: 5 }}>
                    Profiles adjust context, CPU threads and batch size. Reload your model after changing these settings.
                </Text>
                <View style={{ flexDirection: 'row', gap: 7, marginTop: 15 }}>
                    {([
                        ['FAST', 'Fast', '2K context'],
                        ['BALANCED', 'Balanced', '4K context'],
                        ['STORY', 'Long story', '6K context'],
                    ] as const).map(([id, title, subtitle]) => (
                        <Pressable
                            key={id}
                            disabled={modelImporting || modelLoading}
                            accessibilityRole="button"
                            accessibilityLabel={`${title} profile`}
                            onPress={() => applyPreset(id)}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                paddingHorizontal: 3,
                                paddingVertical: 12,
                                borderRadius: 13,
                                borderWidth: 1,
                                opacity: modelImporting || modelLoading ? 0.5 : 1,
                                borderColor: currentProfile === id ? color.primary._700 : color.neutral._400,
                                backgroundColor: currentProfile === id ? color.primary._100 : color.neutral._300,
                            }}>
                            <Text style={{ color: color.text._100, fontWeight: '700', fontSize: 12 }}>{title}</Text>
                            <Text style={{ color: color.text._400, fontSize: 10, marginTop: 3 }}>{subtitle}</Text>
                        </Pressable>
                    ))}
                </View>
                <Text style={{ color: color.text._500, fontSize: 11, marginTop: 12 }}>
                    These are starting points, not performance guarantees. A larger context uses more RAM.
                </Text>
            </View>

            <SectionTitle>{t('model.settings.cpu')}</SectionTitle>
            <View style={{ marginTop: 12 }} />
            {config && (
                <>
                    <ThemedSlider
                        label={t('model.maxcontext')}
                        value={config.context_length}
                        onValueChange={(value) => { setSelectedPreset(null); setConfig({ ...config, context_length: value }) }}
                        min={1024} max={32768} step={1024}
                        disabled={modelImporting || modelLoading}
                    />
                    <ThemedSlider
                        label={t('model.threads')}
                        value={config.threads}
                        onValueChange={(value) => { setSelectedPreset(null); setConfig({ ...config, threads: value }) }}
                        min={1} max={Math.max(1, threadCount ?? 8)} step={1}
                        disabled={modelImporting || modelLoading}
                    />
                    <ThemedSlider
                        label={t('model.batch')}
                        value={config.batch}
                        onValueChange={(value) => { setSelectedPreset(null); setConfig({ ...config, batch: value }) }}
                        min={16} max={1024} step={16}
                        disabled={modelImporting || modelLoading}
                    />
                    {(Platform.OS === 'ios' || devices.length > 1) && (
                        <ThemedSlider
                            label={t('model.gpulayers')}
                            value={config.gpu_layers}
                            onValueChange={(value) => setConfig({ ...config, gpu_layers: value })}
                            min={0} max={100} step={1}
                            disabled={modelImporting || modelLoading}
                        />
                    )}
                    <ThemedSwitch
                        label={t('model.contextshift')}
                        value={config.ctx_shift}
                        onChangeValue={(value) => setConfig({ ...config, ctx_shift: value })}
                    />
                    {devices.length > 1 && (
                        <HorizontalSelector
                            style={{ paddingBottom: 12 }}
                            label={t('model.backenddev')}
                            values={devices.map((item) => ({
                                label: deviceLabels[item as keyof typeof deviceLabels] ?? item,
                                value: item,
                            }))}
                            selected={config.devices?.[0]}
                            onPress={(value) => setConfig({ ...config, devices: value === 'CPU' ? [value] : [value, 'CPU'] })}
                        />
                    )}
                </>
            )}
            <SectionTitle>{t('model.settings.advanced')}</SectionTitle>
            <ThemedSwitch label={t('model.modelnamechat')} value={showModelInChat} onChangeValue={setShowModelInChat} />
            <ThemedSwitch label={t('model.autoload')} value={autoloadLocal} onChangeValue={setAutoloadLocal} />
            <ThemedSwitch
                label={t('model.savekv')}
                value={saveKV}
                onChangeValue={setSaveKV}
                description={saveKV ? '' : t('model.savekvdesc')}
            />
            {saveKV && (
                <ThemedButton
                    buttonStyle={{ marginTop: 8 }}
                    label={t('model.purgekv', { size: readableFileSize(kvSize) })}
                    onPress={handleDeleteKV}
                    variant={kvSize === 0 ? 'disabled' : 'critical'}
                />
            )}
        </Animated.ScrollView>
    )
}

export default ModelSettings
