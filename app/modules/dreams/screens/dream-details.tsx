import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
} from 'react-native-reanimated';

// ---- Shared / theme imports ----
import colors, { spacing } from '@/app/modules/shared/theme/theme';
import { useTheme } from '@/app/modules/shared/theme/useTheme';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedButton from '@/app/modules/shared/components/themed-button';
import ThemedDropdown, {
    DropdownOption,
} from '@/app/modules/shared/components/themed-dropdown';
import { useModal } from '../../shared/context/modal-context';

// ---- Feature hooks ----
import useDreamsApi from '../hooks/use-dreams-api';
import useDreamComplete from '../hooks/use-dream-complete';

// ---- Feature components ----
import ThreeDDreamCard from '../components/3d-dream-card';
import CelebrationAnimation from '@/app/modules/shared/components/celebration-animation';

// Star component
const Star = ({ style, size }: { style: any; size: number }) => {
    const opacity = useSharedValue(0.2);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: Math.random() * 1000 + 500 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[style, animatedStyle]}>
            <Ionicons name="star" size={size} color="#ffffff" />
        </Animated.View>
    );
};

// Generate stars with different sizes
const generateStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
        // Create different star sizes with more balanced range: small (3), medium (4), and large (5)
        const sizeCategory = Math.random();
        let size;
        if (sizeCategory < 0.6) {
            size = 3; // 60% small stars
        } else if (sizeCategory < 0.9) {
            size = 4; // 30% medium stars
        } else {
            size = 5; // 10% large stars
        }

        stars.push({
            id: i,
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            size: size,
        });
    }
    return stars;
};

export default function DreamDetailsScreen() {
    // ---- Navigation & params ----
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [isCelebrating, setIsCelebrating] = useState(false);
    // ---- Theme & API ----
    useTheme();
    const { dreams, isLoading, deleteDream } = useDreamsApi();
    const dream = dreams?.find((d) => d.id === id);

    // ---- Modal helpers ----
    const { openModal, closeModal } = useModal();

    // ---- Dream completion ----
    const {
        completeDream,
        isCompleting,
        showCelebration,
        hideCelebration
    } = useDreamComplete();

    const [isEditing, setIsEditing] = useState(false);

    // ---- Stars ----
    const [stars] = useState(() => generateStars(80));

    const handleDreamEdit = () => {
        setIsEditing(true);
    };

    const handleDreamDelete = () => {
        openModal(
            <View style={{ alignItems: 'center', padding: 10 }}>
                <Text style={{
                    marginBottom: 20,
                    textAlign: 'center',
                    fontSize: 16,
                    color: '#333'
                }}>
                    ¿Eliminar este sueño?
                </Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#ef4444',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 8,
                    }}
                    onPress={() => {
                        console.log('Delete confirmed');
                        deleteDream.mutate(dream!.id, {
                            onSuccess: () => {
                                console.log('Dream deleted successfully');
                                closeModal();
                                router.back();
                            },
                            onError: (error) => {
                                console.log('Delete error:', error);
                                closeModal();
                            }
                        });
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        Eliminar
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleCompleteDream = () => {
        if (dream && !isCompleting) {
            openModal(
                <View style={{ alignItems: 'center', padding: 10 }}>
                    <Text style={{
                        marginTop: 20,
                        marginBottom: 20,
                        textAlign: 'center',
                        fontSize: 16,
                        color: '#333'
                    }}>
                        ¿Estás seguro de querer completar este sueño?
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 30, marginTop: 30 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.light.palette.blue[500],
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                closeModal();   
                                setIsCelebrating(true);
                                completeDream(dream.id);
                            }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                Completar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.light.neutral.gray[200],
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                closeModal();
                            }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );

        }
    };

    const handleCelebrationComplete = () => {
        hideCelebration();
        // Navigate back after celebration
        router.back();
    };

    // ---- Dropdown actions ----
    const handleDreamAction = (opt: DropdownOption) => {

        const mappedOptions = {
            edit: handleDreamEdit,
            delete: handleDreamDelete,
            complete: handleCompleteDream,
        };

        const functionToCall = mappedOptions[opt.value as keyof typeof mappedOptions];
        if (functionToCall) {
            functionToCall();
        }
    };

    const actionOptions: DropdownOption[] = [
        { label: 'Editar', value: 'edit', icon: 'pencil' },
        { label: 'Eliminar', value: 'delete', icon: 'trash' },
    ];

    const menuTrigger = (
        <View style={styles.menuButton}>
            <Ionicons
                name="ellipsis-vertical"
                size={24}
                color="white"
            />
        </View>
    );

    // ---- Loading / empty states ----
    if (isLoading)
        return (
            <View style={styles.loadingContainer}>
                <ThemedText>Loading...</ThemedText>
            </View>
        );
    if (!dream)
        return (
            <View style={styles.loadingContainer}>
                <ThemedText>Dream not found</ThemedText>
            </View>
        );

    // **** UI ****
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[
                    colors.light.palette.blue[800], // "#2A69AC" - Azul medio
                    colors.light.palette.blue[300], // "#63B3ED" - Azul claro
                    colors.light.palette.blue[50]   // "#F5FAFF" - Muy claro (abajo)
                ]}
                style={styles.gradientContainer}>

                {/* Stars */}
                {stars.map((star) => (
                    <Star
                        key={star.id}
                        style={{
                            position: 'absolute',
                            top: star.top,
                            left: star.left,
                        }}
                        size={star.size}
                    />
                ))}

                {!isCelebrating && (
                    /* Header */
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}>
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>

                        {isEditing ? (
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() => setIsEditing(false)}>
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                        ) : (
                            <ThemedDropdown
                                options={actionOptions}
                                onSelect={handleDreamAction}
                                placeholder=""
                                variant="main"
                                width={40}
                                dropdownWidth={160}
                                customTrigger={menuTrigger}
                                hideDefaultButton
                                overlayColor="transparent"
                            />
                        )}
                    </View>
                )}

                {!isCelebrating && (
                    /* Content */
                    <View style={styles.contentContainer}>
                        <ThreeDDreamCard
                            dream={dream}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                        />

                        {!isEditing && (
                            <View style={styles.actionButtonContainer}>
                                <ThemedButton
                                    title="Completar sueño"
                                    onPress={handleCompleteDream}
                                    variant="primary"
                                    radius="pill"
                                    style={styles.completeButton}
                                    textStyle={styles.completeButtonText}
                                    icon={
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={20}
                                            color={colors.light.palette.blue[50]}
                                        />
                                    }
                                    iconPosition="left"
                                    size="medium"
                                />
                            </View>
                        )}
                    </View>
                )}

                {/* Celebration Animation */}
                <CelebrationAnimation
                    isVisible={showCelebration}
                    onAnimationComplete={handleCelebrationComplete}
                />
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.palette.blue[800],
    },
    gradientContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 45 : 25,
        position: 'relative',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.light.palette.blue[800],
    },
    scrollViewContent: {
        flexGrow: 1,
        minHeight: '100%',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 0,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
    },
    menuButton: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
    },
    deleteButton: {
        width: 60,
        height: 30,
        backgroundColor: colors.light.palette.red[500],
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    deleteButtonText: {
        color: colors.light.neutral.white,
    },
    actionButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    completeButton: {
        borderWidth: 2,
        borderColor: colors.light.palette.blue[200],
        paddingVertical: 12,
        width: '90%',
    },
    completeButtonText: {
        color: colors.light.primary.lightBlue,
        fontWeight: 'bold',
        fontSize: 16,
    },
}); 