import { ImageBackground, StyleSheet } from 'react-native';
import { View } from 'react-native';

interface BackgroundWrapperProps {
    children: React.ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
    return (
        <ImageBackground
            source={require('@/assets/images/app-main-background.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.content}>
                {children}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
}); 