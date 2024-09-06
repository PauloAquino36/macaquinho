import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar.js';
import CrudCartoes from './CrudCartoes.js';
import { useAuth } from '../AuthContext';
import BtnSaldo from './BtnSaldo.js';

const TelaGerenciamento = () => {
  const { user } = useAuth(); // Obtenha os dados do usuário do contexto

  // Usando estados locais para os valores editáveis
  const [name, setName] = useState(user.user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.user.phone_number);
  const [email, setEmail] = useState(user.user.email);

  const [isEditing, setIsEditing] = useState(false);

  ////
  //const x = 100;
  ////

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://treinamentoapi.codejr.com.br/api/paulo/user/${user.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name,
          phone_number: phoneNumber,
          email: email,
          birth_date: user.user.birth_date,
          balance: 100.00,
        }),
      });

      const data = await response.json();

      console.log("saldo novo>>"+user.user.balance);
      //console.log("data>>"+user.user.birth_date);
      //console.log("email>>"+email);
      //console.log("resonse>>"+response.ok);


      if (response.ok) {
        Alert.alert('Sucesso', 'Dados atualizados com sucesso');
        setIsEditing(false);
      } else {
        Alert.alert('Erro aqui', data.message || 'Não foi possível atualizar os dados');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar os dados');
    }
  };

  const formatphone_number = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2);
    }
    if (cleaned.length > 3) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 3) + ' ' + cleaned.slice(3);
    }
    if (cleaned.length > 7) {
      formatted = '(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 3) + ' ' + cleaned.slice(3, 7) + '-' + cleaned.slice(7, 11);
    }
    return formatted;
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Nenhum usuário logado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      
      <View style={styles.conta}>
        <View style={styles.DetalhesConta}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(formatphone_number(text))}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.infoText}>
                Nome: {user.user.name}
              </Text>
              <Text style={styles.infoText}>
                Telefone: {formatphone_number(user.user.phone_number)}
              </Text>
              <Text style={styles.infoText}>
                Email: {user.user.email}
              </Text>
            </>
          )}
        </View>
        {!isEditing && (
          <TouchableOpacity style={styles.editUser} onPress={() => setIsEditing(true)}>
            <Image source={require('../assets/botoes/edit.png')} style={styles.botoesImg} />
          </TouchableOpacity>
        )}
        <BtnSaldo/>
      </View>
      <CrudCartoes />
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#6E1385',
    borderColor: "white",
    borderWidth: 1,
  },
  conta: {
    width: "90%",
    height: "30%",
    margin: "1%",
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: "1%",
    borderRadius: 25,
    borderColor: "red",
    borderWidth: 1,
  },
  DetalhesConta: {
    width: "100%",
    padding: "2%",
    backgroundColor: "#1E062B",
    borderRadius: 25,
    borderColor: "#FAFF00",
    borderWidth: 1,
    zIndex: 1,
    marginBottom: 10, // Espaçamento entre detalhes e botão de edição
  },
  logo: {
    marginTop: "5%",
    width: "85%",
    height: "10%",
    borderColor: "green",
    borderWidth: 1,
  },
  editUser: {
    zIndex: 2,
    position: "relative",
    left: "45%",
    bottom: "20%",
    height: 100,
    width: 100,
  },
  botoesImg: {
    height: 80,
    width: 80,
  },
  infoText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#FFF500',
    borderWidth: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  saldoBtn: {
    backgroundColor: '#FFCE07',
    borderRadius: 25,
    flexDirection: 'column',
    justifyContent:  'center',
    alignItems: 'center',
    height: 78,
    width: 148,
    position: 'absolute',
    bottom: "15%",
    zIndex: 0,
  },
  saldoTxt: {
    color: "#fff",
    fontSize: 20,
  },
  pagamentos: {
    width: "80%",
    marginVertical: "10%",
    padding: "2%",
    backgroundColor: "#1E062B",
    borderRadius: 25,
    borderColor: "#FAFF00",
    borderWidth: 1,
  },
  pagamentosTxt: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default TelaGerenciamento;
