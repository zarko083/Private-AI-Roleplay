import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, Text, View } from 'react-native'
import Animated, { Easing, SlideInLeft, SlideOutLeft } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import HorizontalSelector from '@components/input/HorizontalSelector'
import SectionTitle from '@components/text/SectionTitle'
import HeaderButton from '@components/views/HeaderButton'
import HeaderTitle from '@components/views/HeaderTitle'
import { Llama } from '@lib/engine/Local/LlamaLocal'
import { Model } from '@lib/engine/Local/Model'
import { Theme } from '@lib/theme/ThemeManager'

import ModelEmpty from './ModelEmpty'
import ModelInfoHeader from './ModelInfoHeader'
import ModelItem from './ModelItem'
import ModelNewMenu from './ModelNewMenu'
import ModelSettings from './ModelSettings'

const ModelManagerScreen = () => {
    const { t } = useTranslation()
    const { color, spacing } = Theme.useTheme()
    const { data: mmprojLinks } = useLiveQuery(Model.getMMPROJLinks())
    const { data: modelList, updatedAt: modelUpdatedAt } = useLiveQuery(Model.getModelListQuery2(), [mmprojLinks])
    const { data: mmprojList } = useLiveQuery(Model.getMMPROJListQuery())
    const [showSettings, setShowSettings] = useState(false)
    const [modelLoading, setModelLoading] = useState(false)
    const [modelImporting, setModelImporting] = useState(false)
    const setLoadProgress = Llama.useLlamaModelStore((state) => state.setLoadProgress)

    const data = [
        { title: t('model.title'), data: modelList ?? [] },
        { title: t('model.mtmd'), data: mmprojList ?? [] },
    ]

    return (
        <SafeAreaView
            edges={['bottom']}
            style={{ paddingTop: spacing.l, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, flex: 1, backgroundColor: color.neutral._100 }}>
            <HeaderTitle title={showSettings ? 'Engine Settings' : 'PARC Engine'} />
            <HeaderButton
                headerRight={() =>
                    !showSettings && (
                        <ModelNewMenu modelImporting={modelImporting} setModelImporting={setModelImporting} />
                    )
                }
            />

            {!showSettings && (
                <Animated.View style={{ flex: 1 }} entering={SlideInLeft.easing(Easing.inOut(Easing.cubic))} exiting={SlideOutLeft.easing(Easing.inOut(Easing.cubic))}>
                    <ModelInfoHeader
                        modelImporting={modelImporting}
                        modelLoading={modelLoading}
                        modelListLength={modelList?.length ?? 0}
                        modelUpdatedAt={modelUpdatedAt}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: 4, marginBottom: 4 }}>
                        <Text style={{ color: color.text._100, fontSize: 15, fontWeight: '800' }}>Your models</Text>
                        <Text style={{ color: '#98E8DE', fontSize: 11 }}>{modelList?.length ?? 0} models</Text>
                    </View>
                    <SectionList
                        style={{ flex: 1, marginTop: 5 }}
                        sections={data}
                        renderItem={({ item }) => (
                            <ModelItem
                                item={item}
                                mmprojList={mmprojList}
                                modelLoading={modelLoading}
                                setModelLoading={(value: boolean) => {
                                    if (value) setLoadProgress(0)
                                    setModelLoading(value)
                                }}
                                modelImporting={modelImporting}
                            />
                        )}
                        renderSectionHeader={({ section: { title, data: sectionData } }) =>
                            (mmprojList?.length ?? 0) > 0 ? (
                                <SectionTitle visible={sectionData.length > 0} style={{ marginVertical: 9 }}>
                                    {title}
                                </SectionTitle>
                            ) : null
                        }
                        keyExtractor={(item) => item.id.toString()}
                        removeClippedSubviews={false}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => <ModelEmpty />}
                    />
                </Animated.View>
            )}

            {showSettings && (
                <ModelSettings
                    modelImporting={modelImporting}
                    modelLoading={modelLoading}
                    exit={() => setShowSettings(false)}
                />
            )}
            <HorizontalSelector
                style={{ flex: 0 }}
                values={[
                    { label: t('model.title'), value: false },
                    { label: t('common.navigation.settings'), value: true },
                ]}
                selected={showSettings}
                onPress={setShowSettings}
            />
        </SafeAreaView>
    )
}

export default ModelManagerScreen
