import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Button } from '@rneui/base';
import { Card } from '@rneui/themed';
import CachorroService from '../services/CachorroService';
import AutenticacaoContext from '../contextos/autenticacaoContext';

import axios from 'axios';

const TelaAdmBuscarRacasCachorros = ({ navigation }) => {
  const [raca, setRaca] = useState('');
  const [resultado, setResultado] = useState([]);
  const [buscaFeita, setBuscaFeita] = useState(false);
  const [favoritos, setFavoritos] = useState([]);


  // Verificar se o usuário está logado
  const { usuarioLogado } = useContext(AutenticacaoContext);
  useEffect(() => {
    if (!usuarioLogado || usuarioLogado.nivelAcesso !== 'ADM') {
      navigation.navigate('TelaLogin');
    }
  }, [usuarioLogado, navigation]);

  // Buscar lista na tabela de cachorros (para impedir que o mesmo cachorro seja favoritado novamente)
  useEffect(() => {
    carregarFavoritos();
  }, []);
  const carregarFavoritos = async () => {
    try {
      const cachorrosFavoritos = await CachorroService.buscarCachorros();
      setFavoritos(cachorrosFavoritos);
    } catch (error) {
      console.log('Erro ao carregar favoritos:', error);
    }
  };

  const buscarCachorro = async () => {
    //Buscar informações do cachorro pela raça na The dog Api
    try {
      const response = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${raca}`, {
        headers: {
          'x-api-key': 'live_E5vi5c1Vg3bgh2IiZpWdgjIreewcZwJIQ0pL6QzeYWt1AlzB2IgubEp9PcyxSFaD'
        }
      });

      if (response.data.length > 0) { //Caso haja resultados e o cachorro tiver o campo reference_image_id é buscado a imagem do cachorro correspondente
        const cachorros = response.data;
        const resultadosComImagem = await Promise.all(cachorros.map(async (cachorro) => {
          if (cachorro.reference_image_id) {
            const imageUrl = await buscarImagem(cachorro.reference_image_id);
            return { ...cachorro, imageUrl }; //adiciona a imagem ao cachorro correspondente
          }
          return cachorro;
        }));
        setResultado(resultadosComImagem);
      } else {
        setResultado([]);
      }
      setBuscaFeita(true); //é utilizado para mostrar msg caso não seja encontrado nenhum resultado na api
    } catch (error) {
      console.log('Erro ao buscar cachorro:', error);
    }
  };

  //Buscar informações de imagens dos cachorros na The dog Api
  const buscarImagem = async (imageId) => {
    try {
      const response = await axios.get(`https://api.thedogapi.com/v1/images/${imageId}`, {
        headers: {
          'x-api-key': 'live_E5vi5c1Vg3bgh2IiZpWdgjIreewcZwJIQ0pL6QzeYWt1AlzB2IgubEp9PcyxSFaD'
        }
      });
      if (response.data.url) {
        return response.data.url;
      }
      return null;
    } catch (error) {
      console.log('Erro ao buscar imagem:', error);
      return null;
    }
  };

  //Inserir cachorro à tabela cachorros
  const adicionarAosFavoritos = async (cachorro) => {
    try {
      await CachorroService.criarCachorro(cachorro.id, cachorro.name, cachorro.weight.metric, cachorro.height.metric, cachorro.life_span, cachorro.imageUrl, null);
      setFavoritos([...favoritos, cachorro]); //adiciona a lista de favoritos local, para mostrar a msg de que o cachorro já foi favoritado
    } catch (error) {
      console.log('Erro ao adicionar cachorro aos favoritos:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Insira a raça do cachorro em inglês. Ex: Bulldog"
        value={raca}
        onChangeText={setRaca}
      />
      <Button title="Buscar" onPress={buscarCachorro} />


      {buscaFeita && resultado.length > 0 ? (
        <ScrollView>
          {/* Iteração pra cada item da lista de cachorros */}
          {resultado.map((item) => (
            <Card key={item.id} style={styles.card}>
              {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.imagem} />}
              <Text style={styles.texto}>Raça: {item.name}</Text>
              <Text style={styles.texto}>Peso: {item.weight.metric}</Text>
              <Text style={styles.texto}>Altura: {item.height.metric}</Text>
              <Text style={styles.texto}>Expectativa de vida: {item.life_span}</Text>
              
              {!favoritos.find((fav) => fav.id === item.id) ? ( //Verifica se o cachorro atual já está na lista de favoritos
                <Button
                  onPress={() => adicionarAosFavoritos(item)}
                  title="Adicionar cachorro aos favoritos"
                />
              ) : (
                <Text style={styles.textoAddFavorito}>Adicionado aos favoritos!</Text>
              )}
            </Card>
          ))}
        </ScrollView>
      ) : buscaFeita && resultado.length === 0 ? (
        <Text>Nenhum resultado encontrado</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 120
  },
  card: {
    marginVertical: 10,
    padding: 10,
  },
  imagem: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    marginBottom: 5,
  },
  textoAddFavorito: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    shadowColor: '#000',
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    fontSize: 16,
    height: 50,
  },
});

export default TelaAdmBuscarRacasCachorros;
