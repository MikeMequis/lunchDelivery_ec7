import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList,
    TouchableOpacity, Alert, ActivityIndicator,
    Image, Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';

export default function DeliveriesScreen({ navigation }) {
    const [deliveries, setDeliveries] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [authorizations, setAuthorizations] = useState([]);
    const [selectedAuthId, setSelectedAuthId] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadDeliveries();
            loadStudents();
            loadAuthorizations();
        });

        loadDeliveries();
        loadStudents();
        loadAuthorizations();

        return unsubscribe;
    }, [navigation, selectedDate]);


    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredStudents([]);
        } else {
            const filtered = students.filter(
                student =>
                    student.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    student.studentRA.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    }, [searchQuery, students]);

    const loadDeliveries = async () => {
        try {
            setLoading(true);
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const { data } = await api.get(`/deliveries/date/${formattedDate}`);
            setDeliveries(data);
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Falha ao carregar entregas');
        } finally {
            setLoading(false);
        }
    };

    const loadStudents = async () => {
        try {
            const { data } = await api.get('/students/');
            setStudents(data);
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Falha ao carregar alunos');
        }
    };

    async function loadAuthorizations() {
        try {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const { data } = await api.get(`/authorizations/date/${formattedDate}`);

            // Carregar também as entregas para a data selecionada
            const deliveriesResponse = await api.get(`/deliveries/date/${formattedDate}`);
            const currentDeliveries = deliveriesResponse.data;

            // Filtrar autorizações que já foram utilizadas
            const usedAuthIds = currentDeliveries.map(delivery => String(delivery.authId));
            const availableAuths = data.filter(auth => !usedAuthIds.includes(String(auth._id)));

            setAuthorizations(availableAuths);
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Não foi possível carregar autorizações');
        }
    }

    const handleCreateDelivery = async () => {
        if (!selectedStudent) {
            Alert.alert('Erro', 'Selecione um aluno');
            return;
        }

        if (!selectedAuthId) {
            Alert.alert('Erro', 'Selecione uma autorização');
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                studentRA: selectedStudent.studentRA,
                authId: selectedAuthId,
                deliveryDate: format(selectedDate, 'yyyy-MM-dd')
            };

            await api.post('/deliveries', payload);
            Alert.alert('Sucesso', 'Entrega registrada com sucesso');
            setModalVisible(false);
            setSelectedStudent(null);
            setSelectedAuthId('');
            setSearchQuery('');
            loadDeliveries();
            loadAuthorizations();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                Alert.alert('Erro', err.response.data.error);
            } else {
                Alert.alert('Erro', 'Falha ao registrar entrega');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const renderItem = ({ item }) => {
        const student = item.student;
        
        // Função auxiliar para formatar a data no formato DD/MM/YYYY, independente da entrada
        const formatDeliveryDate = (dateInput) => {
            // 1. Se não tiver data, retorna mensagem padrão
            if (!dateInput) return 'Data indisponível';
            
            try {
                // 2. Se for uma string no formato ISO (YYYY-MM-DD)
                if (typeof dateInput === 'string') {
                    // Pega só a parte da data (antes do T, se existir)
                    const datePart = dateInput.split('T')[0];
                    
                    // Se tiver formato YYYY-MM-DD
                    if (datePart.includes('-')) {
                        const [year, month, day] = datePart.split('-');
                        return `${day}/${month}/${year}`;
                    }
                }
                
                // 3. Tenta converter para objeto Date e formatar
                const date = new Date(dateInput);
                if (!isNaN(date.getTime())) {
                    // Extrai os componentes da data diretamente
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque janeiro é 0
                    const year = date.getFullYear();
                    
                    return `${day}/${month}/${year}`;
                }
                
                // 4. Se nada funcionar, retorna mensagem padrão
                return 'Data indisponível';
            } catch (error) {
                console.error("Erro ao formatar data:", error);
                return 'Data indisponível';
            }
        };
        
        // Chama a função para formatar a data de entrega
        const formattedDate = formatDeliveryDate(item.deliveryDate);
    
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
                            <Text style={styles.deliveryTime}>
                                Entregue em: {formattedDate}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.deliveryStatus}>
                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    </View>
                </View>
            </View>
        );
    };

    const selectStudent = (student) => {
        setSelectedStudent(student);
        setSearchQuery(student.nome);
        setFilteredStudents([]);
    };

    const renderStudentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.studentItem}
            onPress={() => selectStudent(item)}
        >
            <View style={styles.studentItemContent}>
                {item.photoUrl ? (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${item.photoUrl}` }}
                        style={styles.studentItemImage}
                    />
                ) : (
                    <View style={[styles.studentItemImage, styles.noImage]}>
                        <Ionicons name="person" size={16} color="#999" />
                    </View>
                )}
                <View>
                    <Text style={styles.studentItemName}>{item.nome}</Text>
                    <Text style={styles.studentItemRA}>RA: {item.studentRA}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Function to clear modal state when closing
    const closeModal = () => {
        setModalVisible(false);
        setSelectedStudent(null);
        setSelectedAuthId('');
        setSearchQuery('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Entregas de Lanche</Text>

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

                <TouchableOpacity
                    style={styles.summaryButton}
                    onPress={() => navigation.navigate('DeliverySummaryScreen', { date: selectedDate })}
                >
                    <Ionicons name="stats-chart" size={22} color="#007bff" />
                    <Text style={styles.summaryText}>Resumo do dia</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator style={styles.loader} size="large" color="#007bff" />
            ) : deliveries.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="fast-food-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>Nenhuma entrega registrada para esta data</Text>
                </View>
            ) : (
                <FlatList
                    data={deliveries}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    // Ensure we have fresh data when opening the modal
                    loadAuthorizations();
                    setModalVisible(true);
                }}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Registrar Entrega</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Selecione Autorização:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedAuthId}
                                onValueChange={(authId) => {
                                    setSelectedAuthId(authId);
                                    if (authId) {
                                        const auth = authorizations.find(a => a._id === authId);
                                        if (auth && auth.student) {
                                            setSelectedStudent(auth.student);
                                        }
                                    } else {
                                        setSelectedStudent(null);
                                    }
                                }}
                            >
                                {authorizations.length > 0 ? (
                                    authorizations.map(auth => (
                                        <Picker.Item
                                            key={auth._id}
                                            label={`${auth.studentRA} – ${auth.student ? auth.student.nome : 'Aluno não encontrado'}`}
                                            value={auth._id}
                                        />
                                    ))
                                ) : (
                                    <Picker.Item label="Não há autorizações disponíveis" value="" />
                                )}
                            </Picker>
                        </View>

                        {filteredStudents.length > 0 && !selectedStudent && (
                            <FlatList
                                data={filteredStudents}
                                keyExtractor={item => item.studentRA}
                                renderItem={renderStudentItem}
                                style={styles.studentsList}
                            />
                        )}

                        {selectedStudent && (
                            <View style={styles.selectedStudentContainer}>
                                {selectedStudent.photoUrl ? (
                                    <Image
                                        source={{ uri: `data:image/jpeg;base64,${selectedStudent.photoUrl}` }}
                                        style={styles.studentImage}
                                    />
                                ) : (
                                    <View style={[styles.studentImage, styles.noImage]}>
                                        <Ionicons name="person" size={24} color="#999" />
                                    </View>
                                )}
                                <View>
                                    <Text style={styles.studentName}>{selectedStudent.nome}</Text>
                                    <Text style={styles.studentRA}>RA: {selectedStudent.studentRA}</Text>
                                </View>
                            </View>
                        )}

                        <Text style={styles.label}>Data da Entrega:</Text>
                        <View style={styles.modalDateContainer}>
                            <Text style={styles.modalDateText}>{format(selectedDate, 'dd/MM/yyyy')}</Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                (!selectedStudent || !selectedAuthId) && styles.disabledButton
                            ]}
                            onPress={handleCreateDelivery}
                            disabled={submitting || !selectedStudent || !selectedAuthId}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Confirmar Entrega</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}