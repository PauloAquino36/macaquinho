import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native';
import { useAuth } from '../AuthContext';

const BtnSaldo = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.saldoBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.saldoTxt}>Saldo:</Text>
        <Text style={styles.saldoTxt}>R${user.user.balance}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.buttonText}>Depositar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.buttonText}>Sacar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButtonFechar}  onPress={() => setModalVisible(false)} >
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
    //alignItems: 'center',
  },
  saldoBtn: {
    backgroundColor: '#FFCE07',
    borderRadius: 25,
    flexDirection: 'column',
    justifyContent:  'center',
    alignItems: 'center',
    height: 78,
    width: 148,
    marginBottom: "35%",
    //position: 'absolute',
    //bottom: "15%",
    zIndex: 0,
  },
  saldoTxt: {
    color: "#fff",
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#3B1B4D',
    borderColor: "#FAFF00",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginVertical: "2%",
    width: '100%',
    alignItems: 'center',
  },
  modalButtonFechar: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: "5%",
    width: '50%',
    alignItems: 'center',
  },
});

export default BtnSaldo;
