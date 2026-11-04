import AntDesign from '@react-native-vector-icons/ant-design/static'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

import { Llama } from '@lib/engine/Local/LlamaLocal'
import { Theme } from '@lib/theme/ThemeManager'

/** Model indicator shown when the user's Show Model in Chat setting is enabled. */
const ChatModelName = () => {
    const model = Llama.useLlamaModelStore((state) => state.model)
    const { color } = Theme.useTheme()
    const router = useRouter()

    return (
        <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.push('/screens/ModelManagerScreen')}
            style={{
                marginHorizontal: 16,
                marginVertical: 3,
                backgroundColor: color.neutral._200,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: model ? color.primary._400 : color.neutral._400,
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 8,
            }}>
            <View
                style={{
                    width: 7,
                    height: 7,
                    borderRadius: 8,
                    backgroundColor: model ? color.primary._700 : color.text._500,
                }}
            />
            <Text
                numberOfLines={1}
                style={{ flex: 1, fontSize: 12, color: color.text._300 }}>
                {model ? model.name : 'No model loaded — tap to select'}
            </Text>
            <AntDesign name="right" size={13} color={color.text._400} />
        </TouchableOpacity>
    )
}

export default ChatModelName
