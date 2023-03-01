import { FC, useState } from "react";

import React from "react";
import postModel from "../Model/post_model";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    StatusBar,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import userModel from "../Model/user_model";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DefaultPassword = "********";

const MyProfile: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [userFullname, setFullName] = useState("");
    const [userAvatarUri, setAvatarUri] = useState("url");
    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState(DefaultPassword);
    const [editable, setEditable] = useState(false);
    const [proccess, setProccess] = useState(false);
    const [error, setError] = useState(false);

    const updateDetails = async () => {
        const currentUserId = await AsyncStorage.getItem("userId");
        console.log("currentUserId");
        console.log(currentUserId);
        if (currentUserId != null) {
            const user: any = await userModel.getUserById(currentUserId);
            console.log("user name - " + user.fullName);
            setFullName(user.fullName);
            setAvatarUri(user.image);
            setEmail(user.email);
            setProccess(false);
        } else {
            setProccess(false);
            setError(true);
        }
    };

    React.useEffect(() => {
        const subscribe = navigation.addListener("focus", async () => {
            setProccess(false);
            setError(false);
            setEditable(false);
            updateDetails();
        });
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

    const onCancelCallback = async () => {
        updateDetails();
        setError(false);
        setEditable(false);
    };

    const onSaveCallback = async () => {
        console.log("button was pressed");
        if (!editable) {
            setEditable(true);
            return;
        }
        if (userFullname == "" || userPassword == "") {
            setError(true);
            return;
        }
        setProccess(true);

        let newDetails;
        if (userPassword != DefaultPassword) {
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
                const url = await postModel.uploadImage(userAvatarUri);
                console.log(url);

                newDetails.image = url;
            }
            const currentUserId = await AsyncStorage.getItem("userId");
            if (currentUserId != null) {
                console.log(newDetails);
                await userModel.putUserById(currentUserId, newDetails);
                console.log("posted");
                setEditable(false);
                setPassword(DefaultPassword);
                setProccess(false);
            } else {
                console.log("fail updation user");
                setProccess(false);
                setError(true);
            }
        } catch (err) {
            console.log("fail updation user");
            setProccess(false);
            setError(true);
        }
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

                    <TouchableOpacity disabled={!editable} onPress={openCamera}>
                        <Ionicons
                            name={"camera"}
                            style={styles.cameraButton}
                            size={50}
                        ></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={!editable}
                        onPress={openGallery}
                    >
                        <Ionicons
                            name={"image"}
                            style={styles.galleryBotton}
                            size={50}
                        ></Ionicons>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    placeholder="Email"
                    value={userEmail}
                    editable={false}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setFullName}
                    placeholder="Full Name"
                    value={userFullname}
                    editable={editable}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    placeholder="Password"
                    value={userPassword}
                    editable={editable}
                />
                {!editable && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onSaveCallback}
                    >
                        <Text style={styles.buttonText}>Edit my details </Text>
                    </TouchableOpacity>
                )}
                {editable && (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onCancelCallback}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onSaveCallback}
                        >
                            <Text style={styles.buttonText}>
                                Save My Details
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                {error && (
                    <Text
                        style={{
                            fontSize: 20,
                            color: "red",
                            alignSelf: "center",
                        }}
                    >
                        Error occure :(
                    </Text>
                )}
                <ActivityIndicator
                    size={180}
                    color="#5c9665"
                    animating={proccess}
                    style={{
                        position: "absolute",
                        marginTop: 200,
                        marginLeft: 120,
                    }}
                />
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
