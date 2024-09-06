import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Load = () => {
  // Cria uma referência para o valor da animação
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Define a animação de rotação contínua
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000, // Duração de 2 segundos para uma rotação completa
        easing: Easing.linear,
        useNativeDriver: true, // Usa o driver nativo para melhor desempenho
      })
    );

    spin.start(); // Inicia a animação

    // Limpa a animação quando o componente for desmontado
    return () => spin.stop();
  }, [spinValue]);

  // Interpola o valor da animação para uma rotação em graus
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
        <View style={styles.circle} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  spinner: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3498db',
  },
});

export default Load;
