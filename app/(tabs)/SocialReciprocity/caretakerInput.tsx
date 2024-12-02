import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const emotions = [
    { name: 'Happiness', icon: '😊', color: '#FFD700' },
    { name: 'Concentration', icon: '🧐', color: '#4169E1' },
    { name: 'Sadness', icon: '😢', color: '#1E90FF' },
    { name: 'Excitement', icon: '😃', color: '#FF69B4' },
    { name: 'Calmness', icon: '😌', color: '#90EE90' },
    { name: 'Frustration', icon: '😣', color: '#FF6347' },
];

export default function caretakerInputScreen() {
    const router = useRouter();

    const [emotionValues, setEmotionValues] = useState<EmotionValues>(
        emotions.reduce((acc, emotion) => ({ ...acc, [emotion.name]: 50 }), {} as EmotionValues)
    );

    interface Emotion {
        name: string;
        icon: string;
        color: string;
    }

    interface EmotionValues {
        [key: string]: number;
    }

    const handleSliderChange = (emotion: string, value: number) => {
        setEmotionValues((prev: EmotionValues) => ({ ...prev, [emotion]: value }));
    };

    const handleSubmit = () => {
        console.log('Emotion values:', emotionValues);
        router.push('/(tabs)/SocialReciprocity/studentProgress');
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
                    </View>
                ))}

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
    },
    emotionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A4A4A',
        width: 150,
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A4A4A',
        width: 40,
        textAlign: 'right',
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
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
});

