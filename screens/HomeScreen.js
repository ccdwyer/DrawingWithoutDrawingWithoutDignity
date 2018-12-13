import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import _ from 'lodash';

import { MonoText } from '../components/StyledText';
import originalDictionary from '../assets/dictionary';

class Dice {
  static create(sides) {
    return new Dice(sides || 6);
  }
  constructor(sides) {
    this.sides = sides || 6;
    this.roll = this.roll.bind(this);
  }
  roll() {
    var randomNumber = Math.floor(Math.random() * this.sides) + 1;
    return randomNumber;
  }
}

const dice = Dice.create(5);

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    dictionary: _.shuffle(originalDictionary),
    selectedWords: [],
  };

  getWords = () => {
    this.setState(state => {
      const roll = dice.roll();
      const selectedWords = state.dictionary.slice(0, roll);
      const remaining = state.dictionary.slice(roll);
      const dictionary = (() => {
        if (remaining.length > 0) return remaining;
        return _.shuffle(originalDictionary);
      })();
      return {
        dictionary,
        selectedWords,
      };
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <TouchableOpacity style={styles.welcomeContainer} onPress={this.getWords}>
            <Image
              source={require('../assets/images/dice.png')}
              style={styles.welcomeImage}
            />
          </TouchableOpacity>

          <View style={styles.getStartedContainer}>
            <Text style={{ fontSize: 42, textDecorationLine: 'underline' }}>Options</Text>
            {this.state.selectedWords.map(word => (
              <TouchableOpacity onPress={() => this._handlePhrasePress(word)} key={word}>
                <Text style={{ fontSize: 32, marginTop: 20 }}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };

  _handlePhrasePress = (phrase) => {
    WebBrowser.openBrowserAsync(
      `https://www.urbandictionary.com/define.php?term=${phrase.split(' ').join('+')}`
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 200,
    height: 160,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
