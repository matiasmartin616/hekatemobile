import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    NativeScrollEvent,
    NativeSyntheticEvent,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/app/modules/shared/theme/theme';
import ThemedText from '@/app/modules/shared/components/themed-text';
import { DreamImage } from '@modules/dreams/api/dream-images-api';
import useDreamImageDetail from '../../home/hooks/use-dream-image-detail';

const DEFAULT_HEIGHT = 220;

interface DreamCardImageCarouselProps {
    images: DreamImage[];
}

const ImageCarouselItem = React.memo(({
    image,
    containerWidth
}: {
    image: DreamImage;
    containerWidth: number;
}) => {
    const uri = image.signedUrl || image.storageUrl;
    const { handleImagePress } = useDreamImageDetail(image.dreamId);

    return (
        <View style={[styles.imageWrapper, { width: containerWidth }]} >
            <TouchableOpacity style={[styles.imageContainer, { width: containerWidth }]} onPress={() => handleImagePress(uri)}>
                <Image
                    source={{ uri }}
                    style={styles.image}
                    resizeMode="cover"
                    onLoad={() => {
                        // Image loaded successfully
                    }}
                    onError={(error) => {
                        console.log('Image load error:', error.nativeEvent.error);
                    }}
                />
                {/* Subtle overlay for better visual depth */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.1)']}
                    style={styles.imageOverlay}
                    pointerEvents="none"
                />
            </TouchableOpacity>
        </View>
    );
});

const PlaceholderView = React.memo(() => (
    <View style={styles.placeholderContainer}>
        <LinearGradient
            colors={[colors.light.palette.blue[50], colors.light.palette.blue[100]]}
            style={styles.placeholderGradient}
        >
            <Ionicons
                name="cloudy-night-outline"
                size={64}
                color={colors.light.palette.blue[400]}
            />
            <ThemedText style={styles.placeholderText}>Sin imágenes</ThemedText>
            <ThemedText style={styles.placeholderSubtext}>Tus visualizaciones aparecerán aquí</ThemedText>
        </LinearGradient>
    </View>
));

const Counter = React.memo(({ currentIndex, totalImages }: {
    currentIndex: number;
    totalImages: number;
}) => (
    <View style={styles.counter}>
        <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
            style={styles.counterGradient}
        >
            <ThemedText style={styles.counterText}>
                {currentIndex + 1}/{totalImages}
            </ThemedText>
        </LinearGradient>
    </View>
));

export default function DreamCardImageCarousel({
    images = []
}: DreamCardImageCarouselProps) {
    const [index, setIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const handleMomentumEnd = useCallback((
        e: NativeSyntheticEvent<NativeScrollEvent>,
    ) => {
        if (containerWidth > 0) {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / containerWidth);
            setIndex(newIndex);
        }
    }, [containerWidth]);

    const handleLayout = useCallback((event: any) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    }, []);

    if (!images || images.length === 0) {
        return (
            <View style={styles.container} onLayout={handleLayout}>
                <PlaceholderView />
            </View>
        );
    }

    return (
        <View style={styles.container} onLayout={handleLayout}>
            {containerWidth > 0 && (
                <>
                    <ScrollView
                        style={styles.scrollView}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleMomentumEnd}
                        decelerationRate="fast"
                    >
                        {images.map((image) => (
                            <ImageCarouselItem
                                key={image.id}
                                image={image}
                                containerWidth={containerWidth}
                            />
                        ))}
                    </ScrollView>

                    {/* Decorative border around the carousel */}
                    <View style={styles.decorativeBorder} />
                </>
            )}

            {images.length > 1 && (
                <Counter currentIndex={index} totalImages={images.length} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: DEFAULT_HEIGHT,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: colors.light.palette.blue[300],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        backgroundColor: colors.light.neutral.white,
    },
    scrollView: {
        width: '100%',
        height: '100%',
    },
    imageWrapper: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
    },
    decorativeBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        pointerEvents: 'none',
    },
    placeholderContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    placeholderGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    placeholderText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.palette.blue[600],
        textAlign: 'center',
    },
    placeholderSubtext: {
        marginTop: 4,
        fontSize: 12,
        color: colors.light.palette.blue[400],
        textAlign: 'center',
    },
    counter: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    counterGradient: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    counterText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
