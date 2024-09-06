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
    height: height * 0.1,  // 10% da altura da tela
    alignItems: 'flex-end'
    //
    //borderColor: "white",
    //borderWidth: 1,
  },
  navButtonHome: {
    height: width * 0.27,  // ajuste proporcional para 100px
    width: width * 0.27,    // ajuste proporcional para 100px
    position: "relative",
    bottom: height * 0.05,  // 5% da altura da tela
    marginHorizontal: width * 0.05,  // 5% da largura da tela
    //
    //borderColor: "green",
    //borderWidth: 1,
  },
  navButton: {
    height: width * 0.2,  // ajuste proporcional para 75px
    width: width * 0.2,     // ajuste proporcional para 75px
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
