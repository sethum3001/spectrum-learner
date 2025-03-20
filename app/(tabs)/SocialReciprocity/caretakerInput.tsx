import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const emotions = [
    { name: 'Happiness', icon: '😊', color: '#FFD700', description: 'Rate how happy the child seemed during the activity (0 for not happy, 100 for very happy).' },
    { name: 'Time Spent', icon: '⏳', color: '#4169E1', description: 'Estimate how much time the child spent engaged in the activity (0 for very little time, 100 for a lot of time).' },
    { name: 'Sadness', icon: '😢', color: '#1E90FF', description: 'Rate how sad the child seemed during the activity (0 for not sad, 100 for very sad).' },
    { name: 'Engagement', icon: '😃', color: '#FF69B4', description: 'Rate how engaged the child was during the activity (0 for not engaged, 100 for very engaged).' },
];

export default function caretakerInputScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get accuracy from PreTest params
    const accuracy = params.accuracy || 0; // Default to 0 if not provided

    const [emotionValues, setEmotionValues] = useState<EmotionValues>(
        emotions.reduce((acc, emotion) => ({ ...acc, [emotion.name]: 50 }), {} as EmotionValues)
    );

    const [isSubmitting, setIsSubmitting] = useState(false); // Spinner state

    interface EmotionValues {
        [key: string]: number;
    }

    const handleSliderChange = (emotion: string, value: number) => {
        setEmotionValues((prev: EmotionValues) => ({ ...prev, [emotion]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true); // Show spinner and disable button
        try {
            const requestBody = {
                accuracy, // Use accuracy from PreTest
                sadness: emotionValues['Sadness'],
                happiness: emotionValues['Happiness'],
                engagement: emotionValues['Engagement'],
                time_spent: emotionValues['Time Spent'],
                current_level: 1, // Replace with the actual current level if available
            };

            const response = await fetch(
                'http://social-reciprocity-lp-production.up.railway.app/api/adjust_level',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to adjust level');
            }

            const data = await response.json();

            // Navigate to the student progress screen with the new level
            router.push({
                pathname: '/(tabs)/SocialReciprocity/studentProgress',
                params: { newLevel: data.new_level },
            });
        } catch (error) {
            console.error('Error adjusting level:', error);
        } finally {
            setIsSubmitting(false); // Hide spinner and re-enable button
        }
    };

    return (
        <LinearGradient colors={['#F0F8FF', '#E6E6FA']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={require('../../../assets/images/caretaker-hero.png')}
                        style={styles.heroImage}
                    />
                    <Text style={styles.title}>Caretaker's Corner</Text>
                    <Text style={styles.subtitle}>
                        Help us understand how the child felt during the story and questions
                    </Text>
                </View>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>How to use:</Text>
                    <Text style={styles.instructionsText}>
                        1. Reflect on the child's emotions during the activity
                    </Text>
                    <Text style={styles.instructionsText}>
                        2. Move each slider to indicate the intensity of each emotion (0-100)
                    </Text>
                    <Text style={styles.instructionsText}>
                        3. Tap 'Submit' when you're done
                    </Text>
                </View>

                {emotions.map((emotion) => (
                    <View key={emotion.name} style={styles.emotionContainer}>
                        <Text style={styles.emotionText}>
                            {emotion.icon} {emotion.name}
                        </Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={emotionValues[emotion.name]}
                            onValueChange={(value) => handleSliderChange(emotion.name, value)}
                            minimumTrackTintColor={emotion.color}
                            maximumTrackTintColor="#D3D3D3"
                            thumbTintColor={emotion.color}
                        />
                        <Text style={styles.valueText}>{emotionValues[emotion.name]}</Text>
                        <Text style={styles.emotionDescription}>{emotion.description}</Text>
                    </View>
                ))}

                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={isSubmitting} // Disable button while submitting
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Text style={styles.submitButtonText}>Submit</Text>
                            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    heroImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4A4A4A',
        marginTop: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginTop: 5,
    },
    instructionsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A4A4A',
        marginBottom: 10,
    },
    instructionsText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 5,
    },
    emotionContainer: {
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
    },
    emotionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A4A4A',
        marginBottom: 10,
    },
    slider: {
        marginHorizontal: 10,
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A4A4A',
        textAlign: 'right',
        marginTop: 5,
    },
    emotionDescription: {
        fontSize: 14,
        color: '#666666',
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#A5D6A7',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
});