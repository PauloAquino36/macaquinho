import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaLogin from './telas/TelaLogin';
import TelaRegistro from './telas/TelaRegistro';
import TelaInicial from './telas/TelaInicial';
import TelaContato from './telas/TelaContato';
import Roleta from './telas/jogos/Roleta';
import PedraPapelTesoura from './telas/jogos/PedraPapelTesoura';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TelaLogin" component={TelaLogin} />
        <Stack.Screen name="TelaRegistro" component={TelaRegistro} />
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
        <Stack.Screen name="TelaContato" component={TelaContato} />

        <Stack.Screen name="Roleta" component={Roleta} />

        <Stack.Screen name="PedraPapelTesoura" component={PedraPapelTesoura} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
