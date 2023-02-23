import { FC, useState } from "react";

import React from "react";
import postModel, { newPost, Post } from "../Model/post_model";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Button,
    Alert,
    TextInput,
    StatusBar,
    ScrollView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import userModel from "../Model/user_model";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyProfile: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [userFullname, setFullName] = useState("");
    const [userAvatarUri, setAvatarUri] = useState("url");
    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");

    const updateDetails = async () => {
        const currentUserId = await AsyncStorage.getItem("userId");
        if (currentUserId != null) {
            const user: any = await userModel.getUserById(currentUserId);
            console.log("user name - " + user.fullName);
            setFullName(user.fullName);
            setAvatarUri(user.image);
            setEmail(user.email);
        }
    };

    React.useEffect(() => {
        updateDetails();
    }, []);

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

    const onSaveCallback = async () => {
        console.log("button was pressed");
        let newDetails;
        if (userPassword != "") {
            newDetails = {
                fullName: userFullname,
                image: userAvatarUri,
                password: userPassword,
                email: userEmail,
            };
        } else {
            newDetails = {
                fullName: userFullname,
                image: userAvatarUri,
                email: userEmail,
            };
        }

        try {
            if (userAvatarUri != "url") {
                console.log("trying upload image");
                const url = await postModel.uploadImage(userAvatarUri); // TODO - cange from postModel to userModel ??
                newDetails.image = url;
            }
            const currentUserId = await AsyncStorage.getItem("userId");
            if (currentUserId != null) {
                console.log(newDetails);
                await userModel.putUserById(currentUserId, newDetails);
                console.log("posted");
            } else {
                console.log("fail updation user");
            }
        } catch (err) {
            console.log("fail updation user");
        }
        // navigation.goBack(); // TODO - what after saving ??
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View>
                    {userAvatarUri == "url" && (
                        <Image
                            style={styles.avatar}
                            source={require("../assets/avatar.png")}
                        ></Image>
                    )}
                    {userAvatarUri != "url" && (
                        <Image
                            style={styles.avatar}
                            source={{ uri: userAvatarUri }}
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
                    placeholder="Full Name"
                    value={userFullname}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    placeholder="Email"
                    value={userEmail}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    placeholder="Password"
                    value={userPassword}
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onSaveCallback}
                    >
                        <Text style={styles.buttonText}>Save My Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
    },
    avatar: {
        height: 200,
        resizeMode: "contain",
        alignSelf: "center",
        width: "100%",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },

    buttonsContainer: {
        flexDirection: "row",
    },
    button: {
        flex: 1,
        margin: 12,
        padding: 12,
        backgroundColor: "blue",
        borderRadius: 10,
    },
    buttonText: {
        textAlign: "center",
        color: "white",
    },
    cameraButton: {
        position: "absolute",
        bottom: -10,
        left: 10,
        width: 50,
        height: 50,
    },
    galleryBotton: {
        position: "absolute",
        bottom: -10,
        right: 10,
        width: 50,
        height: 50,
    },
});

export default MyProfile;
