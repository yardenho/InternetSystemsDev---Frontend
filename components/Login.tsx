import { useLinkProps } from "@react-navigation/native";
import { FC, useState } from "react";
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import apiClient from "../api/ClientApi";

import authModel, { LoginDetails } from "../Model/auth_model";

const LoginPage: FC<{ route: any; navigation: any; setTokenFunc: any }> = ({
    route,
    navigation,
    setTokenFunc,
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onLoginCallback = async () => {
        console.log("button was pressed");
        const details: LoginDetails = {
            email: username,
            password: password,
        };

        try {
            const res = await authModel.userLogin(details);
            console.log(setTokenFunc);
            setTokenFunc(res.accessToken);
            apiClient.setHeader("Authorization", "JWT " + res.accessToken);
            console.log("posted");
        } catch (err) {
            console.log("fail login");
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}> Welcome to my app :)</Text>
            <Text style={styles.text}>LOGIN !</Text>
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

            <TouchableOpacity style={styles.button} onPress={onLoginCallback}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.toRegisterText}>
                    Don't have account? Regiter now
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 150,
        flex: 1,
        alignItems: "center",
    },
    text: {
        margin: 5,
        fontSize: 30,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        width: 250,
    },
    button: {
        margin: 12,
        padding: 12,
        backgroundColor: "blue",
        borderRadius: 10,
        width: 150,
    },
    buttonText: {
        textAlign: "center",
        color: "white",
    },
    toRegisterText: {
        fontSize: 15,
        color: "#01579B",
    },
});

export default LoginPage;
