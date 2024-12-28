import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import api from '../utils/api';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { useBlogContext } from '../BlogContext';

export default function BlogsScreen() {
  const router = useRouter();
  const { refresh, setRefresh } = useBlogContext();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/posts');
        setBlogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [refresh]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', fontSize: 18 }}>{error}</Text>
      </View>
    );
  }

  if (!loading && blogs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', fontSize: 18 }}>
          No blogs available.
        </Text>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol size={310} color="#808080" name="newspaper.fill" />
      }
    >
      <View style={styles.header}>
        <ThemedText style={styles.headerText} type="title">
          Blogs
        </ThemedText>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/create-blog')}
        >
          <Text style={styles.createButtonText}>Create Blog +</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {blogs.map((item: any) => (
          <TouchableOpacity
            key={item._id}
            style={styles.blogItem}
            onPress={() => router.push(`/blog/${item._id}`)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>
              {item.content.substring(0, 100)}...
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  listContainer: {
    padding: 16,
  },
  blogItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
