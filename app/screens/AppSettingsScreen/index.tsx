import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import HeaderTitle from '@components/views/HeaderTitle'
import { Theme } from '@lib/theme/ThemeManager'

import CharacterSettings from './CharacterSettings'
import ChatSettings from './ChatSettings'
import ChatWindowSettings from './ChatWindowSettings'
import DatabaseSettings from './DatabaseSettings'
import GeneratingSettings from './GeneratingSettings'
import LanguageSettings from './LanguageSettings'
import NotificationSettings from './NotificationSettings'
import ScreenSettings from './ScreenSettings'
import SecuritySettings from './SecuritySettings'
import StyleSettings from './StyleSettings'

type SettingsGroupProps = {
    title: string
    subtitle: string
    children: React.ReactNode
    initiallyOpen?: boolean
}

/** Collapsible sections keep the original settings controls and storage intact. */
const SettingsGroup: React.FC<SettingsGroupProps> = ({ title, subtitle, children, initiallyOpen }) => {
    const [open, setOpen] = useState(Boolean(initiallyOpen))
    const { color } = Theme.useTheme()
    return (
        <View style={{ borderRadius: 18, borderWidth: 1, borderColor: color.neutral._400, backgroundColor: color.neutral._200, marginBottom: 10, overflow: 'hidden' }}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${title} settings, ${open ? 'expanded' : 'collapsed'}`}
                onPress={() => setOpen((value) => !value)}
                style={{ paddingHorizontal: 16, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: color.text._100 }}>{title}</Text>
                    <Text style={{ fontSize: 12, lineHeight: 17, marginTop: 4, color: color.text._400 }}>{subtitle}</Text>
                </View>
                <Text style={{ color: color.primary._700, fontSize: 19, fontWeight: '600' }}>{open ? '−' : '+'}</Text>
            </Pressable>
            {open && (
                <View style={{ backgroundColor: color.neutral._100, paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: color.neutral._400 }}>
                    {children}
                </View>
            )}
        </View>
    )
}

const AppSettingsMenu = () => {
    const { t } = useTranslation()
    const { color, spacing } = Theme.useTheme()
    return (
        <KeyboardAwareScrollView
            style={{ paddingHorizontal: spacing.xl, backgroundColor: color.neutral._100 }}
            contentContainerStyle={{ paddingTop: spacing.xl2, paddingBottom: 44 }}
            keyboardShouldPersistTaps="handled">
            <HeaderTitle title={t('settings.title')} />
            <View style={{ paddingHorizontal: 5, paddingTop: 10, paddingBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, color: color.primary._800 }}>PARC / PERSONAL SPACE</Text>
                <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 6, color: color.text._100 }}>Your preferences</Text>
                <Text style={{ fontSize: 13, marginTop: 5, lineHeight: 19, color: color.text._400 }}>
                    Adjust reading, chat, performance and privacy settings on your device.
                </Text>
            </View>

            <SettingsGroup title="Appearance & Reading" subtitle="Colors, display and chat layout" initiallyOpen>
                <StyleSettings />
                <ScreenSettings />
                <ChatWindowSettings />
            </SettingsGroup>
            <SettingsGroup title="Stories & Characters" subtitle="Chat preferences, character options, generation">
                <ChatSettings />
                <CharacterSettings />
                <GeneratingSettings />
            </SettingsGroup>
            <SettingsGroup title="Privacy & Device" subtitle="Security, local storage and notifications">
                <SecuritySettings />
                <DatabaseSettings />
                <NotificationSettings />
            </SettingsGroup>
            <SettingsGroup title="Language" subtitle="Choose your application language">
                <LanguageSettings />
            </SettingsGroup>
            <Text style={{ textAlign: 'center', color: color.text._500, fontSize: 11, marginTop: 20 }}>
                PARC · PRIVATE & OFFLINE
            </Text>
        </KeyboardAwareScrollView>
    )
}

export default AppSettingsMenu
