import { FC, useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
} from "react-native";
import authModel, { LoginDetails, RegisterDetails } from "../Model/auth_model";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import postModel from "../Model/post_model";

const RegisterPage: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [avatarUri, setAvatarUri] = useState("url");

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
        askPermission();
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
        console.log("button was pressed");
        const details: RegisterDetails = {
            email: username,
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
            console.log(res);
            console.log("registered");
            navigation.goBack();
        } catch (err) {
            console.log("fail in register");
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
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
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Username"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                />

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
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        // marginTop: 150,
        flex: 1,
        marginTop: StatusBar.currentHeight,

        // alignItems: "center",
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
        backgroundColor: "blue",
        borderRadius: 10,
        width: 150,
        alignSelf: "center",
    },
    buttonText: {
        textAlign: "center",
        color: "white",
    },
    toRegisterText: {
        fontSize: 15,
        color: "#01579B",
        alignSelf: "center",
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
    // cameraButton: {
    //     // position: "absolute",
    //     bottom: -10,
    //     left: -100,
    //     width: 50,
    //     height: 50,
    //     alignSelf: "center",
    // },
    // galleryBotton: {
    //     // position: "absolute",
    //     // bottom: -10,
    //     right: -100,
    //     width: 50,
    //     height: 50,
    //     alignSelf: "center",
    // },
});

export default RegisterPage;
