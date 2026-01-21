import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../src/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { DRAMA_DATA } from '../../src/data/drama';

export default function ReviewScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [newReview, setNewReview] = useState('');
    const [reviews, setReviews] = useState<any[]>([]);

    const drama = DRAMA_DATA.find((d) => d.id === id);


    useEffect(() => {
        const q = query(
            collection(db, "reviews"),
            where("drama_id", "==", id),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReviews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(fetchedReviews);
        });

        return () => unsubscribe();
    }, [id]);

    // 2. Submit New Review
    const handleSubmit = async () => {
        if (newReview.trim().length < 5) {
            Alert.alert("Short Review", "Please write at least 5 characters.");
            return;
        }

        try {
            await addDoc(collection(db, "reviews"), {
                drama_id: id,
                content: newReview,
                createdAt: serverTimestamp(),
            });
            setNewReview('');
            Alert.alert("Success", "Your review has been posted!");
        } catch (e) {
            Alert.alert("Error", "Check your Firebase rules or connection.");
        }
    };

    if (!drama) return <View style={styles.container}><Text>Drama not found</Text></View>;

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={[styles.header, { backgroundColor: drama.color }]}>
                <View style={styles.headerContent}>
                    <View style={styles.textContent}>
                        <Text style={styles.dramaTitle}>{drama.title}</Text>
                        <Text style={styles.summary}>{drama.summary}</Text>
                    </View>

                    {/*buttons */}
                    <View style={styles.buttonCol}>
                        <TouchableOpacity
                            style={styles.myReviewButton}
                            onPress={() => {
                                console.log("Navigating to:", `/my-review/${id}`);
                                router.push(`/my-review/${id}`);
                            }}
                        >
                            <Text style={styles.myReviewButtonText}>💭 My Review</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.episodeButton}
                            onPress={() => {
                                console.log("Navigating to:", `/episodes/${id}`);  // Debug
                                router.push(`/episodes/${id}`);
                            }}
                        >
                            <Text style={styles.episodeButtonText}>📺 Episodes</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>



            {/* Input Section */}
            <View style={styles.inputCard}>
                <Text style={styles.label}>Add your review</Text>
                <TextInput
                    style={styles.input}
                    placeholder="What did you think?"
                    multiline
                    value={newReview}
                    onChangeText={setNewReview}
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Post Review</Text>
                </TouchableOpacity>
            </View>

            {/* Global Reviews List */}
            <View style={styles.feedSection}>
                <Text style={styles.feedTitle}>Total Reviews ({reviews.length})</Text>
                {reviews.length === 0 ? (
                    <Text style={styles.emptyText}>No reviews yet. Be the first!</Text>
                ) : (
                    reviews.map((item) => (
                        <View key={item.id} style={styles.reviewCard}>
                            <Text style={styles.reviewContent}>{item.content}</Text>
                            <Text style={styles.reviewDate}>
                                {item.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdf2f5' },
    header: { padding: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    dramaTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    summary: { fontSize: 16, color: '#444', marginTop: 10, lineHeight: 22 },
    inputCard: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 20, elevation: 3 },
    label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, height: 80, textAlignVertical: 'top' },
    button: { backgroundColor: '#DB7093', marginTop: 15, padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    feedSection: { paddingHorizontal: 20, paddingBottom: 40 },
    feedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    reviewCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#DB7093' },
    reviewContent: { fontSize: 15, color: '#444' },
    reviewDate: { fontSize: 12, color: '#999', marginTop: 5 },
    emptyText: { color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', },
    textContent: {flex: 1},
    myReviewButton: {backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16,paddingVertical: 12,borderRadius: 20,borderWidth: 1,borderColor: 'rgba(255,255,255,0.3)',minWidth: 100,alignItems: 'center',},
    myReviewButtonText: {color: 'white',fontSize: 14, fontWeight: '600'},
    buttonCol: { flexDirection: 'column',alignItems: 'center',gap: 10},episodeButton: {backgroundColor: 'rgba(255,255,255,0.2)',paddingHorizontal: 16,paddingVertical: 12,borderRadius: 20,borderWidth: 1,borderColor: 'rgba(255,255,255,0.3)',minWidth: 100,alignItems: 'center',},
    buttonSpacing: {marginLeft: 8},
    episodeButtonText: {color: 'white',fontSize: 15,fontWeight: '600',
    },



});