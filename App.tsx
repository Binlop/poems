import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VerseComponent} from './src/VerseComponent'
import {HomeScreen} from './src/HomeScreen'

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Духовные стихи'}}
        />
        <Stack.Screen name="VerseComponent" component={VerseComponent}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
