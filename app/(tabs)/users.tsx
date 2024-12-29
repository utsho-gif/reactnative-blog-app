import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import api from '@/app/utils/api';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MaterialIcons } from '@expo/vector-icons';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/posts/proxy/users');
        setUsers(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderUserCard = (user: any) => (
    <TouchableOpacity
      key={user.id}
      style={styles.userCard}
      onPress={() => router.push(`/users/${user.id}`)}
    >
      <View style={styles.userIconContainer}>
        <MaterialIcons name="account-circle" size={50} color="#4CAF50" />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <MaterialIcons
        name="chevron-right"
        size={24}
        color="#999"
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <MaterialIcons name="error" size={48} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#E8F5E9', dark: '#1B5E20' }}
        headerImage={
          <IconSymbol size={310} color="#4CAF50" name="person.3.fill" />
        }
        // style={styles.parallaxView}
      >
        {/* <View style={styles.contentContainer}> */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.headerText} type="title">
              Users
            </ThemedText>
            <Text style={styles.subHeaderText}>
              {users.length} {users.length === 1 ? 'member' : 'members'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/create-blog')}
          >
            <MaterialIcons name="person-add" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Add User</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {users.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No users available</Text>
            </View>
          ) : (
            users.map((user) => renderUserCard(user))
          )}
        </View>
        {/* </View> */}
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  parallaxView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    minHeight: Dimensions.get('window').height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    minHeight: Dimensions.get('window').height,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userIconContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  chevron: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    marginTop: 16,
    textAlign: 'center',
  },
});
