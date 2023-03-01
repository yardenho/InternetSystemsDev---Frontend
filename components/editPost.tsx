import { FC, useState } from "react";

import React from "react";
import postModel, { newPost, Post } from "../Model/post_model";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    StatusBar,
    ScrollView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

const PostEdit: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [postDescription, setPostDescription] = useState("");
    const [avatarUri, setAvatarUri] = useState("url");
    const [error, setError] = useState(false);

    let postId = route.params.postId;
    const setDetails = async () => {
        console.log(postId);
        const post = await postModel.getPostById(postId);
        console.log(post);
        if (post.status != 200) {
            navigation.goBack();
        } else {
            setPostDescription(post.data.post.message);
            setAvatarUri(post.data.post.image);
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
        askPermission();
        setDetails();
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

        if (postDescription == "" || avatarUri == "") {
            setError(true);
            return;
        }

        const post: newPost = {
            message: postDescription,
            image: "url",
        };
        try {
            if (avatarUri != "url") {
                console.log("trying upload image");
                const url = await postModel.uploadImage(avatarUri);
                post.image = url;
            }
            await postModel.editPostById(postId, post);
            console.log("posted");
        } catch (err) {
            console.log("fail adding post");
        }
        navigation.goBack();
    };
    const onCancleCallback = () => {
        navigation.goBack();
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View>
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
                    onChangeText={setPostDescription}
                    placeholder="Description"
                    value={postDescription}
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onCancleCallback}
                    >
                        <Text style={styles.buttonText}>CANCLE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onSaveCallback}
                    >
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>
                </View>
                {error && (
                    <Text
                        style={{
                            fontSize: 20,
                            color: "red",
                            alignSelf: "center",
                        }}
                    >
                        Please enter image and description
                    </Text>
                )}
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

export default PostEdit;
