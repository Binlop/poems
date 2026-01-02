import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VerseComponent } from './src/VerseComponent';
import { HomeScreen } from './src/HomeScreen';
import { TouchableOpacity, Image, StyleSheet, View, Modal, Text, Pressable, Linking, Appearance } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  
  const colorScheme = Appearance.getColorScheme();
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
    },
    modalContent: {
      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colorScheme === 'dark' ? 'white' : 'black',
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: colorScheme === 'dark' ? 'white' : 'black',

    },
    closeButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    closeButtonText: {
      color: colorScheme === 'dark' ? 'white' : 'black',
      fontSize: 16,
    },
  });


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{
            title: 'Духовные стихи',
            headerRight: () => (
              <View style={{ flexDirection: 'row', marginRight: 10 }}>
                <TouchableOpacity
                  onPress={() => setOnlyFavorites((prev) => !prev)}
                  style={{ marginRight: 15 }}
                >
                  <Image
                    source={
                      onlyFavorites
                        ? require('./src/resources/star-filled.png')
                        : require('./src/resources/star.png')
                    }
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setInfoModalVisible(true)}
                >
                  <FontAwesome name="info-circle" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            ),
          }}
        >
          {(props) => (
            <HomeScreen {...props} onlyFavorites={onlyFavorites} />
          )}
        </Stack.Screen>
        <Stack.Screen name="VerseComponent" component={VerseComponent} />
      </Stack.Navigator>


      <Modal
        animationType="fade"
        transparent={true}
        visible={isInfoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>О приложении</Text>
            <Text style={styles.modalText}>
              Это приложение создано для пения и прослушивания духовных стихов. 
              Вы можете искать стихи, добавлять их в избранное и наслаждаться вдохновляющим контентом.
            </Text>
            <Text style={styles.modalText}>
              Если у вас есть новый духовный стих, то напишите на почту{' '}
              <Text
                style={{ color: '#007AFF', textDecorationLine: 'underline' }}
                onPress={() => Linking.openURL('mailto:ladrek13@mail.ru')}
              >
                ladrek13@mail.ru
              </Text>{' '}
              Мы обязательно его добавим!
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </NavigationContainer>
  );
};

export default AppStack;

