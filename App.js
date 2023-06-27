import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import TelaAdm from './src/telas/TelaAdm';
import TelaCliente from './src/telas/TelaCliente';
import TelaLogin from './src/telas/TelaLogin';
import TelaAdmBuscarRacasCachorros from './src/telas/TelaAdmBuscarRacasCachorros';
import TelaAdmCachorrosFavoritos from './src/telas/TelaAdmCachorrosFavoritos';
import UsuarioService from './src/services/UsuarioService';
import CachorroService from './src/services/CachorroService';
import { AuthProvider } from './src/contextos/autenticacaoContext';

const Stack = createStackNavigator();

//Criar e povoar tabelas iniciais
const App = () => {
  useEffect(() => {
    UsuarioService.iniciarBDUsuario()
      .then(() => console.log("Sucesso ao povoar o bd de usuários"))
      .catch((e) => console.log("Erro ao povoar o bd de usuários", e));
    CachorroService.iniciarBDCachorros()
      .then(() => console.log("Sucesso ao criar tabela de cachorros"))
      .catch((e) => console.log("Erro ao criar tabela de cachorros", e));
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen name="TelaLogin" component={TelaLogin} />
          <Stack.Screen name="TelaCliente" component={TelaCliente} />
          <Stack.Screen name="TelaAdm" component={TelaAdm} />
          <Stack.Screen name="TelaAdmBuscarRacasCachorros" component={TelaAdmBuscarRacasCachorros} />
          <Stack.Screen name="TelaAdmCachorrosFavoritos" component={TelaAdmCachorrosFavoritos} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
