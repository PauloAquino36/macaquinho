import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza de que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('TelaGerenciamento')}>
        <Image source={require('../assets/botoes/user.png')} style={styles.botoesImg} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButtonHome} onPress={() => navigation.navigate('TelaInicial')}>
        <Image source={require('../assets/botoes/macacode.png')} style={styles.botoesImg} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={handleLogout}>
        <Image source={require('../assets/botoes/sair.png')} style={styles.botoesImg} />
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
    //borderColor: "white",
    //borderWidth: 1,
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
