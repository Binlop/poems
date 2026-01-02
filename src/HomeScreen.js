import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Определение тем
const themes = {
  light: {
    background: '#ffffff', // Фон контейнера
    blockBackground: '#ededed', // Фон блоков стихов
    textPrimary: '#333333', // Основной текст
    textSecondary: '#555555', // Вторичный текст (подзаголовки)
    border: '#cccccc', // Границы
    searchBackground: '#ffffff', // Фон поиска
    searchText: '#999999', // Текст ввода поиска
    placeholderText: '#999999', // Placeholder поиска
    iconTint: '#000000', // Цвет иконок
  },
  dark: {
    background: '#222222',
    blockBackground: '#333333',
    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
    border: '#444444',
    searchBackground: '#333333',
    searchText: '#ffffff',
    placeholderText: '#999999',
    iconTint: '#ffffff',
  },
};

// Хук для получения текущей темы
const useTheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return themes[colorScheme] || themes.light; // Fallback на светлую тему
};

export const HomeScreen = ({ navigation, onlyFavorites }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [poemsData, setPoemsData] = useState([]);
  const GOOGLE_DRIVE_URL = 'https://drive.google.com/uc?export=download&id=1JlcdG69UTU2KlkyiXtdMZdrwPhl26NOz';

  const theme = useTheme(); // Получение текущей темы

  // Загрузка данных стихов
  useEffect(() => {
    const loadPoemsData = async () => {
      try {
        const state = await NetInfo.fetch();
        const isConnected = state.isConnected;

        if (isConnected) {
          const response = await fetch(GOOGLE_DRIVE_URL);
          if (!response.ok) {
            throw new Error('Failed to fetch poems data');
          }
          const data = await response.json();
          setPoemsData(data);
          await AsyncStorage.setItem('poems_data', JSON.stringify(data));
        } else {
          const localData = await AsyncStorage.getItem('poems_data');
          if (localData) {
            setPoemsData(JSON.parse(localData));
          } else {
            console.warn('No local data available and no internet connection');
            setPoemsData([]);
          }
        }
      } catch (error) {
        console.error('Error loading poems data:', error);
        const localData = await AsyncStorage.getItem('poems_data');
        if (localData) {
          setPoemsData(JSON.parse(localData));
        }
      }
    };
    loadPoemsData();
  }, []);

  // Загрузка избранного
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  // Сохранение избранного
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    };
    saveFavorites();
  }, [favorites]);

  // Переключение статуса избранного
  const toggleFavorite = (poemTitle) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(poemTitle)
        ? prevFavorites.filter((title) => title !== poemTitle)
        : [...prevFavorites, poemTitle]
    );
  };

  // Фильтрация стихов
  const filteredPoems = poemsData
    .filter((poem) => {
      const matchesSearch =
        poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poem.text.toLowerCase().includes(searchQuery.toLowerCase());
      const isFavorite = favorites.includes(poem.title);
      return onlyFavorites ? isFavorite && matchesSearch : matchesSearch;
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'ru-RU'));

  // Стили с использованием темы
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.background,
    },
    searchContainer: {
      position: 'absolute',
      bottom: 60,
      left: 20,
      right: 20,
      backgroundColor: theme.searchBackground,
      padding: 10,
      borderRadius: 5,
      elevation: 5,
    },
    searchInput: {
      height: 40,
      borderColor: theme.border,
      borderWidth: 1,
      paddingLeft: 8,
      width: '100%',
      color: theme.searchText,
    },
    childContainer: {
      width: '100%',
      height: 80,
      backgroundColor: theme.blockBackground,
      justifyContent: 'center',
      paddingLeft: 20,
      marginBottom: 10,
      position: 'relative',
    },
    titleText: {
      fontSize: 16,
      color: theme.textPrimary,
      textAlignVertical: 'center',
      lineHeight: 24,
      width: '70%',
    },
    subTitleText: {
      fontSize: 14,
      color: theme.textSecondary,
      width: '70%',
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
      tintColor: theme.iconTint, // Поддержка тёмной темы для иконки
    },
    favoriteIcon: {
      width: 20,
      height: 20,
      position: 'absolute',
      right: 0,
      top: '50%',
      tintColor: theme.iconTint,
    },
    musicIcon: {
      width: 20,
      height: 20,
      position: 'absolute',
      right: 50,
      top: '50%',
      alignSelf: 'center',
      marginTop: -10,
      tintColor: theme.iconTint,
    },
    scrollViewContainer: {
      paddingBottom: 80,
    },
    placeholderText: {
      textAlign: 'center',
      marginTop: 20,
      color: theme.textSecondary,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {filteredPoems.length === 0 ? (
          <Text style={styles.placeholderText}>
            {onlyFavorites ? 'Нет избранных стихов' : 'Стихи не найдены'}
          </Text>
        ) : (
          filteredPoems.map((poem, index) => (
            <TouchableOpacity
              key={index}
              style={styles.childContainer}
              onPress={() =>
                navigation.navigate('VerseComponent', {
                  title: poem.title,
                  text: poem.text,
                  executor: poem.executor,
                  audio: poem.audio,
                })
              }
            >
              <Text style={styles.titleText}>{poem.title.toUpperCase()}</Text>
              <Text style={styles.subTitleText}>{poem.subtitle}</Text>
              {poem.audio ? (
                <Image
                  source={require('./resources/musical-note.png')}
                  style={styles.musicIcon}
                />
              ) : null}
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(poem.title);
                }}
                style={{ position: 'absolute', right: 20, top: '50%', marginTop: -10 }}
              >
                <Image
                  source={
                    favorites.includes(poem.title)
                      ? require('./resources/star-filled.png')
                      : require('./resources/star.png')
                  }
                  style={styles.favoriteIcon}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            placeholderTextColor={theme.placeholderText}
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
          source={require('./resources/search-icon.png')}
          style={styles.searchIcon}
        />
      </TouchableOpacity>
    </View>
  );
};