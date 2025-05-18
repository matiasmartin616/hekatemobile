import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    View,
    ViewStyle,
    ImageStyle,
    ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../theme/theme';

interface ImageCarouselProps {
    images: string[];
    onImagePress?: (imageUri: string) => void;
    onAddPress?: () => void;
    maxImages?: number;
    showAddButton?: boolean;
    imageStyle?: ImageStyle;
    style?: ViewStyle;
    thumbSize?: number;
    isLoading?: boolean;
}

export default function ImageCarousel({
    images = [],
    onImagePress,
    onAddPress,
    maxImages = 5,
    showAddButton = true,
    imageStyle,
    style,
    thumbSize = 64,
    isLoading = false,
}: ImageCarouselProps) {
    const maxVisibleImages = showAddButton && images.length < maxImages
        ? maxImages - 1
        : maxImages;

    const visibleImages = images.slice(0, maxVisibleImages);
    const hasAddButton = showAddButton && images.length < maxImages;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.imageList, style]}
            contentContainerStyle={styles.imageListContent}
        >
            {visibleImages.map((uri, index) => (
                <TouchableOpacity
                    key={`${uri}-${index}`}
                    onPress={() => onImagePress && onImagePress(uri)}
                >
                    <Image
                        source={{ uri }}
                        style={[
                            styles.image,
                            { width: thumbSize, height: thumbSize },
                            imageStyle
                        ]}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            ))}

            {hasAddButton && (
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        { width: thumbSize, height: thumbSize }
                    ]}
                    onPress={onAddPress}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Ionicons name="add" size={28} color="#fff" />
                    )}
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    imageList: {
        maxHeight: 64,  // Default thumb size
    },
    imageListContent: {
        alignItems: 'center',
        paddingRight: 10,
    },
    image: {
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: colors.light.palette.blue[100],
    },
    addButton: {
        borderRadius: 12,
        backgroundColor: colors.light.palette.blue[500],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
}); 