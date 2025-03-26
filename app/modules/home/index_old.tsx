import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import ThemedText from '../shared/components/ThemedText';
import ThemedView from '../shared/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import homeData from './mocks/home.json';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Home() {
    // Log para verificar datos
    console.log('JSON data:', homeData);

    if (!homeData || !homeData.home_screen) {
        console.error('Data structure is invalid:', homeData);
        return <ThemedView><ThemedText>Error loading data</ThemedText></ThemedView>;
    }

    const { reading, routines, goals } = homeData.home_screen;

    // Estado para controlar el orden de las secciones
    const [sections, setSections] = useState([
        { id: 'reading', title: 'Lectura Diaria', visible: true, type: 'reading', data: reading },
        { id: 'routines', title: 'Tus Rutinas', visible: true, type: 'routines', data: routines },
        { id: 'goals', title: 'Tus Objetivos', visible: true, type: 'goals', data: goals }
    ]);

    // Función para actualizar la visibilidad de una sección
    const toggleSectionVisibility = (sectionId) => {
        setSections(sections.map(section =>
            section.id === sectionId
                ? { ...section, visible: !section.visible }
                : section
        ));
    };

    // Renderizar contenido según el tipo de sección
    const renderSectionContent = (section) => {
        if (!section.visible) return null;

        switch (section.type) {
            case 'reading':
                return (
                    <ThemedView style={styles.readingCard}>
                        <ThemedText style={styles.readingTitle}>{section.data.title}</ThemedText>
                        <ThemedText style={styles.readingContent}>{section.data.content}</ThemedText>
                    </ThemedView>
                );

            case 'routines':
                return section.data.map((routine) => (
                    <ThemedView key={routine.id} style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                            <ThemedText style={styles.itemTitle}>{routine.name}</ThemedText>
                            <ThemedText style={styles.itemTime}>{routine.time}</ThemedText>
                        </View>
                        <ThemedText style={styles.itemDescription}>{routine.description}</ThemedText>
                    </ThemedView>
                ));

            case 'goals':
                return section.data.map((goal) => (
                    <ThemedView key={goal.id} style={styles.itemCard}>
                        <ThemedText style={styles.itemTitle}>{goal.title}</ThemedText>
                        <ThemedText style={styles.itemDescription}>{goal.description}</ThemedText>
                    </ThemedView>
                ));

            default:
                return null;
        }
    };

    // Renderizar un elemento de la lista arrastrable
    const renderDraggableItem = ({ item, drag, isActive }) => (
        <TouchableOpacity
            onLongPress={drag}
            disabled={!item.visible}
            style={[
                styles.draggableSection,
                isActive && styles.draggableSectionActive
            ]}
        >
            <ThemedView style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="menu" size={20} color="#888" style={styles.dragIcon} />
                        <ThemedText style={styles.sectionTitle}>{item.title}</ThemedText>
                    </View>

                    <TouchableOpacity
                        onPress={() => toggleSectionVisibility(item.id)}
                        style={styles.toggleButton}
                    >
                        <Ionicons
                            name={item.visible ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>

                {renderSectionContent(item)}
            </ThemedView>
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.pageTitle}>Home</ThemedText>

                <ThemedText style={styles.instructions}>
                    Mantén presionado para reordenar secciones. Toca el ícono del ojo para mostrar/ocultar.
                </ThemedText>

                <DraggableFlatList
                    data={sections}
                    renderItem={renderDraggableItem}
                    keyExtractor={(item) => item.id}
                    onDragEnd={({ data }) => setSections(data)}
                    contentContainerStyle={styles.listContainer}
                />
            </ThemedView>
        </GestureHandlerRootView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    pageTitle: {
        marginBottom: 10,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    instructions: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 14,
        fontStyle: 'italic',
        opacity: 0.7,
    },
    listContainer: {
        paddingBottom: 20,
    },
    draggableSection: {
        width: width - 32, // Adjust for container padding
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    draggableSectionActive: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 999,
        transform: [{ scale: 1.02 }],
    },
    sectionContainer: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dragIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    toggleButton: {
        padding: 5,
    },
    section: {
        marginBottom: 24,
    },
    readingCard: {
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        margin: 8,
    },
    readingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    readingContent: {
        fontSize: 16,
        lineHeight: 24,
    },
    itemCard: {
        marginHorizontal: 8,
        marginVertical: 4,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        flex: 1,
    },
    itemTime: {
        fontSize: 14,
        opacity: 0.7,
    },
    itemDescription: {
        fontSize: 15,
        lineHeight: 22,
    },
});