import AntDesign from '@react-native-vector-icons/ant-design/static'
import { Text, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

const ModelEmpty = () => {
    const { color } = Theme.useTheme()
    return (
        <View style={{ paddingHorizontal: 22, paddingVertical: 42, alignItems: 'center', rowGap: 8 }}>
            <View style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center', backgroundColor: color.neutral._200, borderRadius: 22 }}>
                <AntDesign name="database" size={28} color={color.primary._700} />
            </View>
            <Text style={{ fontSize: 17, fontWeight: '700', color: color.text._100, marginTop: 6 }}>Your model library is empty</Text>
            <Text style={{ fontSize: 13, lineHeight: 19, textAlign: 'center', color: color.text._400 }}>
                Use the add button in the top right to import a GGUF file or link an existing model on your phone.
            </Text>
        </View>
    )
}

export default ModelEmpty
