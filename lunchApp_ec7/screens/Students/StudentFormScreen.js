import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Image, Alert, ActivityIndicator,
    ScrollView, Platform
} from 'react-native';
import styles from '../styles';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function StudentFormScreen({ route, navigation }) {
    const [ra, setRa] = useState('');
    const [nome, setNome] = useState('');
    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (route.params && route.params.student) {
            const { student } = route.params;
            setRa(student.studentRA);
            setNome(student.nome);
            setFoto(student.photoUrl);
            setIsEditing(true);
        }

        // Request camera and media library permissions
        (async () => {
            if (Platform.OS !== 'web') {
                const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
                const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
                    Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua câmera e biblioteca de mídia');
                }
            }
        })();
    }, [route.params]);

    const pickImage = async (useCamera = false) => {
        try {
            let result;

            if (useCamera) {
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
                    base64: true,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
                    base64: true,
                });
            }

            if (!result.canceled && result.assets && result.assets[0]) {
                setFoto(result.assets[0].base64);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Erro', 'Falha ao selecionar imagem');
        }
    };

    const handleSubmit = async () => {
        // Validate fields
        if (!ra || ra.trim() === '') {
            Alert.alert('Erro', 'O RA é obrigatório');
            return;
        }

        if (ra.length < 5) {
            Alert.alert('Erro', 'O RA deve ter pelo menos 5 caracteres');
            return;
        }

        if (!nome || nome.trim() === '') {
            Alert.alert('Erro', 'O nome é obrigatório');
            return;
        }

        if (nome.length < 3) {
            Alert.alert('Erro', 'O nome deve ter pelo menos 3 caracteres');
            return;
        }

        if (!foto) {
            Alert.alert('Erro', 'A foto é obrigatória');
            return;
        }

        setLoading(true);

        try {
            const studentData = {
                studentRA: ra,
                nome,
                photoUrl: foto
            };

            if (isEditing) {
                await api.put(`/students/${ra}`, studentData);
                Alert.alert('Sucesso', 'Aluno atualizado com sucesso');
            } else {
                await api.post('/students', studentData);
                Alert.alert('Sucesso', 'Aluno cadastrado com sucesso');
            }

            navigation.goBack();
        } catch (error) {
            console.error('Error saving student:', error);
            if (error.response && error.response.data && error.response.data.error) {
                Alert.alert('Erro', error.response.data.error);
            } else {
                Alert.alert('Erro', 'Erro ao salvar os dados do aluno');
            }
        } finally {
            setLoading(false);
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Selecionar Foto',
            'Escolha uma opção:',
            [
                { text: 'Câmera', onPress: () => pickImage(true) },
                { text: 'Galeria', onPress: () => pickImage(false) },
                { text: 'Cancelar', style: 'cancel' }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>RA:</Text>
                <TextInput
                    style={styles.input}
                    value={ra}
                    onChangeText={setRa}
                    placeholder="Digite o RA do aluno"
                    editable={!isEditing}
                />

                <Text style={styles.label}>Nome:</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Digite o nome do aluno"
                />

                <Text style={styles.label}>Foto:</Text>
                <TouchableOpacity style={styles.photoButton} onPress={showImageOptions}>
                    <View style={styles.photoContainer}>
                        {foto ? (
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${foto}` }}
                                style={styles.photo}
                            />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Ionicons name="camera" size={40} color="#ccc" />
                                <Text style={styles.photoPlaceholderText}>Adicionar Foto</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

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