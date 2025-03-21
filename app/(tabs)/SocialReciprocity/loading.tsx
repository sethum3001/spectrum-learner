import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Loading = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/images/fun-loading.gif')}
                style={styles.gif}
            />
            <Text style={styles.text}>Wait till a fun story and questions generate...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    gif: {
        width: 200,
        height: 250,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        marginTop: 70,
        color: '#ABC8A2',
        textAlign: 'center',
    },
});

export default Loading;