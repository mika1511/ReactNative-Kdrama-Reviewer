import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DRAMA_DATA } from '../.././src/data/drama';
import { MY_REVIEWS_DATA } from '../.././src/data/my-reviews';

export default function MyReviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const drama = DRAMA_DATA.find((d) => d.id === id);
  const myReview = drama ? MY_REVIEWS_DATA[id as string] : null;

  if (!drama) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Drama not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.heroHeader, { backgroundColor: drama.color }]}>
        <Text style={styles.heroTitle}>{drama.title}</Text>
        <Text style={styles.heroSummary}>{drama.summary}</Text>
      </View>

      
      <View style={styles.blogContainer}>
      
        <View style={styles.postHeader}>
          <Text style={styles.postTitle}>My Thoughts</Text>
        </View>

       
        {myReview ? (
          <Text style={styles.blogContent}>{myReview}</Text>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No review yet</Text>
            <Text style={styles.emptySubtitle}>Your thoughts on {drama.title} will appear here</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  
 
  heroHeader: { 
    padding: 40, 
    paddingTop: 60,
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  heroTitle: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: 'white',
    marginBottom: 12,
    lineHeight: 36 
  },
  heroSummary: { 
    fontSize: 17, 
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    fontWeight: '700'
  },

 
  blogContainer: {
    marginTop: -20,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  

  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  
  blogContent: {
    fontSize: 17,
    lineHeight: 28,
    color: '#000000',
    fontWeight: '400',
    letterSpacing: -0.2,
  },

 
  emptyState: {
    padding: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },

  
  errorText: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: '#666',
    padding: 40,
  },
});
