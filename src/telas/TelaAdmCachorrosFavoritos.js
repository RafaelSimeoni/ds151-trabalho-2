import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Card } from '@rneui/themed';
import CachorroService from '../services/CachorroService';
import AutenticacaoContext from '../contextos/autenticacaoContext';

const TelaAdmCachorrosFavoritos = ({ navigation }) => {
  const [cachorros, setCachorros] = useState([]);

  //Verificar se o usuário está logado
  const { usuarioLogado } = useContext(AutenticacaoContext);
  useEffect(() => {
    if (!usuarioLogado || usuarioLogado.nivelAcesso !== 'ADM') {
      navigation.navigate('TelaLogin');
    }
  }, [usuarioLogado, navigation]);

  //Busca os cachorros no banco de dados
  useEffect(() => {
    buscarCachorrosFavoritos();
  }, []);
  const buscarCachorrosFavoritos = async () => {
    try {
      const cachorrosFavoritos = await CachorroService.buscarCachorros();
      setCachorros(cachorrosFavoritos);
    } catch (error) {
      console.log('Erro ao buscar cachorros favoritos:', error);
    }
  };

  //Excluir cachorro pelo id
  const excluirCachorro = async (id) => {
    try {
      await CachorroService.excluirCachorro(id);
      buscarCachorrosFavoritos();
    } catch (error) {
      console.log('Erro ao excluir cachorro:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.titulo}>Cachorros favoritos</Text>
        {cachorros.length > 0 ? (
          // Iteração da lista de cachorros
          cachorros.map((cachorro) => (
            <Card key={cachorro.id}>
              {cachorro.urlImagem && <Image source={{ uri: cachorro.urlImagem }} style={styles.imagem} />}
              
              <View style={styles.texto}>
                <Text style={styles.nomeCachorro}>{cachorro.nome ? cachorro.nome : "Esse cachorro ainda não tem um nome :("}</Text>
                <Text>Raça: {cachorro.raca}</Text>
                <Text>Peso (kg): {cachorro.peso}</Text>
                <Text>Altura (cm): {cachorro.altura}</Text>
                <Text>Expectativa de Vida: {cachorro.expectativaVida}</Text>
              </View>
              <TouchableOpacity
                onPress={() => excluirCachorro(cachorro.id)}
                style={styles.btnExcluir}
              >
                <Text style={styles.btnExcluirTexto}>Excluir</Text>
              </TouchableOpacity>
            </Card>
          ))
        ) : (
          <View style={styles.semCachorrosContainer}>
            <Text style={styles.semCachorrosTexto}>Não há cachorros favoritos</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  nomeCachorro: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  btnExcluir: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'stretch',
  },
  btnExcluirTexto: {
    color: 'white',
    textAlign: 'center',
  },
  imagem: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  texto: {
    flex: 1,
    marginLeft: 10,
  },
  semCachorrosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 250,
  },
  semCachorrosTexto: {
    fontSize: 20,
    color: 'gray'
  },
});

export default TelaAdmCachorrosFavoritos;
