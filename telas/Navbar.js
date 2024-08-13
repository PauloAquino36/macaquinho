import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>

     <TouchableOpacity style={styles.navButton}>
        <Image source={require('../assets/botoes/user.png')} style={styles.botoesImg}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButtonHome} onPress={() => navigation.navigate('TelaInicial')}>
        <Image source={require('../assets/botoes/macacode.png')} style={styles.botoesImg}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Image source={require('../assets/botoes/sair.png')} style={styles.botoesImg}></Image>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: "10%",
    //
    borderColor: "white",
    borderWidth: 1,
  },
  navButtonHome: {
    height: 100,
    width: 100,
    position: "relative",
    bottom: "5%",
    marginHorizontal: "5%",
    //
    //borderColor: "green",
    //borderWidth: 1,
  },
  navButton: {
    height: 75,
    width: 75,
    //
    //borderColor: "green",
    //borderWidth: 1,
  },
  botoesImg: {
    height: "100%",
    width: "100%",
    //
    //borderColor: "red",
    //borderWidth: 1,
  },
});

export default Navbar;
