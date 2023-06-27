import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import UsuarioService from "../services/UsuarioService";
import AutenticacaoContext from "../contextos/autenticacaoContext";

const TelaLogin = ({ navigation }) => {
  const { setUsuarioLogado } = useContext(AutenticacaoContext);
  
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function logar() {
    setLogin("");
    setSenha("");
    setErro("");

    //Buscar usuário por login e senha
    UsuarioService.buscarUsuario(login, senha)
      .then((usuario) => {
        if (usuario.nivelAcesso === "CLIENTE") {
          setUsuarioLogado(usuario); //adicionar ao contexto
          navigation.navigate("TelaCliente");
        } else if(usuario.nivelAcesso === "ADM") {
          setUsuarioLogado(usuario); //adicionar ao contexto
          navigation.navigate("TelaAdm");
        }
      })
      .catch((e) => {
        setErro("Login e/ou senha inválido(s)");
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Dog Api</Text>
      {erro !== "" && <Text style={styles.textoErro}>{erro}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Login"
        value={login}
        onChangeText={setLogin}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Logar" onPress={logar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  textoErro: {
    color: "red",
    marginBottom: 10,
  },
});

export default TelaLogin;
