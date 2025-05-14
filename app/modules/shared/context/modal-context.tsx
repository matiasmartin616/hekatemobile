import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
} from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../theme/useTheme';

export interface ModalContextType {
    openModal: (content: ReactNode, closeOnOutsideClick?: boolean) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalProvider({ children }: { children: ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);
    const [closeOnOutsideClick, setCloseOnOutsideClick] = useState(false);
    const theme = useTheme();

    const openModal = (c: ReactNode, closeOutside = false) => {
        setContent(c);
        setCloseOnOutsideClick(closeOutside);
        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
        setTimeout(() => setContent(null), 300);
    };

    const handleOutsideClick = () => {
        Keyboard.dismiss();
        if (closeOnOutsideClick) {
            closeModal();
        }
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            <Modal transparent animationType="fade" visible={visible} onRequestClose={closeModal}>
                <TouchableWithoutFeedback onPress={handleOutsideClick}>
                    <View style={styles.backdrop}>
                        <TouchableWithoutFeedback>
                            <View
                                style={[
                                    styles.modalView,
                                    {
                                        backgroundColor: theme.colors.light.palette.blue[50],
                                        shadowColor: theme.colors.light.palette.blue[900],
                                    },
                                ]}
                            >
                                <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                                    <Ionicons
                                        name="close"
                                        size={28}
                                        color={theme.colors.light.palette.blue[500]}
                                    />
                                </TouchableOpacity>

                                {/* El contenido dicta el tamaño */}
                                {content}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ModalContext.Provider>
    );
}

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error('useModal must be used within a ModalProvider');
    return ctx;
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        borderRadius: 16,
        padding: 20,
        maxWidth: '90%',
        maxHeight: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: '90%',
    },
    closeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        zIndex: 10,
    },
});
