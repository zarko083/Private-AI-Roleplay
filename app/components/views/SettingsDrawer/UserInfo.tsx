import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import Avatar from '@components/views/Avatar'
import { Characters } from '@lib/state/Characters'
import { Theme } from '@lib/theme/ThemeManager'

const UserInfo = () => {
    const router = useRouter()
    const { color, spacing, borderWidth, fontSize } = Theme.useTheme()
    const { userName, imageID } = Characters.useUserStore(
        useShallow((state) => ({
            userName: state.card?.name,
            imageID: state.card?.image_id ?? 0,
        }))
    )
    return (
        <TouchableOpacity
            onPress={() => {
                router.push('/screens/UserManagerScreen')
            }}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 12,
                marginTop: 15,
                marginHorizontal: 13,
                paddingBottom: 15,
                paddingTop: 10,
                borderBottomWidth: 1,
                borderColor: '#493451',
            }}>
            <Avatar
                targetImage={Characters.getImageDir(imageID)}
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: spacing.xl,
                    borderColor: color.primary._500,
                    borderWidth: borderWidth.m,
                    marginBottom: 0,
                }}
            />

            <View style={{ flex: 1 }}>
                <Text style={{
                    color: '#98E8DE', fontSize: 9, letterSpacing: 1.5,
                    fontWeight: '900',
                }}>PARC / PROFILE</Text>
                <Text numberOfLines={1} style={{
                    fontSize: 17, fontWeight: '800',
                    marginTop: 5, color: color.text._100,
                }}>{userName || 'Your persona'}</Text>
                <Text style={{
                    color: color.text._500, fontSize: 10, marginTop: 2,
                }}>Edit your identity ›</Text>
            </View>
        </TouchableOpacity>
    )
}

export default UserInfo
