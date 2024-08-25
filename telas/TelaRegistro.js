import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const TelaRegistro = () => {
  const navigation = useNavigation();

  return (
        <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo}></Image>
            
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
});

export default TelaRegistro;
