import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar.js';


const Roleta = () => {
  const navigation = useNavigation();


  return (
        <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo}></Image>

        <Text style={styles.contato}>Entre em contato consoco atraves de nosso:</Text>
        <View style={styles.detalhes}>
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
});

export default Roleta;
