import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TelaRegistro = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const formatBirthDate = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length > 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4);
    }
    setBirthDate(formatted);
  };

  const convertToAPIDateFormat = (date) => {
    const parts = date.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  };
  

  const formatPhoneNumber = (text) => {
    // Remove qualquer caractere que não seja número
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
  
    // Se o usuário ainda não digitou o DDD, não força a formatação
    if (cleaned.length > 2) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2);
    }
    // Adiciona o espaço após o 9
    if (cleaned.length > 3) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 3) + ' ' + cleaned.slice(3);
    }
    // Adiciona o hífen para os quatro últimos números
    if (cleaned.length > 7) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 3) + ' ' + cleaned.slice(3, 7) + '-' + cleaned.slice(7, 11);
    }
  
    // Atualiza o estado com o valor formatado
    setPhoneNumber(formatted);
  };
  

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem. Por favor, verifique.');
      return;
    }
  
    // Verifica se o número de telefone tem 11 dígitos
    if (phoneNumber.replace(/[^0-9]/g, '').length !== 11) {
      Alert.alert('Erro', 'Número de telefone inválido. Por favor, verifique.');
      return;
    }
  
    // Converte a data para o formato YYYY-MM-DD
    const formattedBirthDate = convertToAPIDateFormat(birthDate);
  
    // Verifica se a data está no formato correto
    if (!formattedBirthDate || formattedBirthDate.length !== 10) {
      Alert.alert('Erro', 'Data de nascimento inválida. Por favor, verifique.');
      return;
    }
  
    const user = {
      name,
      email,
      phone_number: phoneNumber.replace(/[^0-9]/g, ''), // Envia apenas os números para a API
      birth_date: formattedBirthDate, // Envia a data formatada no formato YYYY-MM-DD
      password,
    };
  
    try {
      const response = await fetch('https://treinamentoapi.codejr.com.br/api/paulo/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Registro bem-sucedido:', data);
        Alert.alert('Parabens!', 'Registro bem-sucedido!');
        navigation.navigate('TelaLogin'); // Redireciona para a tela de login após o registro
      } else {
        console.error('Erro no registro:', data.message);
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <View style={styles.detalhes}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#1E1E1E"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone (DDD) 9 1234-5678"
          value={phoneNumber}
          onChangeText={formatPhoneNumber} // Formatar o número enquanto o usuário digita
          keyboardType="phone-pad"
          placeholderTextColor="#1E1E1E"
        />
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (DD/MM/YYYY)"
          value={birthDate}
          onChangeText={formatBirthDate} // Formatar a data conforme o usuário digita
          keyboardType="numeric"
          placeholderTextColor="#1E1E1E"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#1E1E1E"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#1E1E1E"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#1E1E1E"
        />
        <TouchableOpacity style={styles.registrar} onPress={handleRegister}>
          <Text style={styles.registrarTxt}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6E1385',
  },
  detalhes: {
    width: '90%',
    height: '60%',
    margin: '10%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '1%',
    position: 'absolute',
    top: '20%',
  },
  logo: {
    position: 'absolute',
    top: '5%',
    width: '85%',
    height: '10%',
    marginVertical: '5%',
  },
  input: {
    height: '12%',
    width: '80%',
    color: '#1E1E1E',
    borderColor: '#FFF500',
    backgroundColor: '#D9D9D9',
    borderWidth: 2,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 79,
    fontSize: 18,
  },
  registrar: {
    height: '12%',
    width: '50%',
    color: '#1E1E1E',
    borderColor: '#FFF500',
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 79,
    borderWidth: 2,
  },
  registrarTxt: {
    color: '#1E1E1E',
    fontSize: 20,
  },
});

export default TelaRegistro;
