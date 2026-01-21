import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { db } from '../src/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { DRAMA_DATA } from '../src/data/drama';

export default function HomeFeed() {
    const router = useRouter();
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
            const newCounts: Record<string, number> = {};

            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                
                const dId = data.drama_id ? String(data.drama_id).trim() : null;

                if (dId) {
                    newCounts[dId] = (newCounts[dId] || 0) + 1;
                }
            });

            setCounts(newCounts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.centered}><ActivityIndicator color="#DB7093" /></View>
            ) : (
                <FlatList
                    data={DRAMA_DATA}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => {
                    
                        const currentCount = counts[String(item.id).trim()] || 0;

                        return (
                            <TouchableOpacity
                                style={[styles.card, { borderLeftColor: item.color }]}
                                onPress={() => router.push({
                                    pathname: "/details/[id]",
                                    params: { id: item.id }
                                })}
                            >
                                <View style={styles.cardContent}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
                                    <View style={styles.footer}>
                                        <Text style={styles.reviewCount}>
                                            💬 {currentCount} reviews
                                        </Text>
                                        <Text style={styles.more}>View Reviews →</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 12,
        borderLeftWidth: 6,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardContent: { flex: 1 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    summary: { fontSize: 14, color: '#666', marginVertical: 8 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    reviewCount: { fontSize: 12, color: '#DB7093', fontWeight: '600' },
    more: { fontSize: 12, color: '#999' }
});