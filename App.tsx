import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';

interface Word {
  id: number;
  russian: string;
  english: string;
}

interface State {
  selectedWordPairs: { russian: string; english: string; id: number }[];
  selectedRussianWord: string | null;
  shuffledWords: Word[];
  round: number;
}

const wordsData: Word[] = [
  { id: 1, russian: 'Кот', english: 'Cat' },
  { id: 2, russian: 'Собака', english: 'Dog' },
  { id: 3, russian: 'Дом', english: 'House' },
  { id: 4, russian: 'Мышь', english: 'Mouse' },
  { id: 5, russian: 'Человек', english: 'Human' },
  { id: 6, russian: 'Стол', english: 'Table' },
  { id: 7, russian: 'Книга', english: 'Book' },
  { id: 8, russian: 'Рыба', english: 'Fish' },
  { id: 9, russian: 'Море', english: 'Sea' },
  { id: 10, russian: 'Чай', english: 'Tea' },
  { id: 11, russian: 'Кофеин', english: 'Caffeine' },
  { id: 12, russian: 'Понедельник', english: 'Monday' },
];

const shuffleArray = (array: Word[]) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export default class GridLayout extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedWordPairs: [],
      selectedRussianWord: null,
      shuffledWords: shuffleArray(wordsData),
      round: 1,
    };
  }

  handleSquarePress = (word: Word, isRussian: boolean) => {
    if (isRussian) {
      this.setState({ selectedRussianWord: word.russian });
    } else {
      if (this.state.selectedRussianWord) {
        const matchingPair = this.state.shuffledWords.find(
          (pair) =>
            pair.russian === this.state.selectedRussianWord && pair.english === word.english
        );

        if (matchingPair) {
          const updatedSelectedWordPairs = [
            ...this.state.selectedWordPairs,
            {
              russian: this.state.selectedRussianWord,
              english: word.english,
              id: matchingPair.id,
            },
          ];

          this.setState(
            {
              selectedWordPairs: updatedSelectedWordPairs,
              selectedRussianWord: null,
            },
            () => {
            }
          );
        }
      }
    }
  };

  handleRestart = () => {
    this.setState((prevState) => ({
      selectedWordPairs: [],
      selectedRussianWord: null,
      shuffledWords: shuffleArray(wordsData),
      round: prevState.round + 1,
    }));
  };

  renderSquare = (word: Word, isRussian: boolean) => {
    if (!word) {
      return null;
    }

    const isSelected = this.state.selectedWordPairs.some(
      (pair) => pair.russian === word.russian && pair.english === word.english
    );

    return (
      <TouchableOpacity onPress={() => this.handleSquarePress(word, isRussian)}>
        <View
          key={word.id}
          style={[
            styles.box,
            isSelected ? styles.selectedBox : null,
          ]}
        >
          <Text style={styles.boxText}>{isRussian ? word.russian : word.english}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {this.renderSquare(this.state.shuffledWords[0], true)}
          {this.renderSquare(this.state.shuffledWords[1], false)}
        </View>
        <View style={styles.row}>
          {this.renderSquare(this.state.shuffledWords[2], true)}
          {this.renderSquare(this.state.shuffledWords[0], false)}
        </View>
        <View style={styles.row}>
          {this.renderSquare(this.state.shuffledWords[3], true)}
          {this.renderSquare(this.state.shuffledWords[2], false)}
        </View>
        <View style={styles.row}>
          {this.renderSquare(this.state.shuffledWords[1], true)}
          {this.renderSquare(this.state.shuffledWords[3], false)}
        </View>
        <Button title="Перезапустить" onPress={this.handleRestart} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  box: {
    flex: 1,
    height: 100,
    backgroundColor: '#white',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedBox: {
    backgroundColor: '#00CED1',
  },
  boxText: {
    color: 'dark',
  },
});
