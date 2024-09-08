import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, TextInput, Image, Dimensions, Modal } from 'react-native';
import { useAuth } from '../AuthContext.js';
import Navbar from './Navbar.js';

const { width, height } = Dimensions.get('window');

const CrudCartoes = () => {
  const { user, updateUser } = useAuth(); // Obtém o usuário autenticado
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
      case numero.startsWith('1') || numero.startsWith('2') || numero.startsWith('3') || numero.startsWith('7') || numero.startsWith('8') || numero.startsWith('9'):
        return 'CodeCard';
      default:
        return '';
    }
  };

  const formatarNumeroCartao = (numero) => {
    // Remove todos os caracteres que não são números
    const numeros = numero.replace(/\D/g, '');
  
    // Limita o número a 16 dígitos
    const numeroLimitado = numeros.slice(0, 12);
  
    // Adiciona hífens a cada quatro dígitos
    const formato = numeroLimitado.replace(/(\d{4})(?=\d)/g, '$1-');
  
    return formato;
  };

  const carregarCartoes = () => {
    if (user && user.credit_cards) {
      setCartoes(user.credit_cards); // Carrega os cartões do usuário
    } else {
      Alert.alert('Erro', 'Não foi possível carregar os cartões');
    }
  };

  const adicionarCartao = async () => {
    const numeroLimpo = novoCartao.number.replace(/\D/g, '');
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
          user_id: user.user.id,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Sucesso', 'Cartão adicionado com sucesso');
  
        // Cria um novo cartão com os dados recebidos e atribui o ID retornado
        const novoCartaoComId = {
          ...novoCartao,
          id: data.id, // Usar o ID retornado pela API
          brand: bandeira,
        };
  
        // Atualiza a lista de cartões sem o cartão deletado e adiciona o novo cartão
        const cartoesAtualizados = [...user.credit_cards, novoCartaoComId];
  
        updateUser({
          user: user.user, // Mantém as informações do usuário
          credit_cards: cartoesAtualizados, // Atualiza a lista de cartões com o novo cartão
        });
  
        carregarCartoes(); // Função para recarregar a lista de cartões
  
        // Limpa o formulário e oculta o modal
        setNovoCartao({ name: '', number: '', is_credit: true });
        setFormVisible(false);
      } else {
        Alert.alert('Erro', data.message || 'Não foi possível adicionar o cartão');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar o cartão');
    }
  };
  
  
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
                
                // Remove o cartão deletado da lista localmente
                const cartoesAtualizados = user.credit_cards.filter(cartao => cartao.id !== id);
                
                updateUser({
                  user: user.user, // Mantém as informações do usuário
                  credit_cards: cartoesAtualizados, // Atualiza a lista de cartões sem o cartão deletado
                });
  
                carregarCartoes(); // Função para recarregar a lista de cartões
              } else {
                const data = await response.json();
                Alert.alert('Erro', data.message || 'Não foi possível deletar o cartão');
              }
            } catch (error) {
              console.error('Erro ao deletar o cartão:', error);
              Alert.alert('Erro', 'Erro ao deletar o cartão');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const [editModalVisible, setEditModalVisible] = useState(false); // Estado para controlar a visibilidade do modal de edição
  const [cartaoEmEdicao, setCartaoEmEdicao] = useState(null); // Cartão sendo editado

  // Função para abrir o modal de edição com os dados do cartão selecionado
  const editarCartao = (cartao) => {
    setCartaoEmEdicao(cartao);
    setEditModalVisible(true);
  };

  const atualizarCartao = async () => {
  
    const numeroLimpo = cartaoEmEdicao.number.replace(/\D/g, '');
    const bandeira = determinarBandeira(numeroLimpo);
    console.log("Atualizando o cartão com ID: ", cartaoEmEdicao.id);
  
    try {
      const response = await fetch(`https://treinamentoapi.codejr.com.br/api/paulo/creditCard/${cartaoEmEdicao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: cartaoEmEdicao.name,
          number: cartaoEmEdicao.number,
          brand: bandeira,
          is_credit: cartaoEmEdicao.is_credit,
          user_id: user.user.id,
        }),
      });
  
      const data = await response.json();
      console.log("Resposta da API:", data);
  
      if (response.ok) {
        Alert.alert('Sucesso', 'Cartão atualizado com sucesso');
  
        const cartoesAtualizados = user.credit_cards.map(cartao =>
          cartao.id === cartaoEmEdicao.id ? { ...cartaoEmEdicao, brand: bandeira } : cartao
        );
        console.log("Cartões atualizados localmente:", cartoesAtualizados);
  
        updateUser({
          user: user.user, // Mantém as informações do usuário
          credit_cards: cartoesAtualizados, // Atualiza a lista de cartões
        });
  
        setEditModalVisible(false); // Fecha o modal de edição
      } else {
        Alert.alert('Erro', data.message || 'Não foi possível atualizar o cartão');
      }
    } catch (error) {
      console.error('Erro ao atualizar o cartão:', error);
      Alert.alert('Erro', 'Erro ao atualizar o cartão');
    }
  };


  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null); // Cartão selecionado para exibir detalhes

  // Função para exibir detalhes de um cartão
  const detalhesCartao = (cartao) => {
    setCartaoSelecionado(cartao); // Define o cartão selecionado
    setModalVisible(true); // Exibe o modal
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
          <Modal
            transparent={true}
            animationType="fade"
            visible={formVisible}
            onRequestClose={() => setFormVisible(false)}
          >
            <View style={styles.modalOverlayAdd}>
              <View style={styles.pagamentosAdd}>
                <TextInput
                  style={styles.inputAdd}
                  placeholder="Nome do Cartão"
                  value={novoCartao.name}
                  onChangeText={(text) => setNovoCartao({ ...novoCartao, name: text })}
                />
                <TextInput
                  style={styles.inputAdd}
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

                <TouchableOpacity style={styles.closeButton} onPress={() => setFormVisible(false)}>
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.cartaoContainer}>
              <Text style={styles.cartaoText}>
                {item.number.slice(0, 4)} **** **** {item.number.slice(-4)} {item.brand}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => editarCartao(item)}>
                  <Image source={require('../assets/botoes/edit.png')} style={styles.botoesImg} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => detalhesCartao(item)}>
                  <Image source={require('../assets/botoes/view.png')} style={styles.botoesImg} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => deletarCartao(item.id)}>
                  <Image source={require('../assets/botoes/delete.png')} style={styles.botoesImg} />
                </TouchableOpacity>
              </View>
            </View>
          )}


        />
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentView}>
              {cartaoSelecionado && (
                <>
                  <Text style={styles.modalTextNome}>{cartaoSelecionado.name}</Text>
                  <Text style={styles.modalTextNumero}>{formatarNumeroCartao(cartaoSelecionado.number)}</Text>
                  <View style={styles.cartaoViewText}>
                    <Text style={styles.modalText2}>Cartao de {cartaoSelecionado.is_credit ? 'Crédito' : 'Débito'}</Text>
                    <Text style={styles.modalText2}>{cartaoSelecionado.brand}</Text>
                  </View>
                  
                  <View style={styles.closeButtonView}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                      <Text style={styles.buttonText}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {cartaoEmEdicao && (
                <>
                  <Text style={styles.modalTitle}>Editar Cartão</Text>
                  <TextInput
                    style={styles.inputEditCartao}
                    placeholder="Nome do Cartão"
                    value={cartaoEmEdicao.name}
                    onChangeText={(text) => setCartaoEmEdicao({ ...cartaoEmEdicao, name: text })}
                  />
                  <TextInput
                    style={styles.inputEditCartao}
                    placeholder="Número do Cartão"
                    value={formatarNumeroCartao(cartaoEmEdicao.number)}
                    onChangeText={(text) => setCartaoEmEdicao({ ...cartaoEmEdicao, number: text })}
                    keyboardType="numeric"
                  />
                  <View style={styles.bandeiraContainer}>
                    <Text style={styles.bandeiraText}>
                      Bandeira: {determinarBandeira(cartaoEmEdicao.number)}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.toggleButtonEdit} onPress={() => setCartaoEmEdicao({ ...cartaoEmEdicao, is_credit: !cartaoEmEdicao.is_credit })}>
                    <Text style={styles.toggleText}>
                      {cartaoEmEdicao.is_credit ? 'Crédito' : 'Débito'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButtonEdit} onPress={atualizarCartao}>
                    <Text style={styles.buttonText}>Atualizar Cartão</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setEditModalVisible(false)}>
                    <Text style={styles.buttonText}>Fechar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  pagamentos: {
    width: width * 0.9,
    height: height * 0.42,
    padding: width * 0.02,
    backgroundColor: '#1E062B',
    borderRadius: 25,
    borderColor: '#FAFF00',
    borderWidth: 1,
  },
  pagamentosTxt: {
    color: '#fff',
    fontSize: width * 0.05,
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  cartaoContainer: {
    backgroundColor: '#FFF6D5',
    borderRadius: 15,
    padding: width * 0.02,
    marginBottom: height * 0.01,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartaoText: {
    color: 'black',
    fontSize: width * 0.04,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginHorizontal: width * 0.01,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  botoesImg: {
    width: width * 0.12,
    height: width * 0.12,
  },
  input: {
    height: height * 0.05,
    borderColor: '#FFF500',
    borderWidth: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
  },
  inputEditCartao: {
    width: width * 0.7,
    height: height * 0.07,
    borderColor: '#FFF500',
    borderWidth: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.02,
    borderRadius: 5,
    marginBottom: height * 0.02,
  },
  addButtonEdit: {
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.02,
    borderRadius: 5,
    width: "55%"
  },
  showFormButton: {
    marginBottom: height * 0.01,
    position: 'absolute',
    left: width * 0.73,
    bottom: height * 0.33,
  },
  botoesImg2: {
    width: width * 0.15,
    height: width * 0.15,
  },
  toggleButton: {
    backgroundColor: '#D9D9D9',
    paddingVertical: height * 0.02,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  toggleButtonEdit: {
    width: "50%",
    backgroundColor: '#D9D9D9',
    paddingVertical: height * 0.02,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  toggleText: {
    color: 'black',
    fontSize: width * 0.04,
  },
  bandeiraContainer: {
    marginBottom: height * 0.01,
  },
  bandeiraText: {
    color: 'gold',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  ///////////
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContentView: {
    width: width * 0.9,
    height: height * 0.25,
    padding: 20,
    backgroundColor: '#3B1B4D',
    borderWidth: 1,
    borderColor: "#FFF500",
    borderRadius: 8,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: '#3B1B4D',
    borderWidth: 1,
    borderColor: "#FFF500",
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: "#fff"
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#fff"
  },
  modalText2: {
    fontSize: 16,
    marginBottom: "5%",
    marginRight: "20%",
    color: "#fff"
  },
  modalTextNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "#fff"
  },
  modalTextNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "#fff"
  },
  cartaoViewText: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  closeButton: {
    marginTop: "1%",
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 4,
  },
  closeButtonView: {
    marginLeft: "75%"
  },
  modalOverlayAdd: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  inputAdd: {
    width: width * 0.7,
    height: height * 0.07,
    borderColor: '#FFF500',
    borderWidth: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
  },
});

export default CrudCartoes;
