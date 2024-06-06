import React, { useState, useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button, Text, View, StyleSheet, Appearance, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native'; // Импортируем компоненты Button и Text из react-native
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import { audioData } from './AudioData'; // Импорт файла данных
import PlayerScreen from './Audio'

// Отображение 1 стиха
export const VerseComponent =({navigation, route}) => {
    const { title, text, executor, numberAudio } = route.params;
    const [fontSize, setFontSize] = useState(18);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

    const sliderStyle = {
    width: '100%',
    fontSize: fontSize, // Динамически задаем размер шрифта
    };

const AudioView = ({ index, executor }) => {
    return (
        <View style={styles.feature} key={index}>
            <PlayerScreen
                audioCreator={executor}
                index={index}
            />
        </View>
    );
};

    const colorScheme = Appearance.getColorScheme();

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        color: colorScheme === 'dark' ? 'white' : 'black',
      },
      scrollViewContainer: {
        padding: 20,
        paddingHorizontal: 20,
        paddingBottom: 80, // Добавляем отступ снизу, чтобы учесть прокрутку
      },
      text: {
        fontWeight: 'black',
        fontSize: fontSize,
        marginLeft: 10,

      },
      scrollBarContainer: {
        position: 'absolute',
        bottom: 0,
        width: '80%',
        left: '10%', // Центрируем по горизонтали
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Прозрачный цвет фона
        paddingHorizontal: 20,
        paddingVertical: 10,

      },
        controlsContainer: {
          position: 'absolute',
          top: 0,
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      slider: {
        width: '100%',
      text: {
          fontSize: 18,
          fontWeight: 'bold',
          // marginLeft: 20,
      },
        },
      buttonPlay: {
        fontSize: 16,
        color: 'white',
        backgroundColor: 'rgba(00,80,00,1)',
        borderWidth: 1,
        borderColor: 'rgba(80,80,80,0.5)',
        overflow: 'hidden',
        paddingHorizontal: 15,
        paddingVertical: 7,
      },
      buttonStop: {
        fontSize: 16,
        color: 'white',
        backgroundColor: 'rgba(80,00,00,1)',
        borderWidth: 1,
        borderColor: 'rgba(80,80,80,0.5)',
        overflow: 'hidden',
        paddingHorizontal: 15,
        paddingVertical: 7,
      },
      feature: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
      },
      containerSound: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      color: colorScheme === 'dark' ? 'white' : 'black',
      marginBottom: 10,
      },
    textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          padding: 5,
    },
    });


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
       <View style={styles.containerSound}>
           <AudioView index={numberAudio} executor={executor}/>
       </View>
        <Text style={styles.text}>
          {text}
        </Text>
      </ScrollView>
      <View style={styles.scrollBarContainer}>

        <Slider
          style={[styles.slider, sliderStyle]} // Объединяем стили
          minimumValue={10}
          maximumValue={30}
          step={1}
          value={fontSize}
          onValueChange={(value) => setFontSize(value)}
          minimumTrackTintColor="#808080"
          maximumTrackTintColor="#000000"
        />
       </View>

    </SafeAreaView>
  );
};

