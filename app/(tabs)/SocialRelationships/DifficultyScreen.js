import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D84315',
        textAlign: 'center',
        marginBottom: 20,
    },
    difficultyText: {
        fontSize: 32,
        color: '#0288D1',
        fontWeight: 'bold',
        marginBottom: 30,
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeButton: {
        backgroundColor: '#ABC8A2',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    homeButtonText: {
        color: '#2E2E5D',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

const DifficultyScreen = () => {
    const { accuracy, input } = useLocalSearchParams();
    const [newDifficulty, setNewDifficulty] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDifficulty = async () => {
            try {
                const response = await fetch(
                    'https://social-relationship.up.railway.app/predict_and_update_difficulty',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            child_id: 'child_001',
                            caretaker_input: input,
                            accuracy: parseFloat(accuracy),
                        }),
                    }
                );
                const data = await response.json();
                setNewDifficulty(data.new_difficulty);
            } catch (error) {
                console.error('Error predicting difficulty:', error);
                alert('Failed to predict difficulty. Please try again!');
            } finally {
                setLoading(false);
            }
        };
        fetchDifficulty();
    }, [accuracy, input]);

    const goToHome = () => {
        router.replace('/(tabs)/Home');
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#D84315" />
                    <Text style={{ marginTop: 10, color: '#555' }}>Calculating your new level...</Text>
                </View>
            ) : (
                <>
                    <Text style={styles.title}>Your New Learning Level!</Text>
                    <Text style={styles.difficultyText}>Level {newDifficulty}</Text>
                    <TouchableOpacity style={styles.homeButton} onPress={goToHome}>
                        <Text style={styles.homeButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default DifficultyScreen;