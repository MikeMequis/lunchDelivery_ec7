import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, Alert, Image
} from 'react-native';
import styles from '../styles';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import StudentService from '../../services/StudentService';

export default function StudentFormScreen({ route, navigation }) {
    const student = route.params?.student;
    const isEditing = !!student;

    const [formData, setFormData] = useState({
        studentRA: student?.studentRA || '',
        nome: student?.nome || '',
        photoUrl: student?.photoUrl || null
    });

    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Editar Aluno' : 'Novo Aluno'
        });
    }, []);

    const handleSubmit = async () => {
        if (!formData.studentRA || !formData.nome) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
            return;
        }

        try {
            if (isEditing) {
                await StudentService.updateStudent(student.studentRA, formData);
                Alert.alert('Sucesso', 'Aluno atualizado com sucesso');
            } else {
                await StudentService.createStudent(formData);
                Alert.alert('Sucesso', 'Aluno cadastrado com sucesso');
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving student:', error);
            Alert.alert('Erro', error);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Erro', 'Desculpe, precisamos de permissão para acessar suas fotos!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5,
            base64: true
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                photoUrl: result.assets[0].base64
            }));
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <View style={styles.photoContainer}>
                    {formData.photoUrl ? (
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${formData.photoUrl}` }}
                            style={styles.photo}
                        />
                    ) : (
                        <View style={[styles.photo, styles.noPhoto]}>
                            <Ionicons name="person" size={40} color="#999" />
                        </View>
                    )}
                    <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                        <Ionicons name="camera" size={20} color="#fff" />
                        <Text style={styles.photoButtonText}>
                            {formData.photoUrl ? 'Alterar Foto' : 'Adicionar Foto'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>RA do Aluno</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.studentRA}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, studentRA: text }))}
                        placeholder="Digite o RA"
                        keyboardType="numeric"
                        editable={!isEditing}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome do Aluno</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.nome}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
                        placeholder="Digite o nome"
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>
                        {isEditing ? 'Atualizar' : 'Cadastrar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}