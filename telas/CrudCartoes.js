import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, TextInput, Image } from 'react-native';
import { useAuth } from '../AuthContext.js';
import Navbar from './Navbar.js';

const CrudCartoes = () => {
  const { user } = useAuth(); // Obtém o usuário autenticado
  const [cartoes, setCartoes] = useState([]);
  const [novoCartao, setNovoCartao] = useState({
    name: '',
    number: '',
    is_credit: true,
  });
  const [formVisible, setFormVisible] = useState(false); // Estado para controlar a visibilidade do formulário

  // Função para determinar a bandeira do cartão com base no número
  const determinarBandeira = (numero) => {
    
    switch (true) {

      case numero.startsWith('4'):
        return 'Visa';
      case numero.startsWith('5'):
        return 'MasterCard';
      case numero.startsWith('34') || numero.startsWith('37'):
        return 'American Express';
      case numero.startsWith('6'):
        return 'Discover';
      case numero.startsWith('1') || numero.startsWith('2') || numero.startsWith('3') || numero.startsWith('7') || numero.startsWith('8')  || numero.startsWith('9'):
        return 'CodeCard';
      default:
        return '';
    }
  };
  
  const formatarNumeroCartao = (numero) => {
    // Remove todos os caracteres que não são números
    const numeros = numero.replace(/\D/g, '');
  
    // Adiciona hífens a cada quatro dígitos
    const formato = numeros.replace(/(\d{4})(?=\d)/g, '$1-');
  
    return formato;
  };
  
  // Função para carregar os cartões de crédito do usuário
  const carregarCartoes = () => {
    if (user && user.credit_cards) {
      setCartoes(user.credit_cards); // Carrega os cartões do usuário
    } else {
      Alert.alert('Erro', 'Não foi possível carregar os cartões');
    }
  };

  const adicionarCartao = async () => {
    const numeroLimpo = novoCartao.number.replace(/\D/g, '');
  
    if (!novoCartao.is_credit && numeroLimpo.length !== 12) {
      Alert.alert('Erro', 'O número do cartão deve ter 12 dígitos.');
      return;
    }
  
    // Determina a bandeira do cartão
    const bandeira = determinarBandeira(numeroLimpo);
  
    try {
      const response = await fetch('https://treinamentoapi.codejr.com.br/api/paulo/creditCard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ 
          ...novoCartao, 
          brand: bandeira, 
          user_id: user.user.id 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Sucesso', 'Cartão adicionado com sucesso');
        carregarCartoes(); // Atualiza a lista de cartões após a adição
        setNovoCartao({ name: '', number: '', is_credit: true }); // Reseta os campos
        setFormVisible(false); // Oculta o formulário após a adição
      } else {
        Alert.alert('Erro', data.message || 'Não foi possível adicionar o cartão');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar o cartão');
    }
  };
  
  // Função para deletar um cartão
const deletarCartao = (id) => {
  Alert.alert(
    'Confirmar Exclusão',
    'Tem certeza de que deseja excluir este cartão?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            const response = await fetch(`https://treinamentoapi.codejr.com.br/api/paulo/creditCard/${id}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              Alert.alert('Sucesso', 'Cartão deletado com sucesso');
              carregarCartoes(); // Atualiza a lista de cartões após a exclusão
            } else {
              const data = await response.json();
              Alert.alert('Erro', data.message || 'Não foi possível deletar o cartão');
            }
          } catch (error) {
            Alert.alert('Erro', 'Erro ao deletar o cartão');
          }
        },
      },
    ],
    { cancelable: true }
  );
};


  // Função para editar um cartão (exemplo)
  const editarCartao = (id) => {
    Alert.alert('Editar', `Editar cartão com ID ${id}`);
  };

  // Função para exibir detalhes de um cartão (exemplo)
  const detalhesCartao = (id) => {
    Alert.alert('Detalhes', `Detalhes do cartão com ID ${id}`);
  };

  // Função para alternar entre Crédito e Débito
  const alternarTipoCartao = () => {
    setNovoCartao({ ...novoCartao, is_credit: !novoCartao.is_credit });
  };

  // Carrega os cartões ao montar o componente
  useEffect(() => {
    carregarCartoes();
  }, [user]); // Adiciona `user` como dependência

  return (
    <View style={styles.container}>
      <View style={styles.pagamentos}>
        <Text style={styles.pagamentosTxt}>Formas de pagamento</Text>



        {formVisible && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Nome do Cartão"
              value={novoCartao.name}
              onChangeText={(text) => setNovoCartao({ ...novoCartao, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Número do Cartão"
              value={formatarNumeroCartao(novoCartao.number)}
              onChangeText={(text) => setNovoCartao({ ...novoCartao, number: text })}
              keyboardType="numeric"
            />

            
            {/* Campo para exibir a bandeira do cartão */}
            <View style={styles.bandeiraContainer}>
              <Text style={styles.bandeiraText}>
                Bandeira: {determinarBandeira(novoCartao.number)}
              </Text>
            </View>

            {/* Toggle para Crédito/Débito */}
            <TouchableOpacity style={styles.toggleButton} onPress={alternarTipoCartao}>
              <Text style={styles.toggleText}>
                {novoCartao.is_credit ? 'Crédito' : 'Débito'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={adicionarCartao}>
              <Text style={styles.buttonText}>Adicionar Cartão</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.showFormButton} onPress={() => setFormVisible(!formVisible)}>
          <Image
            source={formVisible
              ? require('../assets/botoes/close.png') // Imagem quando o formulário está visível
              : require('../assets/botoes/plus.png')   // Imagem quando o formulário não está visível
            }
            style={styles.botoesImg2}
          />
        </TouchableOpacity>
        <FlatList
          data={cartoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartaoContainer}>
              <Text style={styles.cartaoText}>
                {item.number.slice(0, 4)} **** **** {item.number.slice(-4)} {item.brand}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => editarCartao(item.id)}>
                  <Image source={require('../assets/botoes/edit.png')} style={styles.botoesImg} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => detalhesCartao(item.id)}>
                  <Image source={require('../assets/botoes/view.png')} style={styles.botoesImg} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => deletarCartao(item.id)}>
                  <Image source={require('../assets/botoes/delete.png')} style={styles.botoesImg} />
                </TouchableOpacity>                
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  pagamentos: {
    width: "90%",
    height: "90%",
    marginVertical: '2%',
    padding: '2%',
    backgroundColor: '#1E062B',
    borderRadius: 25,
    borderColor: '#FAFF00',
    borderWidth: 1,
  },
  pagamentosTxt: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: '5%',
  },
  cartaoContainer: {
    backgroundColor: '#FFF6D5',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartaoText: {
    color: 'black',
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginHorizontal: '1%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  botoesImg: {
    width: 45,
    height: 45,
  },
  input: {
    height: 40,
    borderColor: '#FFF500',
    borderWidth: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  showFormButton: {
 //   alignItems: "flex-end",
    marginBottom: 10,
    position: 'absolute',
    left: "90%",
    bottom: "90%",
  },
  botoesImg2: {
    width: 60,
    height: 60,
  },
  toggleButton: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleText: {
    color: 'black',
    fontSize: 16,
  },
  bandeiraContainer: {
    marginBottom: 10,
  },
  bandeiraText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CrudCartoes;
