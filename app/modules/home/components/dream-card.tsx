import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/app/modules/shared/theme/theme';
import useDreamImagesApi from '../../dreams/hooks/use-dream-images-api';
import ImageCarousel from '@/app/modules/shared/components/image-carousel';
import ThemedButton from '@/app/modules/shared/components/themed-button';
import useDreamCardSeeDetail from '../hooks/use-dream-card-see-detail';
import useDreamImageCreate from '../hooks/use-dream-image-create';
import useDreamImageDetail from '../hooks/use-dream-image-detail';
import useDreamVisualize from '../hooks/use-dream-visualize';
import ThemedText from '../../shared/components/themed-text';
import ThemedView from '../../shared/components/themed-view';
export interface DreamCardProps {
    id: string;
    title: string;
    description: string;
    canVisualize: boolean;
    slotVisualized: boolean;
    onViewComplete?: () => void;
}

export default function DreamCard({
    id,
    title,
    description,
    canVisualize,
    slotVisualized,
}: DreamCardProps) {
    const { images } = useDreamImagesApi(id);
    const isVisualized = !canVisualize || slotVisualized;
    const { handleSeeDreamDetail } = useDreamCardSeeDetail();
    const { handleAddImage, isUploadingImage } = useDreamImageCreate(id);
    const { handleImagePress } = useDreamImageDetail(id);
    const { handleDreamVisualize, isVisualizing } = useDreamVisualize(id, isVisualized);

    return (
        <ThemedView style={styles.card} variant="secondary">
            <ThemedView style={styles.headerRow} variant="secondary">
                <ThemedText style={styles.title}>{title}</ThemedText>
                <ThemedButton
                    onPress={() => handleSeeDreamDetail(id)}
                    title="Más"
                    icon={<Ionicons name="arrow-forward" size={14} color={colors.light.palette.blue[500]} />}
                    iconPosition="right"
                    variant="plainLink"
                    size="xs"
                    style={styles.moreButton}
                    textStyle={styles.viewComplete}
                    iconOnly={false}
                    gap={2}
                />
            </ThemedView>

            <ThemedText style={styles.description} numberOfLines={2}>
                {description}
            </ThemedText>

            <ImageCarousel
                images={images?.map(image => image.signedUrl || image.storageUrl) || []}
                onImagePress={handleImagePress}
                onAddPress={handleAddImage}
                maxImages={2}
                thumbSize={64}
                style={styles.imageList}
                isLoading={isUploadingImage}
            />

            {/* Visualize Button */}
            <ThemedButton
                title={isVisualizing ? "Cargando..." : (isVisualized ? "Visualizado" : "Visualizar")}
                onPress={handleDreamVisualize}
                disabled={isVisualized || isVisualizing}
                loading={isVisualizing}
                variant="outline"
                radius="pill"
                style={[
                    styles.visualizeBtn,
                    isVisualized && styles.visualizedBtn
                ]}
                textStyle={isVisualized ? styles.visualizedText : styles.visualizeText}
                icon={!isVisualizing ? (
                    <Ionicons
                        name={isVisualized ? "checkmark" : "eye-outline"}
                        size={20}
                        color={isVisualized ? colors.light.palette.blue[700] : colors.light.palette.blue[500]}
                    />
                ) : undefined}
            />
        </ThemedView>
    );
}

const THUMB_SIZE = 64;

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 14,
        marginRight: 16,
        width: 300,
        shadowColor: colors.light.palette.blue[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        elevation: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.light.neutral.black,
        flex: 1,
    },
    viewComplete: {
        color: colors.light.primary.mainBlue,
        fontWeight: '600',
        fontSize: 13,
    },
    description: {
        color: colors.light.neutral.black,
        fontSize: 13,
        marginBottom: 8,
    },
    imageList: {
        marginBottom: 12,
        maxHeight: THUMB_SIZE,
    },
    visualizeBtn: {
        borderWidth: 1,
        borderColor: colors.light.palette.blue[500],
        paddingVertical: 6,
    },
    visualizeText: {
        color: colors.light.palette.blue[500],
        fontWeight: 'bold',
        fontSize: 15,
    },
    visualizedBtn: {
        borderColor: colors.light.palette.blue[700],
        backgroundColor: colors.light.palette.blue[100],
    },
    visualizedText: {
        color: colors.light.palette.blue[700],
    },
    moreButton: {
        padding: 0,
        minWidth: 0,
        backgroundColor: 'transparent',
    },
});
