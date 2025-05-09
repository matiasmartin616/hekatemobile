import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, Keyboard, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/useTheme';
import Ionicons from '@expo/vector-icons/Ionicons';

type ModalContextType = {
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode>(null);
    const theme = useTheme();

    const openModal = (content: ReactNode) => {
        setModalContent(content);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        // Wait for the modal animation to complete before clearing content
        setTimeout(() => {
            setModalContent(null);
        }, 300);
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <View style={styles.centeredView}>
                        <View style={[
                            styles.modalView,
                            {
                                backgroundColor: theme.colors.neutral.white,
                                shadowColor: theme.colors.neutral.black
                            }
                        ]}>
                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={theme.colors.neutral.black} />
                            </TouchableOpacity>
                            {modalContent}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxWidth: 500,
    },
}); 