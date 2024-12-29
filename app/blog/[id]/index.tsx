import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
  Share,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import api from '@/app/utils/api';

interface BlogDetails {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function BlogDetailsScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [blog, setBlog] = useState<BlogDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setBlog(response.data);
        if (response.data?.title) {
          navigation.setOptions({ title: response.data.title });
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
        setError('Failed to load blog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleShare = async () => {
    if (blog) {
      try {
        await Share.share({
          message: `${blog.title}\n\n${blog.content}\n\nRead more at [Your App Name]`,
          title: blog.title,
        });
      } catch (error) {
        console.error('Error sharing blog:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (error || !blog) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#dc3545" />
        <ThemedText style={styles.errorText}>
          {error || 'Blog not found'}
        </ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          {/* Header Section */}
          <View style={styles.header}>
            <ThemedText style={styles.title} type="title">
              {blog.title}
            </ThemedText>
            <View style={styles.metaInfo}>
              <MaterialIcons name="event" size={16} color="#666" />
              <ThemedText style={styles.date}>
                {formatDate(blog.createdAt)}
              </ThemedText>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.articleContainer}>
            <ThemedText style={styles.content}>{blog.content}</ThemedText>
          </View>

          {/* Actions Section */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <MaterialIcons name="share" size={20} color="#fff" />
              <ThemedText style={styles.shareButtonText}>
                Share Article
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  contentWrapper: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 40,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
    fontStyle: 'italic',
  },
  articleContainer: {
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
    padding: 20,
    marginBottom: 24,
  },
  content: {
    fontSize: 18,
    lineHeight: 32,
    color: '#333333',
    letterSpacing: 0.3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
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
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
