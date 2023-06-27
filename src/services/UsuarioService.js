import db from "./SQLiteDatabase";

//Referente a tabela de usuários. Adiciona um cliente e um adm inicial
const UsuarioService = {
  iniciarBDUsuario: () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT, senha TEXT, nivelAcesso TEXT);",
          [],
          () => {
            tx.executeSql(
              "INSERT INTO usuarios (login, senha, nivelAcesso) VALUES (?, ?, ?), (?, ?, ?);",
              ["adm", "adm", "ADM", "cliente", "cliente", "CLIENTE"],
              (_, result) => {
                if (result.rowsAffected > 0) {
                  resolve();
                } else {
                  reject();
                }
              },
              (_, error) => reject(error)
            );
          },
          (_, error) => reject(error)
        );
      });
    });
  },


  buscarUsuario: (login, senha) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM usuarios WHERE login = ? AND senha = ?;",
          [login, senha],
          (_, result) => {
            const resultSet = result.rows;
            if (resultSet.length > 0) {
              resolve(resultSet.item(0));
            } else {
              reject();
            }
          },
          (_, error) => reject()
        );
      });
    });
  },
};

export default UsuarioService;