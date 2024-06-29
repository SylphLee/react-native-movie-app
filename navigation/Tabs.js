import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Movies from "../screens/Movies"
import Tv from "../screens/Tv"
import Search from "../screens/Search"
import { useColorScheme } from "react-native";
import { BLACK_COLOR, PINK_COLOR, DARK_GREY, LIGHT_GREY, DACK_COLOR } from "../colors"
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: isDark ? DACK_COLOR : "white",
      }}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? BLACK_COLOR : "white",
        },
        tabBarActiveTintColor: PINK_COLOR,
        tabBarInactiveTintColor: isDark ? DARK_GREY : LIGHT_GREY,
        headerStyle: {
          backgroundColor: isDark ? BLACK_COLOR : "white",
        },
        headerTitleStyle: {
          color: isDark ? "white" : BLACK_COLOR,
        },
        tabBarLabelStyle: {
          marginTop: -5,
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen name="Movies" component={Movies} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={focused ? "film" : "film-outline"} color={color} size={size} />
        }
      }} />
      <Tab.Screen name="Tv" component={Tv} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name="tv-outline" color={color} size={size} />
        }
      }} />
      <Tab.Screen name="Search" component={Search} options={{
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={focused ? "search" : "search-outline"} color={color} size={size} />
        }
      }} />
    </Tab.Navigator>
  );
}

export default Tabs;