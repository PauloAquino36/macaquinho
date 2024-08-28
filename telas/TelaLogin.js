import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext'; // Importa o contexto de autenticação

const TelaLogin = () => {
  const navigation = useNavigation();
  const { login } = useAuth(); // Usa a função de login do contexto

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  
    const success = await login({ email, password }); // Chama a função de login com as credenciais
  
    console.log('Resultado do login:', success); // Log do resultado
  
    if (success) {
      console.log('Login bem-sucedido, navegando para TelaInicial');
      navigation.navigate('TelaInicial');
    } else {
      console.log('Login falhou');
      alert('Login falhou. Verifique suas credenciais.');
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Image source={require('../assets/botoes/macacodeFT.png')} style={styles.logo2} />

      <View style={styles.detalhes}>
        <TextInput
          style={styles.input}
          placeholder="Email: "
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#1E1E1E"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha:"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#1E1E1E"
        />
        <TouchableOpacity style={styles.entrar} onPress={handleLogin}>
          <Text style={styles.entrarTxt}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registrar} onPress={() => navigation.navigate('TelaRegistro')}>
          <Text style={styles.registrarTxt}>Sou novo aqui...</Text>
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
    width: "90%",
    height: "50%",
    margin: "10%",
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: "1%",
    position: "absolute",
    top: "50%",
  },
  logo: {
    position: "absolute",
    top: "5%",
    width: "85%",
    height: "10%",
    marginVertical: "5%",
  },
  logo2: {
    width: "60%",
    height: "29%",
    position: "absolute",
    top: "20%",
  },
  input: {
    height: "15%",
    width: "80%",
    color: "#1E1E1E",
    borderColor: '#FFF500',
    backgroundColor: '#D9D9D9',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 79,
    fontSize: 25,
  },
  entrar: {
    height: "15%",
    width: "50%",
    borderWidth: 2,
    borderColor: '#FFF500',
    backgroundColor: '#D9D9D9',
    borderRadius: 79,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: "10%",
  },
  entrarTxt: {
    color: "#1E1E1E",
    fontSize: 40,
  },
  registrar: {
    fontSize: 26,
    marginHorizontal: "20%",
    position: "relative",
    right: "26%",
  },
  registrarTxt: {
    color: "#FFCE07",
    fontSize: 26,
    textAlign: "right",
    textDecorationLine: 'underline',
  },
});

export default TelaLogin;
