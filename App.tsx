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
    TouchableHighlight,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import StudentList from "./components/studentList";
import StudentDetails from "./components/StudentDetails";
import StudentAdd from "./components/StudentAdd";

const InfoScreen: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text>Details Screen</Text>
        </View>
    );
};
// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LogoTitle: FC = () => {
    return (
        <TouchableOpacity
            onPress={() => {
                console.log("title pressed");
            }}
        >
            <Image
                style={{ width: 50, height: 50 }}
                source={require("./assets/avatar.png")}
            />
        </TouchableOpacity>
    );
};

const studentStack = createNativeStackNavigator();
const StudentStackComponent: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const addNewStudents = () => {
        navigation.navigate("StudentAdd");
    };
    return (
        <studentStack.Navigator>
            <studentStack.Screen
                name="studentList"
                component={StudentList}
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={addNewStudents}>
                            <Ionicons
                                name={"add-outline"}
                                size={40}
                                color={"gray"}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <studentStack.Screen
                name="StudentDetails"
                component={StudentDetails}
            />
            <studentStack.Screen name="StudentAdd" component={StudentAdd} />
        </studentStack.Navigator>
    );
};

const App: FC = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === "InfoScreen") {
                            iconName = focused
                                ? "information-circle"
                                : "information-circle-outline";
                        } else if (route.name === "StudentStackComponent") {
                            iconName = focused
                                ? "list-circle"
                                : "list-circle-outline";
                        }
                        // You can return any component that you like here!
                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarActiveTintColor: "tomato",
                    tabBarInactiveTintColor: "gray",
                })}
            >
                <Tab.Screen
                    name="StudentStackComponent"
                    component={StudentStackComponent}
                    options={{ headerShown: false }}
                />
                <Tab.Screen name="InfoScreen" component={InfoScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

// const App: FC = () => {
//     return <StudentList></StudentList>;
// };

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: "grey",
    },
});

export default App;

{
    /* <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    title: "Apply to all",
                    headerStyle: { backgroundColor: "red" },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerTitle: () => <LogoTitle />,
                        headerRight: () => (
                            <Button
                                onPress={() => alert("This is a button!")}
                                title="Info"
                                color="grey"
                            />
                        ),
                    }}
                />
                <Stack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{ title: "Details" }}
                    initialParams={{ id: "000" }}
                />
            </Stack.Navigator>
        </NavigationContainer> */
}
