import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar.js';

const { width, height } = Dimensions.get('window');

const games = [
  { id: '1', src: require('../assets/jogos/roleta.png') },
  { id: '2', src: require('../assets/jogos/slot.png') },
  { id: '3', src: require('../assets/jogos/ppt.png') },
  { id: '4', src: require('../assets/jogos/cassino.png') },
  { id: '5', src: require('../assets/jogos/foguete.png') },
  { id: '6', src: require('../assets/jogos/ppt.png') },
];

const TelaInicial = () => {
  const navigation = useNavigation();

  const [selectedItemId, setSelectedItemId] = useState(null);
  let lastTap = null;

  const DoubleClick = (itemId) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      setSelectedItemId(itemId);
      switch (itemId) {
        case '1':
            navigation.navigate('Roleta');
          break;
          case '3':
            navigation.navigate('PedraPapelTesoura');
          break;
        default:
          break;
      }
    } else {
      lastTap = now;
    }
  };

  const termos = () => {
    Alert.alert('Termos', 'Voce joga, aposta e perde, e joga denovo! lucro 100% do macaquinho!! \nAo apertar "Ok" voce concorda com os termos!');
  };

  return (
        <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo}></Image>

        <Text style={styles.escolhaSeuJogo}>Escolha seu jogo:</Text>
        <View style={styles.detalhes}>
          <View style={styles.carrossel}>
          <FlatList
            data={games}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => DoubleClick(item.id)}
                style={[
                  styles.carrosselImagemWrapper,
                  selectedItemId === item.id && styles.selectedItem,
                ]}
              >
                <Image source={item.src} style={styles.carrosselImagem} />
              </TouchableOpacity>
  
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          </View>
            <View style={styles.botoes2}>
              <TouchableOpacity style={styles.botao2} onPress={termos}>
                <Text style={styles.botaoTxt}>Termos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botao2} onPress={() => navigation.navigate('TelaContato')}>
                <Text style={styles.botaoTxt}>Contato</Text>
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.navbar}>
          <Navbar></Navbar>
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
    //borderColor: 'green',
    //borderWidth: 2
  },
  escolhaSeuJogo:{
    fontFamily: 'monospace',
    color: "#fff",
    fontSize: width * 0.08,
    //borderColor: 'red',
    //borderWidth: 2,
    marginTop: "20%"
  },
  detalhes: {
    width: width * 0.9,
    //height: height * 0.45,
    margin: width * 0.1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: width * 0.01,
    //borderColor: 'red',
    //borderWidth: 1,
  },
  logo: {
    width: width * 0.85,
    height: height * 0.1,
    marginVertical: height * 0.05,
    position:  'absolute',
    top: "0%",
    //borderColor: 'red',
    //borderWidth: 2
  },
  carrossel: {
    borderColor: "#FFF500",
    borderWidth: 1,
    width: "100%",
    height: height * 0.15,
    backgroundColor: '#1E062B',
    borderRadius: 30,
    marginBottom: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carrosselImagemWrapper: {
    //marginRight: width * 0.025,
    borderRadius: 10,
  },
  carrosselImagem: {
    //marginTop: height * 0.02,
    width: width * 0.27,
    height: height * 0.15,
    borderRadius: 10,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: '#FFF500',
    borderRadius: 30,
  },
  botoes2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: "20%"
    //borderColor: 'red',
    //borderWidth: 2
  },
  botao: {
    borderColor: "#FFF500",
    borderWidth: 1,
    backgroundColor: '#3B1B4D',
    borderRadius: 15,
    //marginBottom: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.1,
    width: width * 0.42,
  },
  botao2: {
    borderColor: "#FFF500",
    borderWidth: 1,
    backgroundColor: '#3B1B4D',
    borderRadius: 15,
    //marginBottom: height * 0.05,
    marginHorizontal: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.1,
    width: width * 0.42,
  },
  botaoTxt:{
    fontFamily: 'monospace',
    color: "#fff",
    fontSize: width * 0.09,
  },
  navbar:{
    position: 'absolute',
    bottom: "1%"
  }
});

export default TelaInicial;
