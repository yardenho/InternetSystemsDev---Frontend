import { FC, useState } from "react";

import React from "react";
import { newPost, Post } from "../Model/post_model";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    StatusBar,
    FlatList,
    TouchableHighlight,
    ActivityIndicator,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "../Model/chat_model";
import userModel from "../Model/user_model";

let currentUserId: String | null;
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

const ListItem: FC<{
    sender: String;
    message: String;
    image: String;
    senderId: String;
}> = ({ sender, message, image, senderId }) => {
    return (
        <TouchableHighlight underlayColor={"gainsboro"}>
            <View
                style={{
                    margin: 5,
                    flex: 1,
                    elevation: 1,
                    borderRadius: 8,
                    backgroundColor:
                        senderId == currentUserId ? "#6ca074" : "#b2b2b2",
                    marginRight: senderId == currentUserId ? 10 : 50,
                    marginLeft: senderId == currentUserId ? 40 : 10,
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
    const [messages, setMessages] = useState<Array<Message>>();
    const [newMessage, setNewMessage] = useState("");
    const [proccess, setProccess] = useState(false);

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
        return socket;
    };

    const sendMessage = () => {
        console.log("***********sendMessage**********************");
        console.log(socket);
        if (socket != undefined) {
            console.log("test chat send message");
            socket.emit("chat:send_message", {
                message: newMessage,
            });
        }
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
                    image: user.image,
                    messageId: res[i]._id,
                };
                messages.push(mes);
            }
        }
        setProccess(false);
        return messages;
    };

    const fetchMessages = (socket: any) => {
        setProccess(true);

        socket.once("chat:get_all.response", async (arg: any) => {
            console.log(arg.body);
            setMessages(await addUsernameToMessages(arg.body));
            console.log(messages);
            setProccess(false);
        });
        console.log("test chat get all messages");
        console.log(socket.id);
        socket.emit("chat:get_all");
    };

    const updateUserId = async () => {
        currentUserId = await AsyncStorage.getItem("userId");
        console.log(currentUserId);
    };

    React.useEffect(() => {
        setProccess(true);
        updateUserId();
        const subscribe = navigation.addListener("focus", async () => {
            console.log("focus");
            socket = await connectUser();
            setProccess(true);

            //Register to each time that message sent in the room
            socket.on("chat:message", (arg) => {
                console.log("new message id === " + arg.res.body._id); // message id
                fetchMessages(socket);
                setNewMessage("");
            });
            if (socket != undefined) {
                fetchMessages(socket);
            }
            setProccess(false);
        });

        const unsubscribe = navigation.addListener("blur", () => {
            console.log("unfocus");
            setProccess(false);

            if (socket != undefined) socket.close();
        });

        return subscribe;
    }, [navigation, socket]);

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatlist}
                data={messages}
                keyExtractor={(message) => message.messageId.toString()}
                renderItem={({ item }) => (
                    <ListItem
                        sender={item.sender}
                        message={item.message}
                        image={item.image}
                        senderId={item.senderId}
                    />
                )}
            ></FlatList>
            <View style={styles.listRow}>
                <TextInput
                    style={styles.input}
                    onChangeText={setNewMessage}
                    placeholder="new message"
                    value={newMessage}
                />
                <TouchableOpacity onPress={sendMessage}>
                    <Ionicons
                        name={"send"}
                        style={styles.button}
                        size={40}
                    ></Ionicons>
                </TouchableOpacity>
            </View>
            <ActivityIndicator
                size={180}
                color="#5c9665"
                animating={proccess}
                style={{
                    position: "absolute",
                    marginTop: 200,
                    marginLeft: 100,
                }}
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
        fontSize: 21,
        marginTop: 4,
        marginLeft: 1,
        marginRight: 30,
    },

    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    button: {
        flex: 10,
        margin: 12,
    },
    flatlist: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
});

export default Chat;
