import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';

const PedraPapelTesoura = () => {
    const navigation = useNavigation();
    const [userChoice, setUserChoice] = useState('');
    const [computerChoice, setComputerChoice] = useState('');
    const [result, setResult] = useState('');
    const [userScore, setUserScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [round, setRound] = useState(1);
    const [roundComplete, setRoundComplete] = useState(false);
    const [betAmount, setBetAmount] = useState(''); // Estado da aposta
    const [isModalVisible, setIsModalVisible] = useState(true); // Controla o modal de aposta
    const { user, updateUser } = useAuth();

    const choices = [
        { name: 'Pedra', image: require('../../assets/jogos/btnPedra.png') },
        { name: 'Papel', image: require('../../assets/jogos/btnPapel.png') },
        { name: 'Tesoura', image: require('../../assets/jogos/btnTesoura.png') },
    ];

    // Iniciar a partida após a aposta
    const startGame = () => {
        const valorAposta = parseFloat(betAmount);
        if (isNaN(valorAposta) || valorAposta <= 0) {
            Alert.alert('Erro', 'Digite um valor de aposta válido');
            return;
        }
        console.log("aposta " + valorAposta);
        console.log("user " + user.user.balance);
        if (valorAposta > user.user.balance) {
            Alert.alert('Erro', 'Saldo insuficiente!');
            return;
        }
        setIsModalVisible(false); // Fechar o modal ao iniciar o jogo
    };

    const playGame = (userChoice) => {
        setUserChoice(userChoice);

        const randomIndex = Math.floor(Math.random() * choices.length);
        const compChoice = choices[randomIndex].name;
        setComputerChoice(compChoice);

        determineWinner(userChoice, compChoice);
    };

    const determineWinner = (user, computer) => {
        let winner;
        if (user === computer) {
            winner = 'Empate!';
        } else if (
            (user === 'Pedra' && computer === 'Tesoura') ||
            (user === 'Tesoura' && computer === 'Papel') ||
            (user === 'Papel' && computer === 'Pedra')
        ) {
            winner = 'Você ganhou!';
            setUserScore(userScore + 1);
        } else {
            winner = 'Você perdeu!';
            setComputerScore(computerScore + 1);
        }
        setResult(winner);
        setRoundComplete(true);

        if (userScore == 2 || computerScore == 2) {
            endGame(userScore + 1 === 2);
        }
    };

    const endGame = (userWon) => {
        if (userWon) {
            setResult('Parabéns! Você venceu a partida!');
            AtualizaSaldo(betAmount);  // Adiciona o valor da aposta ao saldo do jogador
        } else {
            setResult('Que pena! Você perdeu a partida.');
            AtualizaSaldo(-betAmount); // Subtrai o valor da aposta do saldo do jogador
        }
        setRoundComplete(false); // Não permitir avançar para nova rodada
        navigation.navigate('TelaInicial');
    };


    const nextRound = () => {
        setUserChoice('');
        setComputerChoice('');
        setResult('');
        setRound(round + 1);
        setRoundComplete(false);
    };

    const AtualizaSaldo = async (valor) => {
        let saldo = user.user.balance;
        let valorNumerico = parseFloat(valor); // Converte para número

        try {
            const response = await fetch(`https://treinamentoapi.codejr.com.br/api/paulo/user/${user.user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    ...user.user,
                    balance: saldo + valorNumerico,
                }),
            });

            //const data = await response.json();

            if (response.ok) {
                Alert.alert('Sucesso', 'Saldo atualizado com sucesso');
                updateUser({
                    user: { ...user.user, balance: saldo + valorNumerico },
                });
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao atualizar os dados');
        }
    };


    return (
        <View style={styles.container}>
            <Modal visible={isModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Faça sua aposta!</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o valor da aposta"
                            keyboardType="numeric"
                            value={betAmount}
                            onChangeText={(text) => setBetAmount(text)}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ padding: 10, backgroundColor: "green", borderRadius: 20, width: "60%", alignItems: 'center', marginRight: "5%" }} onPress={startGame}>
                                <Text style={styles.buttonText}>Confirmar Aposta</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 10, backgroundColor: "red", borderRadius: 20, width: "20%", alignItems: 'center' }} onPress={() => navigation.navigate('TelaInicial')}>
                                <Text style={styles.buttonText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <Text style={styles.title}>
                {userChoice ? `Rodada ${round} - Resultado:` : 'Faça sua escolha:'}
            </Text>

            {userChoice ? (
                <View style={styles.resultContainer}>
                    <View style={styles.resultContainerFila}>
                        <View style={styles.resultContainerJogador}>
                            <Text style={styles.resultTextName}>Você:</Text>
                            <Image
                                source={choices.find(choice => choice.name === userChoice).image}
                                style={styles.choiceImagePlayer}
                            />
                        </View>
                        <View style={styles.resultContainerJogador}>
                            <Text style={styles.resultTextName}>Macaquinho:</Text>
                            <Image
                                source={choices.find(choice => choice.name === computerChoice).image}
                                style={styles.choiceImage}
                            />
                        </View>
                    </View>
                    <Text style={styles.resultText}>{result}</Text>

                    <Text style={styles.scoreText}>Placar: {"\n \n"}Você {userScore} x {computerScore} Macaquinho</Text>

                    {roundComplete && userScore < 2 && computerScore < 2 ? (
                        <TouchableOpacity style={styles.buttonNextRound} onPress={nextRound}>
                            <Text style={styles.buttonText}>Próxima Rodada</Text>
                        </TouchableOpacity>
                    ) : null}

                    {userScore === 2 || computerScore === 2 ? (
                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.buttonReset} onPress={() => {
                                const valorAposta = parseFloat(betAmount);
                                const resultado = userScore === 2 ? `Você ganhou ${valorAposta}!` : `Você perdeu ${valorAposta}.`;

                                Alert.alert(
                                    "Fim de Jogo",
                                    resultado,
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => endGame(userScore === 2),
                                        }
                                    ]
                                );
                            }}>
                                <Image source={require('../../assets/botoes/home.png')} style={styles.botoesImg}></Image>
                            </TouchableOpacity>
                        </View>
                    ) : null}


                </View>
            ) : (
                <View style={styles.choicesContainer}>
                    {choices.map((choice) => (
                        <TouchableOpacity
                            key={choice.name}
                            style={styles.button}
                            onPress={() => playGame(choice.name)}
                        >
                            <Image source={choice.image} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6E1385',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        position: "relative",
        bottom: "10%",
        textAlign: "center",
        textAlignVertical: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        borderColor: "#FFF500",
        borderWidth: 1,
        backgroundColor: '#1E062B',
        borderRadius: 20,
        width: "90%",
        height: "7%",
    },
    choicesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        borderColor: "#FFF500",
        borderWidth: 1,
        backgroundColor: '#1E062B',
        borderRadius: 30,
    },
    button: {
        padding: 10,
    },
    btns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        width: 80,
        height: 80,
    },
    resultContainer: {
        alignItems: 'center',
        borderColor: "#FFF500",
        borderWidth: 1,
        backgroundColor: '#1E062B',
        borderRadius: 15,
        width: "100%",
    },
    resultContainerJogador: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultContainerFila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resultText: {
        fontSize: 22,
        color: '#fff',
        margin: "5%",
        padding: "3%",
        borderColor: "#FFF500",
        borderWidth: 1,
        backgroundColor: '#3B1B4D',
        borderRadius: 15,
    },
    resultTextName: {
        fontSize: 22,
        color: '#FFF500',
        marginTop: "15%",
    },
    choiceImage: {
        width: 100,
        height: 100,
        margin: 10,
        borderColor: "#FFF500",
        borderWidth: 1,
        backgroundColor: 'red',
        borderRadius: 15,
    },
    choiceImagePlayer: {
        width: 100,
        height: 100,
        margin: 10,
        borderColor: "#FFF500",
        borderWidth: 1,
        backgroundColor: 'green',
        borderRadius: 15,
    },
    scoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#FFF',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#1E062B',
        borderRadius: 10,
        alignItems: 'center',
        borderColor: '#FAFF00',
        borderWidth: 1,
    },
    modalTitle: {
        fontSize: 24,
        color: '#FFF',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 2,
        borderColor: '#FAFF00',
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginBottom: 20,
    },
    buttonNextRound: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginVertical: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
    },
    buttonReset: {
        backgroundColor: 'transparent',
        padding: 10,
        marginTop: 20,
    },
    botoesImg: {
        width: 70,
        height: 70,
    },
});

export default PedraPapelTesoura;
