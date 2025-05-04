import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, Image, TouchableOpacity,
    Alert, ActivityIndicator
} from 'react-native';
import styles from '../styles';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function StudentsScreen({ navigation }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();

        // Add listener for when screen comes into focus
        const unsubscribe = navigation.addListener('focus', () => {
            fetchStudents();
        });

        return unsubscribe;
    }, [navigation]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            Alert.alert('Erro', 'Não foi possível carregar a lista de alunos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (studentRA) => {
        Alert.alert(
            'Confirmação',
            'Deseja realmente excluir este aluno?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/students/${studentRA}`);
                            Alert.alert('Sucesso', 'Aluno excluído com sucesso');
                            fetchStudents();
                        } catch (error) {
                            console.error('Error deleting student:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o aluno');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.studentInfo}>
                    {item.photoUrl ? (
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${item.photoUrl}` }}
                            style={styles.studentImage}
                        />
                    ) : (
                        <View style={[styles.studentImage, styles.noImage]}>
                            <Ionicons name="person" size={20} color="#999" />
                        </View>
                    )}
                    <View>
                        <Text style={styles.studentName}>{item.nome}</Text>
                        <Text style={styles.studentRA}>RA: {item.studentRA}</Text>
                    </View>
                </View>
            </View>
    
            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('StudentFormScreen', { student: item })}
                >
                    <Ionicons name="create-outline" size={22} color="#fff" />
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
    
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.studentRA)}
                >
                    <Ionicons name="trash-outline" size={22} color="#fff" />
                    <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
            ) : (
                <>
                    <FlatList
                        data={students}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.studentRA}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
                                <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
                            </View>
                        }
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('StudentFormScreen')}
                    >
                        <Ionicons name="add" size={30} color="#fff" />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}