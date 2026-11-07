import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import appConfig from '@appconfig'
import Drawer from '@components/views/Drawer'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Theme } from '@lib/theme/ThemeManager'

import AppModeToggle from './AppModeToggle'
import RouteList from './RouteList'
import UserInfo from './UserInfo'

const SettingsDrawer = () => {
    const { t } = useTranslation()
    const { color, spacing } = Theme.useTheme()
    const [devMode] = useMMKVBoolean(AppSettings.DevMode)

    return (
        <Drawer.Body
            drawerID={Drawer.ID.SETTINGS}
            drawerStyle={{
                width: '82%',
                paddingBottom: spacing.xl,
                backgroundColor: color.neutral._100,
                borderRightWidth: 1,
                borderRightColor: '#593765',
            }}>
            <UserInfo />
            <AppModeToggle />
            <RouteList />
            <Text
                style={{
                    alignSelf: 'center',
                    color: color.text._300,
                    marginTop: spacing.l,
                    marginBottom: spacing.xl2,
                }}>
                {(__DEV__ || devMode) && t('common.labels.devMode') + '\t'}
                {t('about.versionPrefix') + appConfig.expo.version}
            </Text>
            <View style={{
                marginHorizontal: 15, paddingHorizontal: 11, paddingVertical: 12,
                borderWidth: 1, borderColor: '#352A40', borderRadius: 12,
                backgroundColor: '#1C1624',
            }}>
                <Text style={{
                    color: '#98E8DE', fontSize: 9,
                    letterSpacing: 1.5, fontWeight: '900',
                }}>PARC / LOCAL FIRST</Text>
                <Text style={{
                    color: color.text._500, fontSize: 10, marginTop: 4,
                }}>Your private roleplay workspace.</Text>
            </View>
        </Drawer.Body>
    )
}

export default SettingsDrawer
