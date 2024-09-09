import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

const { width, height } = Dimensions.get('window');

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
    height: height * 0.1,
    alignItems: 'flex-end',
    marginBottom: "1%"
    //
    //borderColor: "white",
    //borderWidth: 1,
  },
  navButtonHome: {
    height: width * 0.27,
    width: width * 0.27,  
    position: "relative",
    bottom: height * 0.0001,
    marginHorizontal: width * 0.05,
    //
    //borderColor: "green",
    //borderWidth: 1,
  },
  navButton: {
    height: width * 0.2,
    width: width * 0.2,   
    //
    //borderColor: "green",
    //borderWidth: 1,
  },
  botoesImg: {
    height: '100%',
    width: '100%',
    //
    //borderColor: "red",
    //borderWidth: 1,
  },
});


export default Navbar;
