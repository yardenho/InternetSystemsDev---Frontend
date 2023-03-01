import { FC, useState } from "react";
import { StatusBar, StyleSheet, View, TouchableOpacity } from "react-native";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import PostAdd from "./components/PostAdd";
import PostList from "./components/PostsList";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./api/ClientApi";
import MyPostsList from "./components/myPostsList";
import MyProfile from "./components/myProfile";
import PostEdit from "./components/editPost";
import Chat from "./components/chat";
import authModel from "./Model/auth_model";

const Tab = createBottomTabNavigator();

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
                        <View style={styles.row}>
                            <TouchableOpacity onPress={addNewPost}>
                                <Ionicons
                                    name={"add-outline"}
                                    size={40}
                                    color={"black"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={logout}>
                                <Ionicons
                                    name={"log-out-outline"}
                                    size={40}
                                    color={"black"}
                                />
                            </TouchableOpacity>
                        </View>
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
                        <View style={styles.row}>
                            <TouchableOpacity onPress={addNewPost}>
                                <Ionicons
                                    name={"add-outline"}
                                    size={40}
                                    color={"black"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={logout}>
                                <Ionicons
                                    name={"log-out-outline"}
                                    size={40}
                                    color={"black"}
                                />
                            </TouchableOpacity>
                        </View>
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
const logout = async () => {
    const res = await authModel.logout();
    if (res == null) {
        alert("cannot log out");
    }
    await AsyncStorage.clear();
    setTokenFunc(null);
    updateToken();
};
let setTokenFunc;
const updateToken = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token != null) {
        apiClient.setHeader("Authorization", "JWT " + token);
        setTokenFunc(token);
        return;
    }
};

const App: FC = () => {
    const [token, setToken] = useState();
    setTokenFunc = setToken;
    updateToken();
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
                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={logout}
                            style={{ margin: 3 }}
                        >
                            <Ionicons
                                name={"log-out-outline"}
                                size={40}
                                color={"black"}
                            />
                        </TouchableOpacity>
                    ),
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
                <Tab.Screen name="Chat" component={Chat} />
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
