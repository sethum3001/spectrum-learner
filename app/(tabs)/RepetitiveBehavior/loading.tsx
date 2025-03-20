import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

const Loading = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/(tabs)/RepetitiveBehavior/StoryPromptSelection');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/animations/dragon.gif')}
                style={styles.gif}
                contentFit="contain"
            />
            <Text style={styles.text}>Adventure awaits...</Text>
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