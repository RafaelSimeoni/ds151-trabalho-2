import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button, TextInput } from 'react-native';
import { Card } from '@rneui/themed';
import CachorroService from '../services/CachorroService';
import AutenticacaoContext from '../contextos/autenticacaoContext';

const TelaCliente = ({ navigation }) => {
  const [cachorros, setCachorros] = useState([]);
  const [idParaEditar, setIdParaEditar] = useState(null);
  const [novoNome, setNovoNome] = useState('');

  //Verificar se o usuário está logado
  const { usuarioLogado } = useContext(AutenticacaoContext);
  useEffect(() => {
    if (!usuarioLogado || usuarioLogado.nivelAcesso !== 'CLIENTE') {
      navigation.navigate('TelaLogin');
    }
  }, [usuarioLogado, navigation]);


  //Buscar lista de cachorros
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

  //Alterar o nome do cachorro pelo id
  const alterarNomeCachorro = async (novoNome, id) => {
    try {
      await CachorroService.alterarNomePorId(novoNome, id);
      buscarCachorrosFavoritos();
      setIdParaEditar(null);
      setNovoNome('');
    } catch (error) {
      console.log('Erro ao alterar nome do cachorro:', error);
    }
  };

  //Iniciar edição
  const iniciarEdicao = (id, nome) => {
    setIdParaEditar(id);
    setNovoNome(nome);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titulo}>Cachorros favoritos</Text>
        {cachorros.length > 0 ? (
          //Iterar lista de cachorros
          cachorros.map((cachorro) => (
            <Card key={cachorro.id}>
              {cachorro.urlImagem && <Image source={{ uri: cachorro.urlImagem }} style={styles.imagem} />}

              <View>
                {/* Se o idParaEditar for igual ao id do cachorro atual, ao invés do nome é exibido uma caixa de texto para edição */}
                {idParaEditar === cachorro.id ? (
                  <TextInput
                    placeholder='Digite aqui o novo nome do cachorro!'
                    style={styles.input}
                    value={novoNome ? novoNome.toString() : ''}
                    onChangeText={(text) => setNovoNome(text)}
                  />
                ) : (
                  <Text style={styles.nomeCachorro}>{cachorro.nome ? cachorro.nome : "Esse cachorro ainda não tem um nome :("}</Text>
                )}
                <Text>Raça: {cachorro.raca}</Text>
                <Text>Peso: {cachorro.peso}</Text>
                <Text>Altura: {cachorro.altura}</Text>
                <Text>Expectativa de Vida: {cachorro.expectativaVida}</Text>

                {/*Se o idParaEditar for igual ao id do cachorro atual, o botão servirá para efetivar a edição do nome */}
                {idParaEditar === cachorro.id ? (
                  <Button title="Alterar Nome" onPress={() => alterarNomeCachorro(novoNome, cachorro.id)} />
                ) : (
                  <Button title="Qual o nome desse cachorro?" onPress={() => iniciarEdicao(cachorro.id, cachorro.nome)} />
                )}
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.noFavoritesContainer}>
            <Text style={styles.noFavoritesText}>Não há cachorros favoritos</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  buttonContainer: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  imagem: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  noFavoritesContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noFavoritesText: {
    fontSize: 16,
    color: 'gray',
    fontStyle: 'italic',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});

export default TelaCliente;
