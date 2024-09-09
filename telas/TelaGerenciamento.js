import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar.js';
import CrudCartoes from './CrudCartoes.js';
import { useAuth } from '../AuthContext';
import BtnSaldo from './BtnSaldo.js';

const { width, height } = Dimensions.get('window');

const TelaGerenciamento = () => {
  const { user } = useAuth(); // Obtenha os dados do usuário do contexto

  // Usando estados locais para os valores editáveis
  const [name, setName] = useState(user.user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.user.phone_number);
  const [email, setEmail] = useState(user.user.email);

  const [editModalVisible, setEditModalVisible] = useState(false);

  // Função para abrir o modal de edição
  const openEditModal = () => {
    setEditModalVisible(true);
  };

  // Função para fechar o modal de edição
  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const { updateUser } = useAuth(); // Importar a função updateUser do AuthContext

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
          //balance: 100.00,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Dados atualizados com sucesso');

        // Atualize o contexto com os novos dados
        updateUser({
          name: name,
          phone_number: phoneNumber,
          email: email,
        });

        closeEditModal(); // Fecha o modal após a atualização
      } else {
        Alert.alert('Erro', data.message || 'Não foi possível atualizar os dados');
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
          {!editModalVisible && (
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
        <TouchableOpacity style={styles.editUser} onPress={openEditModal}>
          <Image source={require('../assets/botoes/edit.png')} style={styles.botoesImg} />
        </TouchableOpacity>
        <BtnSaldo />
      </View>
      <CrudCartoes />
      <Navbar />

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Dados do Usuário</Text>
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
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#6E1385',
    //borderColor: "white",
    //borderWidth: 1,
  },
  conta: {
    width: width * 0.9,
    height: height * 0.3,
    margin: width * 0.01,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: width * 0.01,
    borderRadius: 25,
    //borderColor: "red",
    //borderWidth: 1,
  },
  DetalhesConta: {
    width: '100%',
    padding: width * 0.02,
    backgroundColor: "#1E062B",
    borderRadius: 25,
    borderColor: "#FAFF00",
    borderWidth: 1,
    zIndex: 1,
    marginBottom: height * 0.01, // Espaçamento entre detalhes e botão de edição
  },
  logo: {
    marginTop: height * 0.05,
    width: width * 0.85,
    height: height * 0.1,
    //borderColor: "green",
    //borderWidth: 1,
  },
  editUser: {
    zIndex: 2,
    position: "relative",
    left: width * 0.37,
    bottom: height * 0.1,
    height: width * 0.25,
    width: width * 0.25,
  },
  botoesImg: {
    height: width * 0.2,
    width: width * 0.2,
  },
  infoText: {
    color: '#fff',
    fontSize: width * 0.045,
    marginBottom: 5,
  },
  input: {
    height: height * 0.05,
    width: '100%',
    borderColor: '#FFF500',
    borderWidth: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    marginBottom: height * 0.01,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.01,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  saldoBtn: {
    backgroundColor: '#FFCE07',
    borderRadius: 25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.1,
    width: width * 0.4,
    position: 'absolute',
    bottom: height * 0.15,
    zIndex: 0,
  },
  saldoTxt: {
    color: "#fff",
    fontSize: width * 0.05,
  },
  pagamentos: {
    width: width * 0.8,
    marginVertical: height * 0.1,
    padding: width * 0.02,
    backgroundColor: "#1E062B",
    borderRadius: 25,
    borderColor: "#FAFF00",
    borderWidth: 1,
  },
  pagamentosTxt: {
    color: '#fff',
    fontSize: width * 0.05,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: '#3B1B4D',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: "gold"
  },
});

export default TelaGerenciamento;
