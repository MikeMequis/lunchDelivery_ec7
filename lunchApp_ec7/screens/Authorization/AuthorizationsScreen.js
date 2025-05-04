import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    Alert, ActivityIndicator, Image
} from 'react-native';
import styles from '../styles';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';

export default function AuthorizationScreen({ navigation }) {
    const [authorizations, setAuthorizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            loadAuthorizations();
        });

        loadAuthorizations();

        return unsubscribeFocus;
    }, [navigation, selectedDate]);

    const loadAuthorizations = async () => {
        try {
            setLoading(true);
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const { data } = await api.get(`/authorizations/date/${formattedDate}`);

            // Carregar as entregas para filtrar autorizações já confirmadas
            const deliveriesResponse = await api.get(`/deliveries/date/${formattedDate}`);
            const currentDeliveries = deliveriesResponse.data;

            // Filtrar autorizações que já foram utilizadas
            const usedAuthIds = currentDeliveries.map(delivery => String(delivery.authId));
            const pendingAuths = data.filter(auth => !usedAuthIds.includes(String(auth._id)));

            setAuthorizations(pendingAuths);
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Falha ao carregar autorizações');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAuthorization = async (id) => {
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja excluir esta autorização?',
            [
                { text: 'Cancelar' },
                {
                    text: 'Excluir',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await api.delete(`/authorizations/${id}`);
                            Alert.alert('Sucesso', 'Autorização excluída com sucesso');
                            loadAuthorizations();
                        } catch (err) {
                            console.error(err);
                            if (err.response && err.response.data && err.response.data.error) {
                                Alert.alert('Erro', err.response.data.error);
                            } else {
                                Alert.alert('Erro', 'Falha ao excluir autorização');
                            }
                        } finally {
                            setLoading(false);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const renderItem = ({ item }) => {
        const student = item.student;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.studentInfo}>
                        {student?.photoUrl ? (
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${student.photoUrl}` }}
                                style={styles.studentImage}
                            />
                        ) : (
                            <View style={[styles.studentImage, styles.noImage]}>
                                <Ionicons name="person" size={20} color="#999" />
                            </View>
                        )}
                        <View>
                            <Text style={styles.studentName}>{student?.nome || 'Aluno não encontrado'}</Text>
                            <Text style={styles.studentRA}>RA: {item.studentRA}</Text>
                        </View>
                    </View>
                    <Text style={styles.lunchCount}>
                        {item.qtdLunches} {item.qtdLunches > 1 ? 'lanches' : 'lanche'}
                    </Text>
                </View>

                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('AuthorizationFormScreen', { authorization: item })}
                    >
                        <Ionicons name="create-outline" size={22} color="#fff" />
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteAuthorization(item._id)}
                    >
                        <Ionicons name="trash-outline" size={22} color="#fff" />
                        <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Autorizações de Lanche</Text>

                <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Ionicons name="calendar-outline" size={22} color="#007bff" />
                    <Text style={styles.dateText}>
                        {format(selectedDate, 'dd/MM/yyyy')}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={(_event, date) => {
                            setShowDatePicker(false);
                            if (date) setSelectedDate(date);
                        }}
                    />
                )}
            </View>

            {loading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#007bff" />
            ) : authorizations.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>Nenhuma autorização encontrada para esta data</Text>
                </View>
            ) : (
                <FlatList
                    data={authorizations}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AuthorizationFormScreen')}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}