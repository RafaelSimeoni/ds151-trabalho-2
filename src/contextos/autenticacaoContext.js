import React, { createContext, useState } from 'react';

const AutenticacaoContext = createContext();


//Guarda o usuário logado. É possível recuperar essa informação em todas as páginas que utilizem esse contexto 

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  return (
    <AutenticacaoContext.Provider value={{ usuarioLogado, setUsuarioLogado }}>
      {children}
    </AutenticacaoContext.Provider>
  );
};

export default AutenticacaoContext;