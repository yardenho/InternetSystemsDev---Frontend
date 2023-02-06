import { FC, useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Button,
    Alert,
    TextInput,
    FlatList,
    TouchableHighlight,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const StudentDetails: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const studentId = JSON.stringify(route.params.studentId);

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text>Details Screen</Text>
            <Text>{studentId}</Text>
        </View>
    );
};

export default StudentDetails;
