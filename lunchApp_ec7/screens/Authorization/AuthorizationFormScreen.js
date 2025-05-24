import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, Alert,
    ActivityIndicator, ScrollView, Image
} from 'react-native';
import styles from '../styles';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import AuthorizationService from '../../services/AuthorizationService';
import StudentService from '../../services/StudentService';

export default function AuthorizationFormScreen({ route, navigation }) {
    const [students, setStudents] = useState([]);
    const [studentRA, setStudentRA] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [dataLiberation, setDataLiberation] = useState(new Date());
    const [qtdLunches, setQtdLunches] = useState('1');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const isEditing = route.params?.authorization;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await StudentService.getAllStudents();
                setStudents(data);

                if (isEditing) {
                    const auth = route.params.authorization;
                    setStudentRA(auth.studentRA);
                    setDataLiberation(new Date(auth.dataLiberation));
                    setQtdLunches(auth.qtdLunches.toString());

                    const selected = data.find(s => s.studentRA === auth.studentRA);
                    setSelectedStudent(selected || null);
                }
            } catch (error) {
                console.error('Error loading students:', error);
                Alert.alert('Erro', error);
            } finally {
                setFetching(false);
            }
        };

        loadInitialData();
    }, []);

    const handleStudentChange = (studentRA) => {
        setStudentRA(studentRA);
        const student = students.find(s => s.studentRA === studentRA);
        setSelectedStudent(student || null);
    };

    const handleSubmit = async () => {
        if (!studentRA) return Alert.alert('Erro', 'Selecione um aluno');
        if (!dataLiberation) return Alert.alert('Erro', 'Informe a data de liberação');

        const qtd = parseInt(qtdLunches);
        if (isNaN(qtd) || qtd < 1 || qtd > 3)
            return Alert.alert('Erro', 'A quantidade de lanches deve estar entre 1 e 3');

        const payload = {
            studentRA,
            dataLiberation,
            qtdLunches: parseInt(qtdLunches, 10)
        };
        
        try {
            setLoading(true);
            if (isEditing) {
                await AuthorizationService.updateAuthorization(route.params.authorization._id, payload);
                Alert.alert('Sucesso', 'Autorização atualizada com sucesso');
            } else {
                await AuthorizationService.createAuthorization(payload);
                Alert.alert('Sucesso', 'Autorização cadastrada com sucesso');
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving authorization:', error);
            Alert.alert('Erro', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Aluno:</Text>
                {fetching ? (
                    <ActivityIndicator size="small" color="#007bff" />
                ) : (
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={studentRA}
                            onValueChange={handleStudentChange}
                            enabled={!isEditing}
                        >
                            <Picker.Item label="Selecione um aluno" value="" />
                            {students.map(s => (
                                <Picker.Item key={s.studentRA} label={`${s.studentRA} - ${s.nome}`} value={s.studentRA} />
                            ))}
                        </Picker>
                    </View>
                )}

                {selectedStudent && (
                    <View style={styles.studentPreview}>
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${selectedStudent.photoUrl}` }}
                            style={styles.studentImage}
                        />
                        <Text style={styles.studentName}>{selectedStudent.nome}</Text>
                    </View>
                )}

                <Text style={styles.label}>Data de Liberação:</Text>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {format(dataLiberation, 'dd/MM/yyyy')}
                    </Text>
                    <Ionicons name="calendar" size={24} color="#007bff" />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dataLiberation}
                        mode="date"
                        display="default"
                        onChange={(e, date) => {
                            setShowDatePicker(false);
                            if (date) setDataLiberation(date);
                        }}
                    />
                )}

                <Text style={styles.label}>Quantidade de Lanches:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={qtdLunches}
                        onValueChange={setQtdLunches}
                    >
                        <Picker.Item label="1 lanche" value="1" />
                        <Picker.Item label="2 lanches" value="2" />
                        <Picker.Item label="3 lanches" value="3" />
                    </Picker>
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {isEditing ? 'Atualizar' : 'Cadastrar'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}