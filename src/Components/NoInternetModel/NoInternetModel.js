import { View, Text, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const NoInternetModel = ({ show, onRetry, isRetrying }) => (
    <Modal isVisible={show} style={styles.modal} animationInTiming={600}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Connection Error</Text>
            <Text style={styles.modalText}>
                Oops! Looks like your device is not connected to the Internet.
            </Text>
            <TouchableOpacity onPress={onRetry} disabled={isRetrying}>
                <Text>  Try Again</Text>
            </TouchableOpacity>
        </View>
    </Modal>
);

export default NoInternetModel

const styles = StyleSheet.create({
    // ...
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
    },
    modalText: {
        fontSize: 18,
        color: '#555',
        marginTop: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
    },
});