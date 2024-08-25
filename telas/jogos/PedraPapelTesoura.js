import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PedraPapelTesoura = () => {
    const navigation = useNavigation();
    const [userChoice, setUserChoice] = useState('');
    const [computerChoice, setComputerChoice] = useState('');
    const [result, setResult] = useState('');
    const [userScore, setUserScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [round, setRound] = useState(1);
    const [roundComplete, setRoundComplete] = useState(false);

    const choices = [
        { name: 'Pedra', image: require('../../assets/jogos/btnPedra.png') },
        { name: 'Papel', image: require('../../assets/jogos/btnPapel.png') },
        { name: 'Tesoura', image: require('../../assets/jogos/btnTesoura.png') },
    ];

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

        // Só termina o jogo se um dos jogadores tiver 2 vitórias
        if (userScore == 2 || computerScore == 2) {
            endGame(userScore + 1 === 2);
        }
    };

    const endGame = (userWon) => {
        if (userWon) {
            setResult('Parabéns! Você venceu a partida!');
        } else {
            setResult('Que pena! Você perdeu a partida.');
        }
        setRoundComplete(false); // Não permitir avançar para nova rodada
    };

    const nextRound = () => {
        setUserChoice('');
        setComputerChoice('');
        setResult('');
        setRound(round + 1);
        setRoundComplete(false);
    };

    const resetGame = () => {
        setUserChoice('');
        setComputerChoice('');
        setResult('');
        setUserScore(0);
        setComputerScore(0);
        setRound(1);
        setRoundComplete(false);
    };

    return (
        <View style={styles.container}>
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

                    <Text style={styles.scoreText}>Placar: Você {userScore} x {computerScore} Computador</Text>

                    {roundComplete && userScore < 2 && computerScore < 2 ? (
                        <TouchableOpacity style={styles.buttonNextRound} onPress={nextRound}>
                            <Text style={styles.buttonText}>Próxima Rodada</Text>
                        </TouchableOpacity>
                    ) : null}

                    {userScore === 2 || computerScore === 2 ? (
                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.buttonReset} onPress={() => navigation.navigate('TelaInicial')}>
                                <Image source={require('../../assets/botoes/home.png')} style={styles.botoesImg}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonReset} onPress={resetGame}>
                                <Image source={require('../../assets/botoes/repet.png')} style={styles.botoesImg}></Image>
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
        position:  "relative",
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
    buttonNextRound: {
        backgroundColor: '#f39c12',
        padding: 10,
        borderRadius: 10,
        position: "relative",
        top: "20%",
    },
    buttonReset: {
        position: "relative",
        top: "30%",
        borderRadius: 10,
        marginHorizontal: "5%",
    },
    botoesImg: {
        height: 75,
        width: 75,
    },
    scoreText: {
      fontSize: 22,
      color: '#fff',
      margin: "5%",
      padding: "3%",
      borderColor: "#FFF500",
      borderWidth: 1,
      backgroundColor: '#3B1B4D',
      borderRadius: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default PedraPapelTesoura;
