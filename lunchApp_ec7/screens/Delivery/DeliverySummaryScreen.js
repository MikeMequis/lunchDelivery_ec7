import React, { useState, useEffect } from 'react';
import {
    View, Text, ActivityIndicator,
    ScrollView, TouchableOpacity
} from 'react-native';
import styles from '../styles';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import DeliveryService from '../../services/DeliveryService';

export default function DeliverySummaryScreen({ route, navigation }) {
    const [deliveries, setDeliveries] = useState([]);
    const [authorizations, setAuthorizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        route.params?.date ? new Date(route.params.date) : new Date()
    );
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        try {
            setLoading(true);
            const summary = await DeliveryService.getDeliverySummary(selectedDate);
            setDeliveries(summary.deliveries || []);
            setAuthorizations(summary.authorizations || []);
        } catch (error) {
            console.error(error);
            alert(error.toString());
        } finally {
            setLoading(false);
        }
    };

    // Get statistics based on deliveries and authorizations
    const getStats = () => {
        const stats = {
            totalDeliveries: deliveries.length,
            totalAuthorizations: authorizations.length,
            completionRate: authorizations.length > 0
                ? Math.round((deliveries.length / authorizations.length) * 100)
                : 0,
            pendingDeliveries: []
        };

        // Find authorizations that don't have corresponding deliveries
        if (authorizations.length > 0) {
            const deliveredRAs = deliveries.map(d => d.studentRA);

            stats.pendingDeliveries = authorizations
                .filter(auth => !deliveredRAs.includes(auth.studentRA))
                .map(auth => ({
                    ...auth,
                    student: auth.student
                }));
        }

        return stats;
    };

    const stats = getStats();

    const renderStatusIndicator = (value, total) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;

        let color = '#4CAF50'; // Green
        if (percentage < 50) {
            color = '#F44336'; // Red
        } else if (percentage < 80) {
            color = '#FF9800'; // Orange
        }

        return (
            <View style={styles.statusIndicatorContainer}>
                <View style={styles.statusBarBackground}>
                    <View
                        style={[
                            styles.statusBarFill,
                            { width: `${percentage}%`, backgroundColor: color }
                        ]}
                    />
                </View>
                <Text style={[styles.statusPercentage, { color }]}>
                    {percentage}%
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Cabeçalho de data mantido, mas sem título e botão de voltar */}
            <View style={styles.datePickerContainer}>
                <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Ionicons name="calendar-outline" size={22} color="#007bff" />
                    <Text style={styles.dateText}>{format(selectedDate, 'dd/MM/yyyy')}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setSelectedDate(date);
                        }}
                    />
                )}
            </View>

            {loading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#007bff" />
            ) : (
                <ScrollView style={styles.content}>
                    <View style={styles.statsContainer}>
                        <View style={styles.card}>
                            <View style={styles.statHeader}>
                                <Ionicons name="document-text-outline" size={24} color="#007bff" />
                                <Text style={styles.statTitle}>Autorizações</Text>
                            </View>
                            <Text style={styles.statValue}>{stats.totalAuthorizations}</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.statHeader}>
                                <Ionicons name="fast-food-outline" size={24} color="#4CAF50" />
                                <Text style={styles.statTitle}>Entregas</Text>
                            </View>
                            <Text style={styles.statValue}>{stats.totalDeliveries}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.completionTitle}>Taxa de Conclusão</Text>
                        {renderStatusIndicator(stats.totalDeliveries, stats.totalAuthorizations)}
                        <Text style={styles.completionText}>
                            {stats.totalDeliveries} de {stats.totalAuthorizations} lanches entregues
                        </Text>
                    </View>

                    {stats.pendingDeliveries.length > 0 && (
                        <View style={styles.card}>
                            <Text style={styles.completionTitle}>
                                Lanches Pendentes ({stats.pendingDeliveries.length})
                            </Text>

                            {stats.pendingDeliveries.map((pending, index) => (
                                <View key={index} style={styles.pendingItem}>
                                    <View style={styles.pendingItemContent}>
                                        <View style={styles.pendingDot} />
                                        <View>
                                            <Text style={styles.pendingName}>
                                                {pending.student?.nome || 'Aluno não encontrado'}
                                            </Text>
                                            <Text style={styles.pendingRA}>RA: {pending.studentRA}</Text>
                                            <Text style={styles.pendingQuantity}>
                                                Quantidade: {pending.qtdLanches} {pending.qtdLanches > 1 ? 'lanches' : 'lanche'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {stats.pendingDeliveries.length === 0 && stats.totalAuthorizations > 0 && (
                        <View style={styles.card}>
                            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                            <Text style={styles.allCompleteText}>
                                Todos os lanches autorizados foram entregues!
                            </Text>
                        </View>
                    )}

                    {stats.totalAuthorizations === 0 && (
                        <View style={styles.card}>
                            <Ionicons name="information-circle-outline" size={60} color="#999" />
                            <Text style={styles.noDataText}>
                                Não há autorizações registradas para esta data
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}