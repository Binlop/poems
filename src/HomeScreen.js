import React, { useState } from 'react';
import { Button, Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { poemData } from './spiritual_texts.js';

export const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const poems = [
    {
      title: 'Слава в вышних Богу',
      subtitle: 'Слава, слава в вышних Богу!',
      text: poemData[0],
      executor: 'Мужской хор Параклит',
      numberAudio: 0,
    },
    {
      title: 'Слезы ливше о Сионе',
      subtitle: 'Слезы ливше о Сионе',
      text: poemData[1],
      executor: 'Мужской хор Параклит',
      numberAudio: 1,
    },
    {
      title: 'Притча о блудном сыне',
      subtitle: 'Человек бе некто богатый',
      text: poemData[2],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 2,
    },
    {
      title: 'Рожество Христово',
      subtitle: 'Рожество Христово – Ангел прилетел',
      text: poemData[3],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 3,
    },
    {
      title: 'Об Иосафе царевиче',
      subtitle: 'Из пустыни старец в царский дом приходит',
      text: poemData[4],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 4,
    },
    {
      title: 'Плач всеродного Адама',
      subtitle: 'Седе Адам прямо рая',
      text: poemData[5],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 5,
    },
    {
      title: 'Запевайте, христиане',
      subtitle: 'Запевайте, христиане',
      text: poemData[6],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 6,
    },
    {
      title: 'Христос и самарянка',
      subtitle: 'Под тенью навеса, на выступе гладком',
      text: poemData[7],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 7,
    },
    {
      title: 'Взглянь, грешник',
      subtitle: 'Кто поднимет свой взор на Христа на Кресте',
      text: poemData[8],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 8,
    },
    {
      title: 'Се Жених грядет',
      subtitle: 'Пробудись от сна, друг бедный',
      text: poemData[9],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 9,
    },
    {
      title: 'О Содоме',
      subtitle: 'Вечер, сумерки настали',
      text: poemData[10],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 10,
    },
    {
      title: 'О ВОСКРЕСЕНИИ ХРИСТА',
      subtitle: 'Спит Сион и дремлет злоба',
      text: poemData[11],
      executor: 'Новосибирский молодежный хор',
      numberAudio: 11,
    },
  ];

  const filteredPoems = poems.filter(
    (poem) =>
      poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    searchContainer: {
      position: 'absolute',
      bottom: 60,
      left: 20,
      right: 20,
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      elevation: 5,
    },
    searchInput: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingLeft: 8,
      width: '100%',
    },
    childContainer: {
      width: '100%',
      height: 70,
      backgroundColor: '#ededed',
      justifyContent: 'center',
      paddingLeft: 20,
      marginBottom: 10,
    },
    titleText: {
      fontSize: 16,
      color: 'black',
      textAlignVertical: 'center',
      lineHeight: 24,
    },
    subTitleText: {
      fontSize: 14,
      color: 'black',
    },
    searchIconContainer: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 10,
    },
    searchIcon: {
      width: 50,
      height: 50,
    },
    scrollViewContainer: {
      paddingBottom: 80, // Добавляем отступ снизу, чтобы учесть прокрутку
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      {filteredPoems.map((poem, index) => (
        <TouchableOpacity
          key={index}
          style={styles.childContainer}
          onPress={() =>
            navigation.navigate('VerseComponent', {
              title: poem.title,
              text: poem.text,
              executor: poem.executor,
              numberAudio: poem.numberAudio,
            })
          }
        >
          <Text style={styles.titleText}>{poem.title.toUpperCase()}</Text>
          <Text style={styles.subTitleText}>{poem.subtitle}</Text>
        </TouchableOpacity>
      ))}
      </ScrollView>
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.searchIconContainer}
        onPress={() => setIsSearchVisible(!isSearchVisible)}
      >
        <Image
          source={require('./search-icon.png')}
          style={styles.searchIcon}
        />
      </TouchableOpacity>
    </View>
  );
};
