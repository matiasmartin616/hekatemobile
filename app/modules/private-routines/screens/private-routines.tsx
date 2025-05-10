import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ViewToken, Animated, TouchableOpacity } from 'react-native';
import ThemedText from "@/app/modules/shared/components/themed-text";
import ThemedView from "@/app/modules/shared/components/themed-view";
import usePrivateRoutinesApi from "../hooks/use-private-routines-api";
import { PrivateRoutineBlock } from '../api/private-routine-block-api';
import colors from '../../shared/theme/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Define consistent measurements
const CARD_WIDTH = width * 0.6; // Card takes 70% of screen width
const ITEM_SPACING = 15; // Space between cards
const ITEM_SIZE = CARD_WIDTH + ITEM_SPACING; // Total width each item takes in the list
const ITEM_HEIGHT = 240;

// Map weekday to display name
const weekDayNames: Record<string, string> = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo'
};

// Map JavaScript day number (0-6) to our weekday format
const dayNumberToWeekDay: Record<number, string> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY'
};

interface Day {
    id: string;
    routineId: string;
    weekDay: string;
    blocks: PrivateRoutineBlock[];
}

interface PrivateRoutineData {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    days: Day[];
}

interface ViewableItemsChangedInfo {
    viewableItems: ViewToken[];
    changed: ViewToken[];
}

function RoutineItem({ description }: { description: string }) {
    return (
        <View style={styles.routineItem}>
            <ThemedText style={styles.bulletPoint}>•</ThemedText>
            <ThemedText style={styles.routineText} numberOfLines={1} ellipsizeMode="tail">
                {description}
            </ThemedText>
        </View>
    );
}

function RoutineBlock({ block }: { block: PrivateRoutineBlock }) {
    return (
        <View style={[styles.blockContainer, { borderLeftColor: block.color }]}>
            <ThemedText type="title" style={styles.blockTitle} numberOfLines={1} ellipsizeMode="tail">
                {block.title}
            </ThemedText>
            <RoutineItem description={block.description} />
        </View>
    );
}

export default function PrivateRoutinesScreen() {
    const { data, isLoading } = usePrivateRoutinesApi();
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const initialScrollDone = useRef(false);

    if (isLoading || !data) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Cargando rutinas...</ThemedText>
            </ThemedView>
        );
    }

    const originalDays = (data as unknown as PrivateRoutineData).days || [];

    // Create an "infinite" array by repeating days
    const infiniteDays = [...originalDays, ...originalDays, ...originalDays];

    // Handle scrolling to set the current day index
    const onViewableItemsChanged = useRef(({ viewableItems }: ViewableItemsChangedInfo) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index ?? 0;
            // Modulo to get the effective index in original array
            setCurrentDayIndex(index % originalDays.length);
        }
    }).current;

    // Handle scroll
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
    );

    // When reaching near the end, jump back to simulate infinite scroll
    const handleScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const contentWidth = event.nativeEvent.contentSize.width;

        // When we're getting near the start or the end, jump to the middle set
        if (offsetX < ITEM_SIZE * 2) {
            flatListRef.current?.scrollToOffset({
                offset: offsetX + (originalDays.length * ITEM_SIZE),
                animated: false
            });
        } else if (offsetX > contentWidth - (ITEM_SIZE * originalDays.length) - ITEM_SIZE * 2) {
            flatListRef.current?.scrollToOffset({
                offset: offsetX - (originalDays.length * ITEM_SIZE),
                animated: false
            });
        }
    };

    // Find today's day index 
    const findTodayIndex = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
        const todayWeekDay = dayNumberToWeekDay[dayOfWeek];

        const todayIndex = originalDays.findIndex(day => day.weekDay === todayWeekDay);
        return todayIndex >= 0 ? todayIndex : 0; // Default to first day if not found
    };

    // Handler for Edit button
    const handleEditRoutine = (day: Day) => {
        console.log('Edit routine for day:', day.weekDay);
        // Implement your edit logic here
    };

    // Initial scroll to the middle set for "infinite" scrolling
    useEffect(() => {
        if (flatListRef.current && originalDays.length > 0 && !initialScrollDone.current) {
            // Find today's day index
            const todayIndex = findTodayIndex();

            // Set current day index
            setCurrentDayIndex(todayIndex);

            // Calculate the offset in the middle set
            const middleSetIndex = originalDays.length + todayIndex;
            const offset = middleSetIndex * ITEM_SIZE;

            // Scroll to today's day
            flatListRef.current.scrollToOffset({
                offset: offset,
                animated: false
            });

            // Update scroll position for animations
            scrollX.setValue(offset);

            // Mark initialization as done
            initialScrollDone.current = true;
        }
    }, [originalDays.length, scrollX]);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    };

    const renderItem = ({ item, index }: { item: Day, index: number }) => {
        const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
            (index + 2) * ITEM_SIZE,
        ];

        // Calculate animations based on scroll position
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 0.9, 1.1, 0.9, 0.8],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 0.5, 1, 0.5, 0.6],
            extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: [
                colors.light.palette.blue[100],
                colors.light.palette.blue[100],
                colors.light.palette.blue[50],
                colors.light.palette.blue[100],
                colors.light.palette.blue[100],
            ],
            extrapolate: 'clamp',
        });

        // Calculate edit button visibility based on position
        const editBtnOpacity = scrollX.interpolate({
            inputRange: [
                (index - 0.5) * ITEM_SIZE,
                index * ITEM_SIZE,
                (index + 0.5) * ITEM_SIZE,
            ],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
        });

        if (!item || !item.blocks) {
            return (
                <View style={styles.emptyItemContainer}>
                    <ThemedText>No hay rutinas</ThemedText>
                </View>
            );
        }

        const sortedBlocks = [...item.blocks].sort((a, b) => a.order - b.order);

        // Check if this is today's date
        const today = new Date().getDay(); // 0-6
        const todayWeekDay = dayNumberToWeekDay[today];
        const isToday = item.weekDay === todayWeekDay;

        return (
            <Animated.View
                style={[
                    styles.itemContainer,
                    {
                        opacity,
                        transform: [{ scale }],
                        backgroundColor,
                    }
                ]}
            >
                {/* Header with day title and edit button */}
                <View style={styles.cardHeader}>
                    <ThemedText type="title" style={styles.dayTitle}>
                        {weekDayNames[item.weekDay]}
                        {isToday && <ThemedText style={styles.todayIndicator}> (Hoy)</ThemedText>}
                    </ThemedText>

                    <Animated.View style={{ opacity: editBtnOpacity }}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditRoutine(item)}
                        >
                            <Ionicons name="create-outline" size={16} color={colors.light.primary.main} />
                            <ThemedText style={styles.editButtonText}>Editar</ThemedText>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={styles.blocksContainer}>
                    {sortedBlocks.map((block) => (
                        <RoutineBlock key={block.id} block={block} />
                    ))}
                </View>
            </Animated.View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <Animated.FlatList
                ref={flatListRef}
                data={infiniteDays}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                horizontal
                contentContainerStyle={styles.flatListContent}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                snapToInterval={ITEM_SIZE}
                snapToAlignment="start"
                decelerationRate="fast"
                onScroll={handleScroll}
                onMomentumScrollEnd={handleScrollEnd}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                bounces={true}
                renderItem={renderItem}
                // Fixed width for each item
                getItemLayout={(data, index) => ({
                    length: ITEM_SIZE,
                    offset: ITEM_SIZE * index,
                    index,
                })}
                initialNumToRender={5}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 16,
        backgroundColor: colors.light.palette.blue[20],
    },
    flatListContent: {
        paddingHorizontal: (width - CARD_WIDTH) / 2,
    },
    itemContainer: {
        width: CARD_WIDTH,
        height: ITEM_HEIGHT,
        marginHorizontal: ITEM_SPACING / 2,
        borderRadius: 12,
        marginTop: 12,
        padding: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    emptyItemContainer: {
        width: CARD_WIDTH,
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    todayIndicator: {
        fontSize: 14,
        fontWeight: 'normal',
        color: colors.light.primary.main,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        gap: 4,
    },
    editButtonText: {
        fontSize: 12,
        color: colors.light.primary.main,
        fontWeight: '500',
    },
    blocksContainer: {
        overflow: 'hidden',
    },
    blockContainer: {
        padding: 2,
        paddingLeft: 6,
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderLeftWidth: 2,
        marginBottom: 5,
    },
    blockTitle: {
        fontSize: 10,
        fontWeight: '600',
    },
    routineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bulletPoint: {
        fontSize: 12,
        marginRight: 3,
    },
    routineText: {
        fontSize: 11
    }
});
