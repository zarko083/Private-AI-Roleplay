// PARC mobile frontend QA candidate: branded theme, assets and all major screens.
const IS_DEV = process.env.APP_VARIANT === 'development'

module.exports = {
    expo: {
        name: 'PARC',
        newArchEnabled: true,
        slug: 'ChatterUI',
        version: '0.10.1',
        orientation: 'default',
        icon: './assets/images/parc-icon.png',
        scheme: 'parc',
        userInterfaceStyle: 'automatic',
        assetBundlePatterns: ['**/*'],
        ios: {
            icon: {
                dark: './assets/images/ios-dark.png',
                light: './assets/images/ios-light.png',
                tinted: './assets/images/icon.png',
            },
            supportsTablet: true,
            package: IS_DEV ? 'com.Vali98.ChatterUIDev' : 'com.Vali98.ChatterUI',
            bundleIdentifier: IS_DEV ? 'com.Vali98.ChatterUIDev' : 'com.Vali98.ChatterUI',
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/parc-adaptive-foreground.png',
                backgroundColor: '#F8F4FA',
                monochromeImage: './assets/images/parc-adaptive-foreground.png',
                // Kept the original Android package ID for in-place updates.
            },
            package: IS_DEV ? 'com.Vali98.ChatterUIDev' : 'com.Vali98.ChatterUI',
            userInterfaceStyle: 'dark',
            permissions: [
                'android.permission.FOREGROUND_SERVICE',
                'android.permission.WAKE_LOCK',
                'android.permission.FOREGROUND_SERVICE_DATA_SYNC',
            ],
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/parc-icon.png',
        },
        plugins: [
            [
                'expo-asset',
                {
                    assets: ['./assets/models/aibot.raw', './assets/models/llama3tokenizer.gguf'],
                },
            ],
            [
                'expo-build-properties',
                {
                    android: {
                        largeHeap: true,
                        usesCleartextTraffic: true,
                        enableMinifyInReleaseBuilds: !IS_DEV,
                        enableShrinkResourcesInReleaseBuilds: !IS_DEV,
                        useLegacyPackaging: true,
                        extraProguardRules: '-keep class com.rnllama.** { *; }',
                    },
                },
            ],
            [
                'expo-splash-screen',
                {
                    backgroundColor: '#100D17',
                    image: './assets/images/parc-splash.png',
                    imageWidth: 260,
                },
            ],
            [
                'expo-notifications',
                {
                    icon: './assets/images/parc-adaptive-foreground.png',
                },
            ],
            [
                './expo-build-plugins/androidattributes.plugin.js',
                {
                    'android:largeHeap': true,
                },
            ],
            ['@vali98/react-native-process-text', { label: 'Ask in PARC' }],
            [
                'expo-camera',
                {
                    cameraPermission: 'Allow PARC to access your camera',
                },
            ],
            ['expo-sqlite', { withSQLiteVecExtension: true }],
            [
                'expo-image-picker',
                {
                    photosPermission: 'PARC needs photo access for attached images',
                    colors: {
                        cropToolbarColor: '#000000',
                    },
                    dark: {
                        colors: {
                            cropToolbarColor: '#000000',
                        },
                    },
                },
            ],
            'expo-localization',
            'expo-router',
            'expo-font',
            'expo-image',
            './expo-build-plugins/bgactions.plugin.js',
            './expo-build-plugins/usercert.plugin.js',
            './expo-build-plugins/rnllama.plugin.js',
            './expo-build-plugins/copyhtp.plugin.js',
            /**
             * Future icon usage will need to be added here
             * https://github.com/oblador/react-native-vector-icons/blob/master/docs/SETUP-EXPO.md
             */
            '@react-native-vector-icons/ant-design',
            '@react-native-vector-icons/octicons',
            '@react-native-vector-icons/material-icons',
        ],
        experiments: {
            typedRoutes: true,
            reactCompiler: true,
        },
        extra: {
            router: {
                origin: false,
            },
            eas: {
                projectId: 'd588a96a-5eb0-457a-85bc-e21acfdc60e9',
            },
        },
    },
}
