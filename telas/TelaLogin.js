import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const TelaLogin = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aqui você pode adicionar a lógica para autenticar o usuário
    console.log('Email:', email);
    console.log('Password:', password);
  };


  return (
        <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo}></Image>
        <Image source={require('../assets/botoes/macacodeFT.png')} style={styles.logo2}></Image>

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
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#1E1E1E"
            />
            <TouchableOpacity style={styles.entrar} onPress={() => navigation.navigate('TelaInicial')}>
                <Text  style={styles.entrarTxt}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registrar} onPress={() => navigation.navigate('TelaRegistro')}>
                <Text  style={styles.registrarTxt}>Sou novo aqui...</Text>
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
  contato:{
    textAlign: 'center',
    fontFamily: 'monospace',
    color: "#fff",
    fontSize: 25,
    textDecorationLine: 'underline',
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
    //
    //borderColor: "green",
    //borderWidth: 1,
  },
  logo: {
    position: "absolute",
    top: "5%",
    width: "85%",
    height: "10%",
    marginVertical: "5%",
    //
    //borderColor: "red",
    //borderWidth: 1,
  },
  logo2: {
    width: "60%",
    height: "29%",
    position: "absolute",
    top: "20%",
    //
    //borderColor: "red",
    //borderWidth: 1,
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
    //position: "relative",
    //top: "5%"
  },
  entrar: {
    height: "15%",
    width: "50%",
    color: "#1E1E1E",
    borderColor: '#FFF500',
    backgroundColor: '#D9D9D9',
    borderWidth: 2,
    //paddingHorizontal: 10,
    borderRadius: 79,
    fontSize: 40,
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: "10%",
    //position: "relative",
    //top: "5%"
  },
  entrarTxt: {
    color: "#1E1E1E",
    fontSize: 40,
    textAlign: "center",
    textAlignVertical: "center",
  },
  registrar: {
    color: "#FFCE07",
    fontSize: 40,
    textAlign: "center",
    textAlignVertical: "center",
    position: "relative",
    right: "20%"
  },
  registrarTxt: {
    color: "#FFCE07",
    fontSize: 26,
    textAlign: "right",
    //position: "relative",
    //top: "5%"
  },
});

export default TelaLogin;
