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
    FlatList,
    TouchableHighlight,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import StudentDetails from "./StudentDetails";
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "../Model/chat_model";
import * as io from "socket.io-client";
import userModel from "../Model/user_model";
import { Colors } from "react-native/Libraries/NewAppScreen";

let currentUserId: String | null;

const ListItem: FC<{
    sender: String;
    message: String;
    image: String;
    senderId: String;
}> = ({ sender, message, image, senderId }) => {
    //TODO - fix style of the first View
    return (
        <TouchableHighlight underlayColor={"gainsboro"}>
            <View
                style={{
                    margin: 10,
                    flex: 1,
                    elevation: 1,
                    borderRadius: 3,
                    backgroundColor:
                        senderId == currentUserId ? "green" : "grey",
                    marginRight: senderId == currentUserId ? 0 : 4,
                }}
            >
                <Text style={styles.userName}>{sender}</Text>

                <View style={styles.listRow}>
                    {image == "url" && (
                        <Image
                            style={styles.userImage}
                            source={require("../assets/avatar.png")}
                        />
                    )}
                    {image != "url" && (
                        <Image
                            style={styles.userImage}
                            source={{ uri: image.toString() }}
                        />
                    )}
                    <Text style={styles.messageText}>{message}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

const Chat: FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
    let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
    const [messages, setMessages] = useState<Array<Message>>();
    const [newMessage, setNewMessage] = useState("");

    const clientSocketConnect = (
        clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>
    ): Promise<string> => {
        return new Promise((resolve) => {
            clientSocket.on("connect", () => {
                resolve("1");
            });
        });
    };

    const connectUser = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        //פתיחת סוקט ללקוח
        socket = Client("http://192.168.1.231:3000", {
            auth: {
                token: "barrer " + token,
            },
        });
        await clientSocketConnect(socket);
        // const client = { socket: socket, accessToken: token, id: userId };
        return socket;
    };

    const addUsernameToMessages = async (res: any) => {
        let messages = Array<Message>();
        console.log(res);
        if (res) {
            for (let i = 0; i < res.length; ++i) {
                const user: any = await userModel.getUserById(res[i].sender);
                console.log("usrrr---------------");
                console.log(user);
                console.log("user name - " + user.fullName);
                const mes: Message = {
                    senderId: res[i].sender,
                    sender: user.fullName,
                    message: res[i].message,
                    image: res[i].image,
                };
                messages.push(mes);
            }
        }
        return messages;
    };

    const updateUserId = async () => {
        currentUserId = await AsyncStorage.getItem("userId");
        console.log(currentUserId);
    };
    React.useEffect(() => {
        updateUserId();
        const subscribe = navigation.addListener("focus", async () => {
            console.log("focus");
            socket = await connectUser();
            if (socket != undefined) {
                socket.once("chat:get_all.response", async (arg) => {
                    //TODO - set list
                    console.log(arg.body);
                    setMessages(await addUsernameToMessages(arg.body));
                    console.log(messages);
                });
                console.log("test chat get all messages");
                console.log(socket.id);
                socket.emit("chat:get_all");
            }
        });

        const unsubscribe = navigation.addListener("blur", () => {
            console.log("unfocus");
            if (socket != undefined) socket.close();
        });

        return unsubscribe;
    }, [navigation, socket]);

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatlist}
                data={messages}
                keyExtractor={(message) => message.sender.toString()}
                renderItem={({ item }) => (
                    <ListItem
                        sender={item.sender}
                        message={item.message}
                        image={item.image}
                        senderId={item.senderId}
                    />
                )}
            ></FlatList>
            <TextInput
                style={styles.input}
                onChangeText={setNewMessage}
                placeholder="new message"
                value={newMessage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
    },
    listRow: {
        flexDirection: "row",
    },
    userImage: {
        margin: 10,
        resizeMode: "contain",
        height: 50,
        width: 50,
        borderRadius: 30,
    },
    userName: {
        fontSize: 15,
        marginTop: 10,
        marginLeft: 10,
    },
    messageText: {
        fontSize: 25,
        marginTop: 10,
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
    flatlist: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
});

export default Chat;
