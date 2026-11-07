import { useRouter } from 'expo-router'
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

type GroupProps = {
    number: string
    title: string
    subtitle: string
    children: React.ReactNode
    initiallyOpen?: boolean
}

const SettingsGroup: React.FC<GroupProps> = ({
    number, title, subtitle, children, initiallyOpen = false,
}) => {
    const [open, setOpen] = useState(initiallyOpen)
    const { color } = Theme.useTheme()
    return (
        <View style={{
            borderRadius: 18, overflow: 'hidden',
            borderWidth: 1, borderColor: open ? '#6C3C78' : '#3E2C48',
            marginBottom: 10, backgroundColor: '#211A2A',
        }}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={title + (open ? ', collapse' : ', expand')}
                onPress={() => setOpen((prev) => !prev)}
                style={{
                    flexDirection: 'row', alignItems: 'center',
                    columnGap: 11, minHeight: 73,
                    paddingHorizontal: 15, paddingVertical: 13,
                }}>
                <Text style={{
                    color: open ? '#98E8DE' : '#A984B7',
                    fontSize: 12, fontWeight: '900',
                }}>{number}</Text>
                <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{
                        color: color.text._100, fontSize: 15, fontWeight: '800',
                    }}>{title}</Text>
                    <Text style={{
                        color: color.text._400, fontSize: 11, marginTop: 4,
                    }}>{subtitle}</Text>
                </View>
                <View style={{
                    width: 30, height: 30, borderRadius: 9,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#35273F',
                }}>
                    <Text style={{ color: '#EBA9D6', fontSize: 18, fontWeight: '700' }}>
                        {open ? '−' : '+'}
                    </Text>
                </View>
            </Pressable>
            {open && (
                <View style={{
                    borderTopWidth: 1, borderColor: '#51365A',
                    backgroundColor: color.neutral._100,
                    paddingHorizontal: 13, paddingVertical: 12,
                }}>{children}</View>
            )}
        </View>
    )
}

const AppSettingsMenu = () => {
    const { t } = useTranslation()
    const { color } = Theme.useTheme()
    const router = useRouter()

    const shortcut = (label: string, description: string, action: () => void) => (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={action}
            style={{
                flex: 1, paddingHorizontal: 14, paddingVertical: 14,
                backgroundColor: '#30203C', borderRadius: 14,
                borderWidth: 1, borderColor: '#624170',
            }}>
            <Text style={{
                color: '#98E8DE', fontSize: 9, letterSpacing: 1.2, fontWeight: '900',
            }}>{label}</Text>
            <Text numberOfLines={2} style={{
                color: color.text._200, fontSize: 12, marginTop: 5,
            }}>{description}</Text>
            <Text style={{ color: '#D552A3', fontSize: 19, marginTop: 2 }}>›</Text>
        </Pressable>
    )

    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: color.neutral._100 }}
            contentContainerStyle={{
                paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48,
            }}
            keyboardShouldPersistTaps="handled">
            <HeaderTitle title={t('settings.title')} />
            <View style={{
                paddingHorizontal: 4, marginBottom: 19,
                borderBottomWidth: 1, borderColor: color.neutral._400,
                paddingBottom: 16,
            }}>
                <Text style={{
                    fontSize: 10, letterSpacing: 2.2, color: '#98E8DE', fontWeight: '900',
                }}>PARC / CONTROL CENTRE</Text>
                <Text style={{
                    fontSize: 27, fontWeight: '900', letterSpacing: -1,
                    color: color.text._100, marginTop: 9,
                }}>Make it yours.</Text>
                <Text style={{
                    color: color.text._400, fontSize: 12, lineHeight: 18,
                    marginTop: 6,
                }}>Manage how PARC reads, writes and runs on this device.</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
                {shortcut('AI ENGINE', 'Local GGUF models', () => router.push('/screens/ModelManagerScreen'))}
                {shortcut('GENERATION', 'Sampler profiles', () => router.push('/screens/SamplerManagerScreen'))}
            </View>
            <Text style={{
                fontSize: 10, color: color.text._500, letterSpacing: 1.5,
                fontWeight: '900', marginBottom: 11, marginLeft: 3,
            }}>PREFERENCES</Text>
            <SettingsGroup number="01" title="Appearance" subtitle="Colours, reading and layout">
                <StyleSettings />
                <ScreenSettings />
                <ChatWindowSettings />
            </SettingsGroup>
            <SettingsGroup number="02" title="Stories & Characters" subtitle="Roleplay, user persona and generation">
                <ChatSettings />
                <CharacterSettings />
                <GeneratingSettings />
            </SettingsGroup>
            <SettingsGroup number="03" title="Privacy & Device" subtitle="Local storage, security and notifications">
                <SecuritySettings />
                <DatabaseSettings />
                <NotificationSettings />
            </SettingsGroup>
            <SettingsGroup number="04" title="Language" subtitle="Application language">
                <LanguageSettings />
            </SettingsGroup>
            <Text style={{
                textAlign: 'center', marginTop: 18, color: color.text._500,
                fontSize: 10, letterSpacing: 1.5, fontWeight: '700',
            }}>PARC / PRIVATE BY DESIGN</Text>
        </KeyboardAwareScrollView>
    )
}

export default AppSettingsMenu
