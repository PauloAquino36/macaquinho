import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar.js';


const TelaContato = () => {
  const navigation = useNavigation();

  const emailMsg = () => {
    const email = 'rh@codejr.com,br';
    const subject = 'Assunto do Email';
    const body = 'Corpo da mensagem';
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoURL).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de e-mail.');
    });
  };

  const telefone = () => {
    const phoneNumber = '32998129960';

    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de telefone.');
    });
  };

  return (
        <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo}></Image>

        <Text style={styles.contato}>Entre em contato consoco atraves de nosso:</Text>
        <View style={styles.detalhes}>
            <View style={styles.botoes2}>
                <TouchableOpacity style={styles.botao2} onPress={() => Linking.openURL('https://www.instagram.com/codejr?igsh=ejNlZXB5aW0ydW9o')}>
                    <Image source={require('../assets/botoes/insta.png')} style={styles.img} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.botao2} onPress={emailMsg}>
                    <Image source={require('../assets/botoes/mail.png')} style={styles.img} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.botao2} onPress={() => Linking.openURL('http://wa.me/5532998129960')}>
                    <Image source={require('../assets/botoes/whats.png')} style={styles.img} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.botao2} onPress={telefone}>
                    <Image source={require('../assets/botoes/fone.png')} style={styles.img} />
                </TouchableOpacity>
            </View>

        </View>
        <Navbar></Navbar>
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
    //
    //borderColor: "green",
    //borderWidth: 1,
  },
  logo: {
    width: "85%",
    height: "10%",
    marginVertical: "10%",
    //
    //borderColor: "red",
    //borderWidth: 1,
  },
  botoes2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  botao2: {
    backgroundColor: '#3B1B4D',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "#FFF500",
    borderWidth: 1,
  },
  img: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    //borderColor: "red",
    //borderWidth: 1, 
  },
});

export default TelaContato;
