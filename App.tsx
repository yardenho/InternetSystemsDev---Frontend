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
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import StudentList from "./components/studentList";
import StudentDetails from "./components/StudentDetails";
import StudentAdd from "./components/StudentAdd";
import PostAdd from "./components/PostAdd";
import PostList from "./components/PostsList";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./api/ClientApi";
import MyPostsList from "./components/myPostsList";
import MyProfile from "./components/myProfile";
import PostEdit from "./components/editPost";

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

const postsStack = createNativeStackNavigator();
const PostsStackComponent: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const addNewPost = () => {
        navigation.navigate("PostAdd");
    };

    return (
        <postsStack.Navigator>
            <postsStack.Screen
                name="All Posts"
                component={PostList}
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={addNewPost}>
                            <Ionicons
                                name={"add-outline"}
                                size={40}
                                color={"black"}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <postsStack.Screen
                name="PostAdd"
                component={PostAdd}
                options={{ title: "Add Post" }}
            />
        </postsStack.Navigator>
    );
};

const myPostsStack = createNativeStackNavigator();
const MyPostsStackComponent: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const addNewPost = () => {
        navigation.navigate("PostAdd");
    };

    return (
        <myPostsStack.Navigator>
            <myPostsStack.Screen
                name="My Posts"
                component={MyPostsList}
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={addNewPost}>
                            <Ionicons
                                name={"add-outline"}
                                size={40}
                                color={"black"}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />
            <myPostsStack.Screen
                name="PostEdit"
                component={PostEdit}
                options={{ title: "Edit Post" }}
            />
        </myPostsStack.Navigator>
    );
};

const updateToken = async (setToken: any) => {
    const token = await AsyncStorage.getItem("accessToken");
    // await AsyncStorage.clear();
    console.log("in update token " + token);
    if (token != null) {
        apiClient.setHeader("Authorization", "JWT " + token);
        return setToken(token);
    }
};

const App: FC = () => {
    const [token, setToken] = useState();
    updateToken(setToken);
    const Stack = createNativeStackNavigator();

    if (!token) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login">
                        {(props) => (
                            <LoginPage
                                route={props.route}
                                navigation={props.navigation}
                                setTokenFunc={setToken}
                            />
                        )}
                    </Stack.Screen>
                    <Stack.Screen name="Register" component={RegisterPage} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === "All posts") {
                            iconName = focused ? "home" : "home-outline";
                        } else if (route.name === "My posts") {
                            iconName = focused ? "eye" : "eye-outline";
                        } else if (route.name === "My profile") {
                            iconName = focused
                                ? "person-circle"
                                : "person-circle-outline";
                        } else if (route.name === "Chat") {
                            iconName = focused
                                ? "chatbubbles"
                                : "chatbubbles-outline";
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
                    name="All posts"
                    component={PostsStackComponent}
                    options={{ headerShown: false }}
                />
                <Tab.Screen
                    name="My posts"
                    component={MyPostsStackComponent}
                    options={{ headerShown: false }}
                />
                <Tab.Screen name="My profile" component={MyProfile} />
                <Tab.Screen name="Chat" component={InfoScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: "grey",
    },
    row: {
        flexDirection: "row",
    },
});

export default App;
