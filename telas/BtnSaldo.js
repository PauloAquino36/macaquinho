import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Alert, FlatList, Dimensions } from 'react-native';
import { useAuth } from '../AuthContext';

const { width, height } = Dimensions.get('window');

const BtnSaldo = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState(null); // Para saber se é 'Depositar' ou 'Sacar'
  const [value, setValue] = useState('');
  const { user, updateUser } = useAuth(); // Inclui updateUser para atualizar o estado global
  const [cartoes, setCartoes] = useState([]);

  const formatValue = (text) => {
    // Remove caracteres não numéricos
    const cleanedText = text.replace(/[^0-9]/g, '');
  
    // Se o texto estiver vazio ou contiver apenas um dígito, retorna o valor inicial formatado
    if (cleanedText.length === 0) {
      return '0.00';
    } else if (cleanedText.length === 1) {
      return `0.0${cleanedText}`;
    }
  
    // Adiciona o ponto decimal, movendo o último número digitado para a direita do penúltimo
    let integerPart = cleanedText.slice(0, cleanedText.length - 2);
    const decimalPart = cleanedText.slice(cleanedText.length - 2);
  
    // Remove zeros à esquerda da parte inteira, exceto quando a parte inteira é '0'
    integerPart = integerPart ? parseInt(integerPart, 10).toString() : '0';
  
    // Formata com duas casas decimais
    return `${integerPart}.${decimalPart}`;
  };
  

  const carregarCartoes = () => {
    if (user && user.credit_cards) {
      setCartoes(user.credit_cards); // Carrega os cartões do usuário
    } else {
      Alert.alert('Erro', 'Não foi possível carregar os cartões');
    }
  };

  const handleAction = async () => {
    if (!value) {
      Alert.alert('Erro', 'Por favor, insira um valor.');
      return;
    }

    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erro', 'Insira um valor válido.');
      return;
    }

    let newSaldo = user.user.balance; // Declarado como let para permitir a atualização

    if (action === 'Depositar') {
      newSaldo = newSaldo + amount;
    } else if (action === 'Sacar') {
      if (amount > user.user.balance) {
        Alert.alert('Erro', 'Saldo insuficiente.');
        return;
      }
      newSaldo = newSaldo - amount;
    }

    try {
      const response = await fetch(`https://treinamentoapi.codejr.com.br/api/paulo/user/${user.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...user.user,
          balance: newSaldo.toFixed(2),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'transação com sucesso');

        // Atualize o contexto com os novos dados
        updateUser({
          user: { ...user.user, balance: newSaldo },
        });

        setValue(''); // Limpa o valor
        setModalVisible(false); // Fecha o modal
      } else {
        Alert.alert('Erro', data.message || 'Não foi possível atualizar os dados');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar os dados');
    }
  };

  useEffect(() => {
    carregarCartoes();
  }, [user]); // Adiciona `user` como dependência

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.saldoBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.saldoTxt}>Saldo:</Text>
        <Text style={styles.saldoTxt}>R${user.user.balance.toFixed(2).slice(0, 10)}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <View style={styles.btnsOp}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => { setAction('Depositar'); setValue(''); }}
              >
                <Text style={styles.buttonText}>Depositar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => { setAction('Sacar'); setValue(''); }}
              >
                <Text style={styles.buttonText}>Sacar</Text>
              </TouchableOpacity>
            </View>


            {action && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={`Valor para ${action}`}
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(text) => setValue(formatValue(text))}
                />
                <Text style={styles.title}>Selecione o cartao:</Text>
                <FlatList
                  data={cartoes}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                  renderItem={({ item }) => (
                    <View style={styles.cartoes}>
                      <TouchableOpacity style={styles.modalButtonCartao} onPress={handleAction}>
                        <Text style={styles.cartaoText}>
                          {item.name.slice(0, 12)}
                        </Text>
                        <Text style={styles.cartaoText}>
                          {item.number.slice(0, 4)}
                        </Text>
                        <Text style={styles.cartaoText}>
                          {item.brand}
                        </Text>
                      </TouchableOpacity>

                    </View>
                  )}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.modalButtonFechar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  saldoBtn: {
    backgroundColor: '#FFCE07',
    borderRadius: 25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 78,
    width: 148,
    marginBottom: '35%',
    zIndex: 0,
  },
  saldoTxt: {
    color: '#fff',
    fontSize: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#3B1B4D',
    borderColor: "#FAFF00",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnsOp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginVertical: '2%',
    width: '100%',
    alignItems: 'center',
    marginHorizontal: "2%",
    width: width * 0.3,
  },
  modalButtonCartao: {
    backgroundColor: '#FFF6D5',
    padding: 10,
    borderRadius: 5,
    marginVertical: '2%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  justifyContent: 'space-between',
  
  },
  modalButtonFechar: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: '5%',
    width: '50%',
    alignItems: 'center',
  },
  inputContainer: {
    height: height * 0.3,
    width: width * 0.7,
    marginTop: '5%',
  },
  textInput: {
    height: 40,
    //borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
    backgroundColor: '#FFFCF3',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fff",
    textAlign: 'center',
    marginBottom: "5%",
  },
  cartaoText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  }
});

export default BtnSaldo;
