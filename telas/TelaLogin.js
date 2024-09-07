import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Dimensions, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext'; // Importa o contexto de autenticação

const { width, height } = Dimensions.get('window');

const TelaLogin = () => {
  const navigation = useNavigation();
  const { login } = useAuth(); // Usa a função de login do contexto

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
    height: height * 0.4,
    margin: width * 0.1,  // 10% da largura da tela
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: width * 0.01,
    position: 'absolute',
    top: "50%",
  },
  logo: {
    position: "absolute",
    top: height * 0.0,
    width: width * 0.95,
    height: height * 0.1,
    marginTop: height * 0.05,
  },
  logo2: {
    width: width * 0.6,  
    height: width * 0.6, 
    position: 'absolute',
    top: height * 0.17,
  },
  input: {
    height: height * 0.07,
    width: width * 0.8,
    color: "#1E1E1E",
    borderColor: '#FFF500',
    backgroundColor: '#D9D9D9',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 79,
    fontSize: width * 0.06,
    zIndex: 2,
  },
  entrar: {
    height: height * 0.09,
    width: width * 0.4,
    color: "#1E1E1E",
    borderColor: '#FFF500',
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.2,
    borderWidth: 2,
    zIndex: 2,
  },
  entrarTxt: {
    color: "#1E1E1E",
    fontSize: width * 0.1,
  },
  registrar: {
    fontSize: width * 0.065,  // Ajuste dinâmico da fonte
    marginHorizontal: width * 0.2,
    position: 'absolute',
    top: height * 0.3,
    right: width * 0.25,
  },
  registrarTxt: {
    color: "#FFCE07",
    fontSize: width * 0.065,
    textAlign: "right",
    textDecorationLine: 'underline',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Cor de sobreposição escura
    zIndex: 1, // Garante que o overlay fique acima do conteúdo
  },
});

export default TelaLogin;
