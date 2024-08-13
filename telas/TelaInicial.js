import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar.js';

const games = [
  { id: '1', src: require('../assets/jogos/roleta.png') },
  { id: '2', src: require('../assets/jogos/slot.png') },
  { id: '3', src: require('../assets/jogos/ppt.png') },
  { id: '4', src: require('../assets/jogos/roleta.png') },
  { id: '5', src: require('../assets/jogos/slot.png') },
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
  escolhaSeuJogo:{
    fontFamily: 'monospace',
    color: "#fff",
    fontSize: 30,
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
  carrossel: {
    borderColor: "#FFF500",
    borderWidth: 1,
    width: "100%",
    height: "35%",
    backgroundColor: '#1E062B',
    borderRadius: 30,
    marginBottom: "30%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  carrosselImagemWrapper: {
    marginRight: 10,
    borderRadius: 10,
  },
  carrosselImagem: {
    marginTop: "15%",
    width: 105,
    height: 105,
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
   // borderColor: "blue",
    //borderWidth: 1,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  botao: {
    borderColor: "#FFF500",
    borderWidth: 1,
    backgroundColor: '#3B1B4D',
    borderRadius: 15,
    marginBottom: "5%",
    
    justifyContent: 'center',
    alignItems: 'center',
    height: 84,
    width: 159,
  },
  botao2: {
    borderColor: "#FFF500",
    borderWidth: 1,
    backgroundColor: '#3B1B4D',
    borderRadius: 15,
    marginBottom: "5%",
    marginHorizontal: "5%",
    justifyContent: 'center',
    alignItems: 'center',
    height: 84,
    width: 159,
  },
  botaoTxt:{
    fontFamily: 'monospace',
    color: "#fff",
    fontSize: 35,
  }
});

export default TelaInicial;
