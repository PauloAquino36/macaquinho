import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './AuthContext'; // Assumindo que o contexto de autenticação está em AuthContext.js
import TelaLogin from './telas/TelaLogin';
import TelaRegistro from './telas/TelaRegistro';
import TelaInicial from './telas/TelaInicial';
import TelaContato from './telas/TelaContato';
import TelaGerenciamento from './telas/TelaGerenciamento';
import CrudCartoes from './telas/CrudCartoes';
import Roleta from './telas/jogos/Roleta';
import PedraPapelTesoura from './telas/jogos/PedraPapelTesoura';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="TelaInicial" component={TelaInicial} />
            <Stack.Screen name="CrudCartoes" component={CrudCartoes} />
            <Stack.Screen name="TelaGerenciamento" component={TelaGerenciamento} />
            <Stack.Screen name="TelaContato" component={TelaContato} />
            <Stack.Screen name="Roleta" component={Roleta} />
            <Stack.Screen name="PedraPapelTesoura" component={PedraPapelTesoura} />
          </>
        ) : (
          <>
            <Stack.Screen name="TelaLogin" component={TelaLogin} />
            <Stack.Screen name="TelaRegistro" component={TelaRegistro} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
