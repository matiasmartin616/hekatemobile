import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
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
import colors from '@/app/modules/shared/theme/theme';
import { useTheme } from '@/app/modules/shared/theme/useTheme';
import ThemedText from '@/app/modules/shared/components/themed-text';
import ThemedDropdown, {
    DropdownOption,
} from '@/app/modules/shared/components/themed-dropdown';
import { useModal } from '../../shared/context/modal-context';

// ---- Feature hooks ----
import useDreamsApi from '../hooks/use-dreams-api';
import useDreamImagesApi from '../hooks/use-dream-images-api';
import useDreamImageCreate from '../../home/hooks/use-dream-image-create';
import useDreamImageDetail from '../../home/hooks/use-dream-image-detail';
import useDreamVisualize from '../../home/hooks/use-dream-visualize';

// ---- Feature components ----
import EditDreamForm from '../components/edit-dream-form';
import ThreeDDreamCard from '../components/3d-dream-card';

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

    // ---- Theme & API ----
    useTheme();
    const { dreams, isLoading, deleteDream } = useDreamsApi();
    const dream = dreams?.find((d) => d.id === id);

    // ---- Modal helpers ----
    const { openModal, closeModal } = useModal();

    const isVisualized = dream?.todayVisualizations
        ? dream.todayVisualizations > 0
        : false;
    const { handleDreamVisualize } = useDreamVisualize(
        id as string,
        isVisualized
    );

    // ---- Scroll control ----
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    // ---- Stars ----
    const [stars] = useState(() => generateStars(80));

    // ---- Dropdown actions ----
    const handleDreamAction = (opt: DropdownOption) => {
        switch (opt.value) {
            case 'edit':
                openModal(<EditDreamForm dream={dream!} />);
                break;
            case 'delete':
                openModal(
                    <View>
                        <ThemedText>¿Eliminar este sueño?</ThemedText>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() =>
                                deleteDream.mutate(dream!.id, {
                                    onSuccess: () => {
                                        closeModal();
                                        router.back();
                                    },
                                })
                            }>
                            <ThemedText style={styles.deleteButtonText}>
                                Eliminar
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                );
                break;
            case 'complete':
                handleDreamVisualize();
                break;
        }
    };

    const actionOptions: DropdownOption[] = [
        { label: 'Editar', value: 'edit', icon: 'pencil' },
        { label: 'Visualizar', value: 'complete', icon: 'eye-outline' },
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

                {/* Header */}
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
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    <ThreeDDreamCard
                        dream={dream}
                    />
                </View>
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
        paddingVertical: 15,
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
}); 