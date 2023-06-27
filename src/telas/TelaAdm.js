import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useContext, useEffect } from 'react';
import AutenticacaoContext from '../contextos/autenticacaoContext';

const TelaAdm = ({navigation}) => {

  // Verificar se o usuário está logado
  const { usuarioLogado, setUsuarioLogado } = useContext(AutenticacaoContext);
  useEffect(() => {
    if (!usuarioLogado || usuarioLogado.nivelAcesso !== 'ADM') {
      navigation.navigate('TelaLogin');
    }
  }, [usuarioLogado, navigation]);

  const deslogar = () => {
    setUsuarioLogado(null);
    navigation.navigate('TelaLogin');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil Administrador</Text>
      <View style={styles.btn}>
        <Button
          title="Buscar raças de cachorros"
          onPress={() => navigation.navigate('TelaAdmBuscarRacasCachorros')}
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Visualizar Cachorros favoritados"
          onPress={() => navigation.navigate('TelaAdmCachorrosFavoritos')}
        />
      </View>
      <View style={styles.btn}>
        <Button title="Logout" onPress={deslogar} />
      </View>
    </View>
  );
};

export default TelaAdm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 50, 
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  btn: {
    marginVertical: 10,
    width: '80%',
  },
});
