import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Telas
import LoginScreen from './src/screens/LoginScreen';
import Agendamentos from './src/screens/Agendamentos';
import Precos from './src/screens/Preco';
import AtualizarPreco from './src/screens/AtualizarPreco';
import Historico from './src/screens/Historico';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Agendamentos" component={Agendamentos} />
        <Stack.Screen name="Precos" component={Precos} />
        <Stack.Screen name="AtualizarPreco" component={AtualizarPreco} />
        <Stack.Screen name="Historico" component={Historico} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





