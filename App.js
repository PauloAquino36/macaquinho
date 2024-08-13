import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaInicial from './telas/TelaInicial';
import TelaContato from './telas/TelaContato';
import Navbar from './telas/Navbar';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
        <Stack.Screen name="TelaContato" component={TelaContato} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
