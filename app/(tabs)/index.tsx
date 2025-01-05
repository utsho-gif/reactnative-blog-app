import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import api from '../utils/api';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { useBlogContext } from '../BlogContext';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

interface Blog {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function BlogsScreen() {
  const router = useRouter();
  const { refresh, setRefresh } = useBlogContext();
  const screenWidth = Dimensions.get('window').width;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/posts');
        setBlogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', JSON.stringify(error));
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [refresh]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ff5252" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!loading && blogs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="article" size={64} color="#808080" />
        <Text style={styles.emptyText}>No blogs available.</Text>
        <TouchableOpacity
          style={styles.createFirstButton}
          onPress={() => router.push('/create-blog')}
        >
          <Text style={styles.createFirstButtonText}>
            Write Your First Blog
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E8F5E9', dark: '#1B5E20' }}
      headerImage={
        <IconSymbol size={310} color="#4CAF50" name="newspaper.fill" />
      }
      // style={styles.scrollView}
    >
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerText} type="title">
            Latest Blogs
          </ThemedText>
          <Text style={styles.subHeaderText}>{blogs.length} articles</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/create-blog')}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.createButtonText}>New Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {blogs.map((item: Blog) => (
          <TouchableOpacity
            key={item._id}
            style={styles.blogItem}
            onPress={() => router.push(`/blog/${item._id}`)}
          >
            <View style={styles.blogHeader}>
              <MaterialIcons name="article" size={24} color="#4CAF50" />
              <View style={styles.blogMeta}>
                <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                <Text style={styles.readTime}>{getReadTime(item.content)}</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content} numberOfLines={3}>
              {item.content}
            </Text>

            <View style={styles.blogFooter}>
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Read More</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    color: '#ff5252',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  createFirstButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  createFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 28,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
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
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  blogItem: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  blogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  blogMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  readTime: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 28,
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  blogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: 4,
  },
});
