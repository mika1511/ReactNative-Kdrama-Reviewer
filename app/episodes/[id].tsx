import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../.././src/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { DRAMA_DATA } from '../.././src/data/drama';

export default function EpisodesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const drama = DRAMA_DATA.find(d => d.id === id);
  
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);


  useEffect(() => {
    if (!id) return;

    const baseEpisodes = Array.from({ length: 16 }, (_, i) => ({
      id: `${id}-ep${i + 1}`,
      episode: i + 1,
      title: `Episode ${i + 1}`,
      reviewCount: 0
    }));

    // Fetch review counts for each episode
    baseEpisodes.forEach(episode => {
      const q = query(
        collection(db, "episode_reviews"),
        where("drama_id", "==", id),
        where("episode_num", "==", episode.episode)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const count = snapshot.docs.length;
        setEpisodes(prev => 
          prev.map(ep => 
            ep.id === episode.id 
              ? { ...ep, reviewCount: count }
              : ep
          )
        );
      });
    });

    setEpisodes(baseEpisodes);
  }, [id]);

  const renderEpisodeCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[
        styles.episodeCard, 
        selectedEpisode?.id === item.id && styles.selectedCard
      ]}
      onPress={() => {
        setSelectedEpisode(item);
        router.push(`/episode-reviewer/${id}/${item.id}`);
      }}
    >
      {/* Episode Number */}
      <View style={styles.episodeNumber}>
        <Text style={styles.epNum}>Ep {item.episode}</Text>
      </View>

      {/* Episode Info */}
      <View style={styles.episodeInfo}>
        <Text style={styles.epTitle}>{item.title}</Text>
        {item.reviewCount > 0 && (
          <Text style={styles.reviewCount}>{item.reviewCount} review{item.reviewCount > 1 ? 's' : ''}</Text>
        )}
      </View>

      {/* Arrow */}
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: drama?.color || '#DB7093' }]}>
        <Text style={styles.dramaTitle}>{drama?.title || 'Unknown'}</Text>
        <Text style={styles.totalEpisodes}>16 Episodes</Text>
      </View>

      {/* Episodes List */}
      <FlatList
        data={episodes}
        keyExtractor={item => item.id}
        renderItem={renderEpisodeCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  dramaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  totalEpisodes: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedCard: {
    elevation: 6,
    shadowOpacity: 0.2,
    borderWidth: 2,
    borderColor: '#DB7093',
  },
  episodeNumber: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DB7093',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  epNum: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  episodeInfo: {
    flex: 1,
  },
  epTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#DB7093',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 20,
    color: '#999',
    marginLeft: 12,
  },
});
