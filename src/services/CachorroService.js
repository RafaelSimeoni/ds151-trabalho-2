import db from "./SQLiteDatabase";


//CRUD de cachorros
const CachorroService = {
	iniciarBDCachorros: () => {
		return new Promise((resolve, reject) => {
		  db.transaction((tx) => {
			tx.executeSql(
			  "CREATE TABLE IF NOT EXISTS cachorros (id INTEGER PRIMARY KEY, raca TEXT, peso TEXT, altura TEXT, expectativaVida TEXT, urlImagem TEXT, nome TEXT);",
			  [],
			  resolve,
			  (_, error) => reject(error)
			);
		  });
		});
	  },
	  
	criarCachorro: (id, raca, peso, altura, expectativaVida, urlImagem, nome) => {
		return new Promise((resolve, reject) => {
			db.transaction((tx) => {
				tx.executeSql(
					"INSERT INTO cachorros (id, raca, peso, altura, expectativaVida, urlImagem, nome) VALUES (?, ?, ?, ?, ?, ?, ?);",
					[id, raca, peso, altura, expectativaVida, urlImagem, nome],
					(_, result) => {
						if (result.rowsAffected > 0) {
							console.log("ResolveCachorro")
							resolve(result.insertId);
						} else {
							console.log("RejectCachorro")
							reject();
						}
					},
					(_, error) => {
						reject(error)
						console.log(error)
					}
					
				);
			});
		});
	},


	buscarCachorros: () => {
		return new Promise((resolve, reject) => {
			db.transaction((tx) => {
				tx.executeSql(
					"SELECT * FROM cachorros;",
					[],
					(_, result) => {
						const cachorros = [];
						for (let i = 0; i < result.rows.length; i++) {
							const cachorro = result.rows.item(i);
							cachorros.push(cachorro);
						}
						resolve(cachorros);
					},
					(_, error) => reject(error)
				);
			});
		});
	},


	excluirCachorro: (id) => {
		return new Promise((resolve, reject) => {
		  db.transaction((tx) => {
			tx.executeSql(
			  "DELETE FROM cachorros WHERE id = ?;",
			  [id],
			  (_, result) => {
				if (result.rowsAffected > 0) {
				  resolve();
				} else {
				  reject("Cachorro não encontrado");
				}
			  },
			  (_, error) => reject(error)
			);
		  });
		});
	  },

	  alterarNomePorId: (nome, id) => {
		return new Promise((resolve, reject) => {
		  db.transaction((tx) => {
			tx.executeSql(
			  "UPDATE cachorros SET nome = ? WHERE id = ?;",
			  [nome, id],
			  (_, result) => {
				if (result.rowsAffected > 0) {
				  resolve();
				} else {
				  reject();
				}
			  },
			  (_, error) => reject(error)
			);
		  });
		});
	  },
};


export default CachorroService;