import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@shared/components/ThemedText';
import { useThemeColor } from '@shared/hooks/useThemeColor';

export function DevNavigationBar() {
    const [route, setRoute] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(-100))[0];

    const backgroundColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');

    const toggleVisibility = () => {
        if (isVisible) {
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsVisible(false));
        } else {
            setIsVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleNavigate = () => {
        if (route) {
            // Asegúrate de que la ruta comience con "/"
            const formattedRoute = route.startsWith('/') ? route : `/${route}`;
            router.push(formattedRoute);
            Keyboard.dismiss();
            setRoute('');
        }
    };

    return (
        <>
            {/* Botón flotante para mostrar/ocultar la barra */}
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={toggleVisibility}
            >
                <Ionicons
                    name={isVisible ? "chevron-up" : "navigate-outline"}
                    size={24}
                    color="white"
                />
            </TouchableOpacity>

            {/* Barra de navegación */}
            {isVisible && (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}
                >
                    <Animated.View
                        style={[
                            styles.container,
                            {
                                bottom: slideAnim,
                                backgroundColor
                            }
                        ]}
                    >
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                placeholder="Introduce una ruta (ej: /profile)"
                                placeholderTextColor="#999"
                                value={route}
                                onChangeText={setRoute}
                                onSubmitEditing={handleNavigate}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity style={styles.goButton} onPress={handleNavigate}>
                                <ThemedText style={styles.goButtonText}>IR</ThemedText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.quickLinks}>
                            <ThemedText style={styles.quickLinksTitle}>Rutas rápidas:</ThemedText>
                            <View style={styles.linksContainer}>
                                <TouchableOpacity
                                    style={styles.linkButton}
                                    onPress={() => { router.push('/(routes)/login' as any); toggleVisibility(); }}
                                >
                                    <ThemedText>Login</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.linkButton}
                                    onPress={() => { router.push('/(tabs)'); toggleVisibility(); }}
                                >
                                    <ThemedText>Home</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.linkButton}
                                    onPress={() => {
                                        router.push('/(routes)/login' as any);
                                        toggleVisibility();
                                    }}
                                >
                                    <ThemedText>Register</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
    },
    container: {
        padding: 16,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 10,
        marginRight: 8,
    },
    goButton: {
        backgroundColor: '#3c99b6',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
    },
    goButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    toggleButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#3c99b6',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    quickLinks: {
        marginTop: 15,
    },
    quickLinksTitle: {
        marginBottom: 8,
        fontWeight: '600',
    },
    linksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    linkButton: {
        backgroundColor: 'rgba(60, 153, 182, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginRight: 8,
        marginBottom: 8,
    },
});