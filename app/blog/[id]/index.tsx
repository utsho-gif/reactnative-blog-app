import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !blog) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.errorText}>
          {error || 'Blog not found'}
        </ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText style={styles.title} type="title">
        {blog.title}
      </ThemedText>
      <ThemedText style={styles.content}>{blog.content}</ThemedText>
      <ThemedText style={styles.date}>
        {new Date(blog.createdAt).toLocaleDateString()}
      </ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    color: '#555555',
    marginBottom: 16,
    textAlign: 'justify',
  },
  date: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'right',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
