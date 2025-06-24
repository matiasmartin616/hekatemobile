import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useRef
} from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme/useTheme';
import ThemedText from '../components/themed-text';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition = 'top' | 'bottom';

export interface ToastOptions {
    duration?: number;
    position?: ToastPosition;
    action?: {
        text: string;
        onPress: () => void;
    };
}

export interface ToastContextType {
    showToast: (message: string, type?: ToastType, options?: ToastOptions) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const DEFAULT_DURATION = 3000;

export default function ToastProvider({ children }: { children: ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');
    const [position, setPosition] = useState<ToastPosition>('bottom');
    const [action, setAction] = useState<ToastOptions['action'] | undefined>(undefined);

    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const theme = useTheme();

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            }),
            Animated.timing(translateY, {
                toValue: position === 'bottom' ? 20 : -20,
                duration: 250,
                useNativeDriver: true
            })
        ]).start(() => {
            setVisible(false);
        });

        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
    };

    const showToast = (
        newMessage: string,
        newType: ToastType = 'info',
        options?: ToastOptions
    ) => {
        if (visible) {
            hideToast();
            setTimeout(() => {
                internalShowToast(newMessage, newType, options);
            }, 300);
        } else {
            internalShowToast(newMessage, newType, options);
        }
    };

    const internalShowToast = (
        newMessage: string,
        newType: ToastType = 'info',
        options?: ToastOptions
    ) => {
        setMessage(newMessage);
        setType(newType);
        setPosition(options?.position || 'bottom');
        setAction(options?.action);
        setVisible(true);

        translateY.setValue(position === 'bottom' ? 20 : -20);
        opacity.setValue(0);

        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start();

        const duration = options?.duration ?? DEFAULT_DURATION;

        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        if (duration > 0) {
            timeout.current = setTimeout(() => {
                hideToast();
            }, duration);
        }
    };

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, []);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'alert-circle';
            case 'warning':
                return 'warning';
            case 'info':
            default:
                return 'information-circle';
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return {
                    bg: theme.colors.light.palette.green[100],
                    icon: theme.colors.light.palette.green[500],
                    border: theme.colors.light.palette.green[300]
                };
            case 'error':
                return {
                    bg: theme.colors.light.palette.red[100],
                    icon: theme.colors.light.palette.red[500],
                    border: theme.colors.light.palette.red[300]
                };
            case 'warning':
                return {
                    bg: theme.colors.light.palette.yellow[100],
                    icon: theme.colors.light.palette.yellow[500],
                    border: theme.colors.light.palette.yellow[300]
                };
            case 'info':
            default:
                return {
                    bg: theme.colors.light.palette.blue[100],
                    icon: theme.colors.light.palette.blue[500],
                    border: theme.colors.light.palette.blue[300]
                };
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}

            {visible && (
                <Animated.View
                    style={[
                        styles.container,
                        position === 'top' ? styles.top : styles.bottom,
                        {
                            opacity,
                            transform: [{ translateY }],
                            backgroundColor: getColors().bg,
                            borderColor: getColors().border
                        }
                    ]}
                >
                    <View style={styles.contentContainer}>
                        <Ionicons
                            name={getIcon()}
                            size={24}
                            color={getColors().icon}
                            style={styles.icon}
                        />

                        <ThemedText style={styles.message} numberOfLines={2}>
                            {message}
                        </ThemedText>

                        {action && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    action.onPress();
                                    hideToast();
                                }}
                            >
                                <ThemedText style={[
                                    styles.actionText,
                                    { color: getColors().icon }
                                ]}>
                                    {action.text}
                                </ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={hideToast}
                    >
                        <Ionicons
                            name="close"
                            size={16}
                            color={theme.colors.light.neutral.gray[500]}
                        />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        maxWidth: 600,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    top: {
        top: Platform.OS === 'ios' ? 50 : 30,
    },
    bottom: {
        bottom: Platform.OS === 'ios' ? 50 : 30,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    icon: {
        marginRight: 12,
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    actionButton: {
        marginLeft: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
