import React, { createContext, useState, useContext, Alert } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async ({ email, password }) => {
    console.log('Iniciando o login...');
    let userId = 1;
    let userFound = false;

    try {
      while (!userFound) {
        const response = await fetch(`https://treinamentoapi.codejr.com.br/api/paulo/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Dados do usuário recebidos:', data);
        
        if (data.user && data.user.email === email /* && data.user.password === password */) {
          setUser(data); // Passa apenas o objeto `data` para o estado `user`
          console.log('Usuário encontrado e logado');
          userFound = true;
          return true;
        }
        
        if (data.user.status === 404) {
          return false;
        }

        userId++;
      }

      if (!userFound) {
        console.error('Usuário não encontrado ou credenciais incorretas');
        return false;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null); // Limpa os dados do usuário ao deslogar
  };

  const updateUser = (updatedUser) => {
    setUser((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        ...updatedUser.user, // Atualiza os dados do usuário
      },
      credit_cards: updatedUser.credit_cards || prevState.credit_cards, // Atualiza os cartões de crédito
    }));
  };
  
  

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
