import { StyleSheet, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import ThemedText from '@/app/modules/shared/components/themed-text';
import BackgroundWrapper from '@/app/modules/shared/components/background-wrapper';


export default function WelcomeScreen() {
    return (
        <BackgroundWrapper>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/logo-hekate-circle.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <ThemedText style={styles.appNameGray900}>Hekate</ThemedText>
                </View>

                <View style={styles.titleContainerAdjusted}>
                    <ThemedText style={styles.titleGray900}>¿Tienes sueños?</ThemedText>
                    <ThemedText style={styles.subtitleGray900}>
                        Crea rutinas diarias para llegar a cumplir tus metas.
                    </ThemedText>
                </View>

                {/* Divider con líneas y texto para login */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <ThemedText style={styles.dividerText}>Ya tienes cuenta, inicia sesión</ThemedText>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.loginSection}>
                    <View style={styles.loginRow}>
                        <Link href="/(routes)/(public)/auth/login" asChild replace>
                            <TouchableOpacity style={styles.loginButtonRow}>
                                <ThemedText style={styles.buttonTextWhite}>Email</ThemedText>
                            </TouchableOpacity>
                        </Link>
                        <TouchableOpacity style={styles.loginButtonRow}>
                            <ThemedText style={styles.buttonTextWhite}>Google</ThemedText>
                            <Image source={require('@/assets/images/gmail_icon2.png')} style={styles.gmailIcon} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <ThemedText style={styles.forgotPasswordTextGray900}>
                            ¿Olvidaste tu contraseña?
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Divider con líneas y texto para registro */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <ThemedText style={styles.dividerText}>Si no tienes cuenta</ThemedText>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.registerSection}>
                    <Link href="/(routes)/(public)/auth/register" asChild replace>
                        <TouchableOpacity style={styles.registerButtonFull}>
                            <ThemedText style={styles.buttonTextWhite}>
                                Regístrate
                            </ThemedText>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </BackgroundWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 48,
        justifyContent: 'space-between',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'center',
        marginTop: 32,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 0,
    },
    appNameGray900: {
        fontSize: 16,
        color: '#171923',
        fontWeight: '400',
        marginTop: 4,
        marginBottom: 0,
        fontFamily: 'Inter',
    },
    titleContainerAdjusted: {
        alignItems: 'center',
        marginBottom: 56,
        width: '95%',
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    titleGray900: {
        fontSize: 36,
        color: '#171923',
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
        lineHeight: 36,
        fontFamily: 'Inter',
    },
    subtitleGray900: {
        fontSize: 20,
        color: '#171923',
        textAlign: 'center',
        opacity: 0.9,
        marginBottom: 100,
        fontFamily: 'Inter',
    },
    loginSection: {
        marginBottom: 0,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignSelf: 'center',
        marginBottom: 4,
    },
    loginButtonRow: {
        backgroundColor: '#1A365D',
        borderRadius: 24,
        height: 48,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        borderWidth: 0,
    },
    buttonTextWhite: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Inter',
    },
    gmailIcon: {
        width: 16.5,
        height: 12.75,
        marginLeft: 8,
        resizeMode: 'contain',
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 0,
    },
    forgotPasswordTextGray900: {
        color: '#171923',
        fontSize: 14,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontFamily: 'Inter',
    },
    registerSection: {
        alignItems: 'center',
        marginBottom: 16,
    },
    registerButtonFull: {
        backgroundColor: '#1A365D',
        borderRadius: 24,
        height: 48,
        width: '96%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderWidth: 0,
        marginTop: 0,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        marginTop: 0,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#171923',
        opacity: 0.3,
        marginHorizontal: 8,
    },
    dividerText: {
        color: '#171923',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '400',
        fontFamily: 'Inter',
    },
}); 