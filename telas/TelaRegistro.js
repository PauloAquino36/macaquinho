import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const TelaRegistro = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2);
    }
    if (cleaned.length > 3) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 3) + ' ' + cleaned.slice(3);
    }
    if (cleaned.length > 7) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 3) + ' ' + cleaned.slice(3, 7) + '-' + cleaned.slice(7, 11);
    }

    setPhoneNumber(formatted);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    const formattedBirthDate = convertToAPIDateFormat(birthDate);
    if (!formattedBirthDate || formattedBirthDate.length !== 10) {
      alert('Data de nascimento inválida. Por favor, verifique.');
      return;
    }

    const user = {
      name,
      email,
      phone_number: phoneNumber,
      birth_date: formattedBirthDate,
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
        alert('Registro bem-sucedido!');
        navigation.navigate('TelaLogin');
      } else {
        console.error('Erro no registro:', data.message);
        alert('Erro no registro. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Erro ao registrar. Tente novamente.');
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
          onChangeText={formatPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#1E1E1E"
        />
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento"
          value={birthDate}
          onChangeText={formatBirthDate}
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

      {keyboardVisible && (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
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
    width: width * 0.9,
    height: height * 0.6,
    margin: width * 0.1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: width * 0.01,
    position: 'absolute',
    top: "20%",
  },
  logo: {
    position: "absolute",
    top: height * 0.05,
    width: width * 0.85,
    height: height * 0.1,
    marginVertical: height * 0.05,
  },
  input: {
    height: height * 0.07,
    width: width * 0.8,
    color: "#1E1E1E",
    borderColor: '#FFF500',
    backgroundColor: '#D9D9D9',
    borderWidth: 2,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.02,
    borderRadius: width * 0.2,
    fontSize: width * 0.05,
    zIndex: 2,
  },
  registrar: {
    height: height * 0.09,
    width: width * 0.4,
    color: "#1E1E1E",
    borderColor: '#FFF500',
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.2,
    borderWidth: 3,
    zIndex: 2,
  },
  registrarTxt: {
    color: "#1E1E1E",
    fontSize: width * 0.053,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1,
  },
});

export default TelaRegistro;
