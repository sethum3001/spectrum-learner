import React, { useRef, useEffect, useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Animated, Easing, Dimensions, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7EFFF',
  },
  gradientBackground: {
    flex: 1,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingIcon: {
    position: 'absolute',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6B6B6B',
    fontStyle: 'italic',
  },
  profileContainer: {
    backgroundColor: '#ABC8A2',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  streakContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFF3D7',
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginLeft: 10,
  },
  streakBadge: {
    backgroundColor: '#ABC8A2',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  learningGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  learningCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
    minHeight: 160,
    justifyContent: 'space-between',
    position: 'relative',
  },
  cardIcon: {
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 12,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 16,
  },
  cardDecorative: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.3,
  },
  quickActionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#E6D7FF',
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 15,
    width: (width - 120) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4A4A',
    textAlign: 'center',
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#ABC8A2',
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 12,
  },
  progressIcon: {
    marginRight: 15,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E6D7FF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginLeft: 10,
  },
  achievementsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFD7E6',
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  achievementBadge: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 15,
    margin: 5,
    width: (width - 100) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  achievementIcon: {
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A4A4A',
    textAlign: 'center',
  },
});

interface FloatingIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  delay?: number;
  size?: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon, color, delay = 0, size = 20 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    setTimeout(startAnimation, delay);
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.floatingIcon,
        {
          transform: [{ translateY }, { rotate }],
          top: Math.random() * height * 0.7 + 50,
          left: Math.random() * width * 0.8 + 20,
        },
      ]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Animated.View>
  );
};

interface PulseAnimationProps {
  children: React.ReactNode;
  delay?: number;
}

const PulseAnimation: React.FC<PulseAnimationProps> = ({ children, delay = 0 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      {children}
    </Animated.View>
  );
};

interface LearningCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string, ...string[]];
  onPress: () => void;
  delay?: number;
}

const LearningCard: React.FC<LearningCardProps> = ({ title, description, icon, colors, onPress, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  return (
    <Animated.View
      style={[
        styles.learningCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient colors={colors} style={styles.cardGradient}>
          <View style={styles.cardDecorative}>
            <Ionicons name="sparkles" size={20} color="rgba(255,255,255,0.5)" />
          </View>

          <PulseAnimation delay={delay + 500}>
            <View style={styles.cardIcon}>
              <Ionicons name={icon} size={24} color="#4A4A4A" />
            </View>
          </PulseAnimation>

          <View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function Home() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning! 🌅";
    if (hour < 17) return "Good Afternoon! ☀️";
    return "Good Evening! 🌙";
  };

  type LearningPath = {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    colors: [string, string, ...string[]];
    description: string;
    href: '/(tabs)/SocialReciprocity' | '/(tabs)/RepetitiveBehavior' | '/(tabs)/VirtualAssistant' | '/(tabs)/SocialRelationships';
  };

  const learningPaths: LearningPath[] = [{
    title: 'Social Reciprocity',
    icon: 'people',
    colors: ['#E6D7FF', '#F0E6FF'],
    description: 'Learn how to make friends and share! 👫',
    href: '/(tabs)/SocialReciprocity',
  },
  {
    title: 'Restricted Behavior',
    icon: 'refresh',
    colors: ['#D7EFFF', '#E6F4FF'],
    description: 'Discover your special talents! ⭐',
    href: '/(tabs)/RepetitiveBehavior',
  },
  {
    title: 'Virtual Assistant',
    icon: 'chatbubble-ellipses',
    colors: ['#FFF3D7', '#FFF8E6'],
    description: 'Get help from your friendly assistant! 🤖',
    href: '/(tabs)/VirtualAssistant',
  },
  {
    title: 'Special Interests',
    icon: 'star',
    colors: ['#FFD7E6', '#FFE6F0'],
    description: 'Explore your favorite things! 🎨',
    href: '/(tabs)/SocialRelationships',
  },
  ];

  type ProgressItem = {
    label: string;
    progress: number;
    color: string;
    icon: keyof typeof Ionicons.glyphMap; // Restricts icon to valid Ionicons names
  };

  type Achievement = {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    color: string;
  };

  const progressData: ProgressItem[] = [
    { label: 'Social Skills', progress: 75, color: '#ABC8A2', icon: 'people' },
    { label: 'Communication', progress: 60, color: '#E6D7FF', icon: 'chatbubble' },
    { label: 'Learning Goals', progress: 85, color: '#FFF3D7', icon: 'school' },
  ];

  const achievements: Achievement[] = [
    { icon: 'trophy', text: 'First Quiz!', color: '#FFF3D7' },
    { icon: 'star', text: '5 Day Streak!', color: '#ABC8A2' },
    { icon: 'heart', text: 'Helper Badge!', color: '#FFD7E6' },
    { icon: 'rocket', text: 'Fast Learner!', color: '#D7EFFF' },
    { icon: 'medal', text: 'Super Star!', color: '#E6D7FF' },
    { icon: 'diamond', text: 'Brilliant!', color: '#FFF3D7' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#D7EFFF', '#E6D7FF', '#FFF3D7']}
        style={styles.gradientBackground}
      >
        <View style={styles.floatingElements}>
          <FloatingIcon icon="heart" color="#FFD7E6" delay={0} />
          <FloatingIcon icon="star" color="#FFF3D7" delay={1000} />
          <FloatingIcon icon="happy" color="#ABC8A2" delay={2000} />
          <FloatingIcon icon="sparkles" color="#E6D7FF" delay={3000} />
          <FloatingIcon icon="rocket" color="#D7EFFF" delay={4000} />
          <FloatingIcon icon="diamond" color="#FFD7E6" delay={5000} />
        </View>

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.subGreeting}>Ready for some fun learning? 🎉</Text>
            </View>

            <PulseAnimation>
              <TouchableOpacity style={styles.profileContainer}>
                <Text style={{ fontSize: 24 }}>😊</Text>
              </TouchableOpacity>
            </PulseAnimation>
          </View>

          <View style={styles.streakContainer}>
            <View style={styles.streakLeft}>
              <Ionicons name="flame" size={24} color="#FF6B35" />
              <Text style={styles.streakText}>Make your Learning Streak</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>🌟 Choose Your Adventure! 🌟</Text>

          <View style={styles.learningGrid}>
            {learningPaths.map((path, index) => (
              <LearningCard
                key={index}
                title={path.title}
                description={path.description}
                icon={path.icon}
                colors={path.colors}
                delay={index * 200}
                onPress={() => router.push(path.href)}
              />
            ))}
          </View>

          <View style={styles.quickActionsSection}>
            <Text style={styles.quickActionsTitle}>⚡ Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionButton}>
                <View style={styles.quickActionIcon}>
                  <Ionicons name="play-circle" size={28} color="#ABC8A2" />
                </View>
                <Text style={styles.quickActionText}>Continue Learning</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionButton}>
                <View style={styles.quickActionIcon}>
                  <Ionicons name="book" size={28} color="#E6D7FF" />
                </View>
                <Text style={styles.quickActionText}>Daily Challenge</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionButton}>
                <View style={styles.quickActionIcon}>
                  <Ionicons name="gift" size={28} color="#FFD7E6" />
                </View>
                <Text style={styles.quickActionText}>Rewards</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>📈 Make Some Amazing Progress!</Text>
            {progressData.map((item, index) => (
              <View key={index} style={styles.progressItem}>
                <View style={styles.progressIcon}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressLabel}>{item.label}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${item.progress}%`,
                          backgroundColor: item.color
                        }
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.progressPercentage}>{item.progress}%</Text>
              </View>
            ))}
          </View>

          <View style={styles.achievementsSection}>
            <Text style={styles.achievementsTitle}>🏆 Will these be your Awesome Achievements?</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => (
                <PulseAnimation key={index} delay={index * 100}>
                  <TouchableOpacity style={styles.achievementBadge}>
                    <View style={styles.achievementIcon}>
                      <Ionicons
                        name={achievement.icon}
                        size={24}
                        color={achievement.color}
                      />
                    </View>
                    <Text style={styles.achievementText}>{achievement.text}</Text>
                  </TouchableOpacity>
                </PulseAnimation>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}