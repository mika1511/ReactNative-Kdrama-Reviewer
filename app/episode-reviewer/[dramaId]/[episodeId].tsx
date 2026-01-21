import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../../src/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { DRAMA_DATA } from '../../../src/data/drama';

export default function EpisodeReviewScreen() {
  const { dramaId, episodeId } = useLocalSearchParams();
  const router = useRouter();
  
  const drama = DRAMA_DATA.find(d => d.id === dramaId);
  const epNum = episodeId?.toString().split('-ep')[1];
  
  const [newReview, setNewReview] = useState('');
  const [episodeReviews, setEpisodeReviews] = useState<any[]>([]);

  // Fetch EPISODE-SPECIFIC Reviews in Real-Time
  useEffect(() => {
    if (!dramaId || !epNum) return;

    const q = query(
      collection(db, "episode_reviews"),
      where("drama_id", "==", dramaId),
      where("episode_num", "==", parseInt(epNum)),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEpisodeReviews(reviews);
    });

    return () => unsubscribe();
  }, [dramaId, epNum]);

 
  const handleSubmit = async () => {
    if (newReview.trim().length < 5) {
      Alert.alert("Too Short", "Review must be 5+ characters");
      return;
    }

    try {
      await addDoc(collection(db, "episode_reviews"), {
        drama_id: dramaId,
        drama_title: drama?.title,
        episode_num: parseInt(epNum || '1'),
        episode_id: episodeId,
        content: newReview.trim(),
        createdAt: serverTimestamp(),
      });
      
      setNewReview('');
      Alert.alert("Posted!", "Your episode review is live!");
    } catch (error) {
      console.error("Review error:", error);
      Alert.alert("Error", "Check your connection or Firebase rules");
    }
  };

  const goBack = () => router.back();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: drama?.color || '#DB7093' }]}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.dramaTitle}>{drama?.title || 'Unknown'}</Text>
        <Text style={styles.epTitle}>Episode {epNum}</Text>
      </View>

      {/* Add Review Form */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Episode Thoughts</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Best scenes? Plot twists? Character moments?"
          multiline
          numberOfLines={4}
          value={newReview}
          onChangeText={setNewReview}
        />
        <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
          <Text style={styles.postButtonText}>Post Review</Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <View style={styles.reviewsSection}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsCount}>
            {episodeReviews.length} Review{episodeReviews.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {episodeReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No reviews yet </Text>
            <Text style={styles.emptySubtext}>Be the first to share your thoughts!</Text>
          </View>
        ) : (
          episodeReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewText}>{review.content}</Text>
              <Text style={styles.reviewTime}>
                {review.createdAt?.toDate()?.toLocaleString() || 'Just now'}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
 backButton: {
  position: 'absolute',
  top: 16,           
  left: 20,
  zIndex: 10,       
  backgroundColor: 'rgba(183, 161, 180, 0.26)',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
},
backText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '700',  
  textShadowColor: 'rgba(255, 255, 255, 0.81)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 2,
},
backIcon: {          
  fontSize: 18,
  marginRight: 4,
}
,
  dramaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  epTitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#eee',
  },
  postButton: {
    backgroundColor: '#DB7093',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  postButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewsSection: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  reviewsHeader: {
    marginTop: 16,
    marginBottom: 20,
  },
  reviewsCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DB7093',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  reviewTime: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#bbb',
  },
});
