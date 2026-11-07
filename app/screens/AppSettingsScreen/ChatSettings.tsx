import { useTextIntentStatus } from '@vali98/react-native-process-text'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import ThemedButton from '@components/buttons/ThemedButton'
import ThemedSwitch from '@components/input/ThemedSwitch'
import SectionTitle from '@components/text/SectionTitle'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Characters } from '@lib/state/Characters'

const ChatSettings = () => {
    const { t } = useTranslation()
    const [firstMes, setFirstMes] = useMMKVBoolean(AppSettings.CreateFirstMes)
    const [chatOnStartup, setChatOnStartup] = useMMKVBoolean(AppSettings.ChatOnStartup)
    const [autoLoadUser, setAutoLoadUser] = useMMKVBoolean(AppSettings.AutoLoadUser)
    const [addressUserByName, setAddressUserByName] = useMMKVBoolean(AppSettings.AddressUserByName)
    const currentUserName = Characters.useUserStore((state) => state.card?.name?.trim())
    const [autoTitle, setAutoTitle] = useMMKVBoolean(AppSettings.AutoGenerateTitle)
    const { enabled: textIntent, setEnabled: setTextIntent } = useTextIntentStatus()
    const router = useRouter()
    return (
        <View style={{ rowGap: 8 }}>
            <SectionTitle>{t('settings.chat.title')}</SectionTitle>

            <ThemedSwitch
                label={t('settings.chat.useFirstMessage')}
                value={firstMes}
                onChangeValue={setFirstMes}
                description={t('settings.chat.useFirstMessageDescription')}
            />

            <ThemedSwitch
                label={t('settings.chat.loadChatOnStartup')}
                value={chatOnStartup}
                onChangeValue={setChatOnStartup}
                description={t('settings.chat.loadChatOnStartupDescription')}
            />

            <ThemedSwitch
                label={t('settings.chat.autoLoadUser')}
                value={autoLoadUser}
                onChangeValue={setAutoLoadUser}
                description={t('settings.chat.autoLoadUserDescription')}
            />

            <ThemedSwitch
                label="Address me by name"
                value={addressUserByName ?? false}
                onChangeValue={setAddressUserByName}
                description={
                    currentUserName && currentUserName.toLowerCase() !== 'user'
                        ? `Characters will naturally call you ${currentUserName} when it suits the conversation. The name will not appear in every reply.`
                        : 'Set your preferred name in User Profile first. Characters will use it naturally when you enable this option.'
                }
            />
            <ThemedButton
                label="Edit my name (User Profile)"
                variant="secondary"
                onPress={() => router.push('/screens/UserManagerScreen')}
            />

            <ThemedSwitch
                label={t('settings.chat.autoGenerateTitles')}
                value={autoTitle}
                onChangeValue={setAutoTitle}
                description={t('settings.chat.autoGenerateTitlesDescription')}
            />

            <ThemedSwitch
                label={t('settings.chat.askInChatterUI')}
                value={textIntent}
                onChangeValue={setTextIntent}
                description={t('settings.chat.askInChatterUIDescription')}
            />

            <ThemedButton
                label={t('settings.chat.styleButton')}
                variant="secondary"
                onPress={() => router.push('/screens/AppSettingsScreen/ChatStyleSettings')}
            />
        </View>
    )
}

export default ChatSettings
