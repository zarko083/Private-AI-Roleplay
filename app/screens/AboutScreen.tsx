import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import appConfig from '@appconfig'
import ThemedButton from '@components/buttons/ThemedButton'
import HeaderTitle from '@components/views/HeaderTitle'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'

const AboutScreen = () => {
    const { t } = useTranslation()
    const styles = useStyles()
    const { spacing } = Theme.useTheme()
    const [counter, setCounter] = useState<number>(0)
    const [devMode, setDevMode] = useMMKVBoolean(AppSettings.DevMode)

    const updateCounter = () => {
        if (devMode) return
        if (counter === 6) {
            Logger.infoToast(t('about.devMode.enabledMessage'))
            setDevMode(true)
        }
        setCounter(counter + 1)
    }

    const version = t('about.versionPrefix') + appConfig.expo.version
    return (
        <View style={styles.container}>
            <HeaderTitle title={t('common.navigation.about')} />
            <TouchableOpacity activeOpacity={0.8} onPress={updateCounter}>
                <Image source={require('../../assets/images/parc-icon.png')} style={styles.icon} />
            </TouchableOpacity>

            <Text style={styles.titleText}>PARC Studio</Text>
            <Text style={styles.subtitleText}>
                {t('common.labels.version')} {version}{' '}
                {devMode && `[${t('common.labels.devMode')}]`}
            </Text>
            {devMode && (
                <ThemedButton
                    label={t('about.devMode.disableAction')}
                    variant="critical"
                    buttonStyle={{
                        marginTop: spacing.xl,
                    }}
                    onPress={() => {
                        setCounter(0)
                        setDevMode(false)
                        Logger.info(t('about.devMode.disabledMessage'))
                    }}
                />
            )}

            <Text style={styles.body}>
                Your personal AI roleplay studio, designed for offline use.
            </Text>
            <Text style={{ ...styles.body, marginBottom: spacing.xl3 }}>
                Local models, saved characters and conversations stay on your device.
            </Text>
            <Text style={{ ...styles.subtitleText, marginBottom: spacing.m }}>
                SOURCE & LICENCES
            </Text>
            <ThemedButton
                buttonStyle={{ marginTop: spacing.m }}
                variant="secondary"
                label="PARC Repository"
                iconName="github"
                iconSize={20}
                onPress={() => {
                    Linking.openURL('https://github.com/zarko083/Private-AI-Roleplay')
                }}
            />
            <Text style={{ ...styles.subtitleText, marginTop: spacing.xl }}>
                Open-source attribution and licence details are in the repository.
            </Text>
        </View>
    )
}

export default AboutScreen

const useStyles = () => {
    const { color, spacing } = Theme.useTheme()

    return StyleSheet.create({
        container: {
            paddingHorizontal: spacing.xl3,
            paddingBottom: spacing.xl2,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        titleText: { color: color.text._100, fontSize: 32, marginTop: 16 },
        subtitleText: { color: color.text._400 },
        body: { color: color.text._100, marginTop: spacing.l, textAlign: 'center' },
        icon: {
            width: 120,
            height: 120,
            backgroundColor: 'black',

            borderRadius: 60,
        },
    })
}
