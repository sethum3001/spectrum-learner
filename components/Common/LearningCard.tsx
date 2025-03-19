import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface LearningCardProps {
    title: string;
    icon: 'users' | 'refresh-cw' | 'message-circle' | 'star'; 
    color: string;
    href: string;
    description: string;
    onPress: () => void;
}

const LearningCard: React.FC<LearningCardProps> = ({ title, icon, color, href, description, onPress }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Link href={href as any} asChild>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: color,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <Feather name={icon} size={30} color="#FFFFFF" />
                    </View>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDescription}>{description}</Text>
                    <View style={styles.arrowContainer}>
                        <Feather name="chevron-right" size={20} color="#FFFFFF" />
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        padding: 15,
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        position: 'relative',
        height: 210,
    },
    iconContainer: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    arrowContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
});

export default LearningCard;