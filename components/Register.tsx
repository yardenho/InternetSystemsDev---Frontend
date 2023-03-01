import { FC, useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    ToastAndroid,
} from "react-native";
import authModel, { LoginDetails, RegisterDetails } from "../Model/auth_model";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import postModel from "../Model/post_model";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
WebBrowser.maybeCompleteAuthSession();

const RegisterPage: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [fullName, setFullName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatarUri, setAvatarUri] = useState("url");
    const [error, setError] = useState("");
    const [proccess, setProccess] = useState(false);

    const [GoogleToken, setGoogleToken] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    const [request, response, googlePromptAsync] = Google.useAuthRequest({
        expoClientId:
            "518670841026-2mpmp6ira9d8tar0k6a8a3chhs3hk19k.apps.googleusercontent.com",
    });

    useEffect(() => {
        if (response?.type === "success") {
            if (response.authentication != null) {
                setGoogleToken(response.authentication.accessToken);
                getUserInfo();
            }
        }
    }, [response, GoogleToken]);

    useEffect(() => {
        if (userInfo != null) {
            const user: any = userInfo;
            setFullName(user.given_name + " " + user.family_name);
            setEmail(user.email);
            setAvatarUri(user.picture);
        }
    }, [userInfo]);

    const getUserInfo = async () => {
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${GoogleToken}` },
                }
            );

            const user = await response.json();
            setUserInfo(user);
            console.log(user);
        } catch (error) {
            // Add your own error handler here
        }
    };

    const askPermission = async () => {
        try {
            const res = await ImagePicker.getCameraPermissionsAsync();
            if (!res.granted) {
                alert("Camera permission is require");
            }
        } catch (err) {
            console.log("ask permission error " + err);
        }
    };

    React.useEffect(() => {
        const subscribe = navigation.addListener("focus", async () => {
            setFullName("");
            setEmail("");
            setPassword("");
            setAvatarUri("url");
            setError("");
            setProccess(false);
        });
    }, []);

    const openCamera = async () => {
        try {
            const res = await ImagePicker.launchCameraAsync();
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri;
                setAvatarUri(uri);
            }
        } catch (err) {
            console.log("open camera error " + err);
        }
    };
    const openGallery = async () => {
        try {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri;
                setAvatarUri(uri);
            }
        } catch (err) {
            console.log("open camera error " + err);
        }
    };

    const onRegisterCallback = async () => {
        setProccess(true);
        console.log("button was pressed");
        if (userEmail == "" || password == "" || fullName == "") {
            setProccess(false);
            setError("Please enter valid email, password and name ");
            return;
        }
        const details: RegisterDetails = {
            email: userEmail,
            password: password,
            fullName: fullName,
            image: "url",
        };

        try {
            if (avatarUri != "url") {
                console.log("trying upload image");
                const url = await postModel.uploadImage(avatarUri); // TODO - do i need to change the postModel ???
                details.image = url;
            }
            const res = await authModel.userRegister(details);
            if (res == null) {
                setProccess(false);
                setError("cannot register, try agian");
                return;
            }
            console.log(res);
            console.log("registered");
            setProccess(false);
            navigation.goBack();
        } catch (err) {
            console.log("fail in register");
            setProccess(false);
            setError("error");
        }
    };

    const onGoogleCallback = () => {
        setUserInfo(null);
        googlePromptAsync();
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <ActivityIndicator
                    size={180}
                    color="#5c9665"
                    animating={proccess}
                    style={{
                        position: "absolute",
                        marginTop: 250,
                        marginLeft: 100,
                    }}
                />
                <View>
                    <Text style={styles.text}>REGISTER !</Text>
                    {avatarUri == "url" && (
                        <Image
                            style={styles.avatar}
                            source={require("../assets/avatar.png")}
                        ></Image>
                    )}
                    {avatarUri != "url" && (
                        <Image
                            style={styles.avatar}
                            source={{ uri: avatarUri }}
                        ></Image>
                    )}

                    <TouchableOpacity onPress={openCamera}>
                        <Ionicons
                            name={"camera"}
                            style={styles.cameraButton}
                            size={50}
                        ></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openGallery}>
                        <Ionicons
                            name={"image"}
                            style={styles.galleryBotton}
                            size={50}
                        ></Ionicons>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    onChangeText={setFullName}
                    value={fullName}
                    placeholder="Full Name"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={userEmail}
                    placeholder="Email"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                />
                {error != "" && (
                    <Text
                        style={{
                            fontSize: 20,
                            color: "red",
                            alignSelf: "center",
                        }}
                    >
                        {error}
                    </Text>
                )}
                <TouchableOpacity
                    style={styles.button}
                    onPress={onRegisterCallback}
                >
                    <Text style={styles.buttonText}>REGISTER</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.toRegisterText}>
                        Have an account? Login now
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onGoogleCallback}
                    style={styles.googleRegisterButton}
                >
                    <Image
                        source={require("../assets/google.jpg")}
                        style={{
                            height: 30,
                            width: 30,
                            margin: 4,
                            alignSelf: "center",
                        }}
                    ></Image>
                    <Text style={styles.toRegisterText}>login with google</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
    googleRegisterButton: {
        flexDirection: "row",
        margin: 10,
        padding: 12,
        borderColor: "grey",
        borderWidth: 2,
        width: 300,
        alignSelf: "center",
        alignContent: "center",
    },
    text: {
        margin: 5,
        fontSize: 30,
        alignSelf: "center",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        width: 250,
        alignSelf: "center",
    },
    button: {
        margin: 12,
        padding: 12,
        backgroundColor: "#7cab83",
        borderRadius: 10,
        width: 150,
        alignSelf: "center",
    },
    buttonText: {
        textAlign: "center",
        color: "white",
    },
    toRegisterText: {
        fontSize: 17,
        color: "black",
        alignSelf: "center",
        marginLeft: 5,
    },
    avatar: {
        height: 200,
        resizeMode: "contain",
        alignSelf: "center",
        width: "100%",
    },
    cameraButton: {
        position: "absolute",
        bottom: -10,
        left: 20,
        width: 50,
        height: 50,
    },
    galleryBotton: {
        position: "absolute",
        bottom: -10,
        right: 20,
        width: 50,
        height: 50,
    },
});

export default RegisterPage;
