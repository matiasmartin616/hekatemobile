import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, Animated, BackHandler } from "react-native";
import ThemedView from "./themed-view";
import ThemedText from "./themed-text";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from "../theme/useTheme";

export interface DropdownOption {
    label: string;
    value: string | number;
    icon?: string;
}

export interface ThemedDropdownProps {
    options: DropdownOption[];
    selectedValue?: string | number;
    onSelect: (option: DropdownOption) => void;
    placeholder?: string;
    variant?: 'main' | 'secondary' | 'tertiary' | 'quaternary' | 'lightYellow';
    disabled?: boolean;
    width?: number;
    maxHeight?: number;
    customTrigger?: React.ReactNode;
    hideDefaultButton?: boolean;
    dropdownWidth?: number;
    overlayColor?: string;
}

export default function ThemedDropdown({
    options,
    selectedValue,
    onSelect,
    placeholder = "Select an option",
    variant = "secondary",
    disabled = false,
    width,
    maxHeight = 200,
    customTrigger,
    hideDefaultButton = false,
    dropdownWidth,
    overlayColor = 'rgba(0,0,0,0.3)'
}: ThemedDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownTop, setDropdownTop] = useState(0);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const [calculatedDropdownWidth, setCalculatedDropdownWidth] = useState(0);
    const [showAbove, setShowAbove] = useState(false);
    const DropdownButton = useRef<View>(null);
    const { colors } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const selectedOption = options.find(option => option.value === selectedValue);

    const toggleDropdown = () => {
        if (disabled) return;

        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };

    const openDropdown = () => {
        DropdownButton.current?.measure((fx, fy, width, height, px, py) => {
            const screenHeight = Dimensions.get('window').height;
            const screenWidth = Dimensions.get('window').width;
            const spaceBelow = screenHeight - py - height;
            const shouldShowAbove = spaceBelow < maxHeight && py > maxHeight;

            // Calculamos el ancho del dropdown
            const finalDropdownWidth = dropdownWidth || Math.max(width, 150);

            // Aseguramos que el dropdown no se salga de la pantalla por la derecha
            let leftPosition = px;
            if (leftPosition + finalDropdownWidth > screenWidth - 10) {
                leftPosition = screenWidth - finalDropdownWidth - 10;
            }

            setDropdownTop(shouldShowAbove ? py - maxHeight : py + height);
            setDropdownLeft(leftPosition);
            setCalculatedDropdownWidth(finalDropdownWidth);
            setShowAbove(shouldShowAbove);
            setIsOpen(true);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    const closeDropdown = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setIsOpen(false);
        });
    };

    const handleSelect = (option: DropdownOption) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setIsOpen(false);
            // Wait for modal to fully close before calling onSelect
            setTimeout(() => {
                onSelect(option);
            }, 50);
        });
    };

    useEffect(() => {
        const handleBackPress = () => {
            if (isOpen) {
                closeDropdown();
                return true;
            }
            return false;
        };

        if (isOpen) {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                handleBackPress
            );
            return () => backHandler.remove();
        }
    }, [isOpen]);

    const renderDropdownButton = () => (
        <ThemedView
            variant={variant}
            style={[
                styles.button,
                { opacity: disabled ? 0.6 : 1 }
            ]}
        >
            <View style={styles.buttonContent}>
                {selectedOption?.icon && (
                    <Ionicons
                        name={selectedOption.icon as any}
                        size={18}
                        color={colors.light.neutral.gray[700]}
                        style={styles.iconLeft}
                    />
                )}

                <ThemedText style={styles.buttonText}>
                    {selectedOption?.label || placeholder}
                </ThemedText>

                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.light.neutral.gray[700]}
                />
            </View>
        </ThemedView>
    );

    const renderDropdown = () => {
        const dropdownStyle = {
            top: dropdownTop,
            left: dropdownLeft,
            width: calculatedDropdownWidth,
            maxHeight,
        };

        return (
            isOpen && (
                <Modal
                    transparent
                    animationType="none"
                    onRequestClose={closeDropdown}
                >
                    <TouchableOpacity
                        style={[styles.overlay, { backgroundColor: overlayColor }]}
                        activeOpacity={1}
                        onPress={closeDropdown}
                    >
                        <Animated.View
                            style={[
                                styles.dropdown,
                                dropdownStyle,
                                { opacity: fadeAnim }
                            ]}
                        >
                            <ThemedView variant="main" style={styles.dropdownContent}>
                                <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                                    {options.map((option) => (
                                        <TouchableOpacity
                                            key={option.value.toString()}
                                            style={[
                                                styles.option,
                                                selectedValue === option.value && styles.selectedOption
                                            ]}
                                            onPress={() => handleSelect(option)}
                                        >
                                            {option.icon && (
                                                <Ionicons
                                                    name={option.icon as any}
                                                    size={18}
                                                    color={
                                                        selectedValue === option.value
                                                            ? colors.light.primary.main
                                                            : colors.light.neutral.gray[700]
                                                    }
                                                    style={styles.iconLeft}
                                                />
                                            )}
                                            <ThemedText
                                                style={[
                                                    styles.optionText,
                                                    selectedValue === option.value && styles.selectedOptionText
                                                ]}
                                            >
                                                {option.label}
                                            </ThemedText>
                                            {selectedValue === option.value && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={18}
                                                    color={colors.light.primary.main}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </ThemedView>
                        </Animated.View>
                    </TouchableOpacity>
                </Modal>
            )
        );
    };

    const renderTrigger = () => {
        if (customTrigger) {
            return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={toggleDropdown}
                    disabled={disabled}
                >
                    {customTrigger}
                </TouchableOpacity>
            );
        }

        if (hideDefaultButton) {
            return null;
        }

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleDropdown}
                disabled={disabled}
            >
                {renderDropdownButton()}
            </TouchableOpacity>
        );
    };

    return (
        <View ref={DropdownButton} style={width ? { width } : undefined}>
            {renderTrigger()}
            {isOpen && renderDropdown()}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        minHeight: 48,
        justifyContent: 'center',
        width: '100%',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonText: {
        flex: 1,
        fontSize: 14,
    },
    overlay: {
        flex: 1,
    },
    dropdown: {
        position: 'absolute',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    dropdownContent: {
        width: '100%',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    selectedOption: {
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    optionText: {
        flex: 1,
        fontSize: 14,
    },
    selectedOptionText: {
        fontWeight: '500',
    },
    iconLeft: {
        marginRight: 10,
    },
});