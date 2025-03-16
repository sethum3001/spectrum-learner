import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const profile = () => {
  const user = {
    name: 'John Dorian',
    location: 'Sri Lanka',
    avatar: require('../../../assets/images/avatar.png'), 
  };

  const activities = {
    distance: '120.6 km',
    elevation: '6.1m',
    calories: '492',
    time: '5:30',
  };

  const notifications = [
    { id: 1, name: 'Michaeal Drek', message: 'Kudos your activity!', time: 'just now' },
    { id: 2, name: 'Jessyka Swann', message: 'Kudos your activity!', time: 'just now' },
    { id: 3, name: 'Bruno Mars', message: 'Kudos your activity!', time: '2 hours' },
    { id: 4, name: 'Christopher J.', message: 'Kudos your activity!', time: '7 hours' },
    { id: 5, name: 'Jin Yang', message: 'Kudos your activity!', time: '2 days' },
    { id: 6, name: 'Anis Mosal', message: 'Kudos your activity!', time: '3 days' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#FFFFFF']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Pressable onPress={() => console.log('Navigate back')}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Profile</Text>
            <Feather name="settings" size={24} color="#FFFFFF" />
          </View>

          <View style={styles.profileSection}>
            <Image source={user.avatar} style={styles.avatar} />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userLocation}>{user.location}</Text>
          </View>

          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Activities (Last 7 days)</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Feather name="map-pin" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{activities.distance}</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="trending-up" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{activities.elevation}</Text>
                <Text style={styles.statLabel}>Elevation</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="zap" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{activities.calories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="clock" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{activities.time}</Text>
                <Text style={styles.statLabel}>Time</Text>
              </View>
            </View>
          </View>

          <View style={styles.routeSection}>
            <Text style={styles.sectionTitle}>Route</Text>
            <Text style={styles.routeText}>You used in last 7 days</Text>
            <Image
              source={require('../../../assets/images/avatar.png')} 
              style={styles.mapImage}
            />
            <Pressable onPress={() => console.log('View all routes')}>
              <Text style={styles.routeLink}>7 days →</Text>
            </Pressable>
          </View>

          <View style={styles.notificationsSection}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.notificationsTabs}>
              <Text style={styles.tabActive}>Kudos</Text>
              <Text style={styles.tabInactive}>Comments</Text>
            </View>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <Image
                  source={require('../../../assets/images/avatar.png')} 
                  style={styles.notificationAvatar}
                />
                <View style={styles.notificationText}>
                  <Text style={styles.notificationName}>{notification.name}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                </View>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  userLocation: {
    fontSize: 16,
    color: '#666666',
  },
  statsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  routeSection: {
    marginBottom: 20,
  },
  routeText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  mapImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  routeLink: {
    fontSize: 14,
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  notificationsSection: {
    marginBottom: 20,
  },
  notificationsTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tabInactive: {
    fontSize: 16,
    color: '#666666',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
  },
  notificationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666666',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666666',
  },
});

export default profile;