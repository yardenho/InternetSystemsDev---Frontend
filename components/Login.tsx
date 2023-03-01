import { useLinkProps } from "@react-navigation/native";
import { FC, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import apiClient from "../api/ClientApi";

import authModel, { LoginDetails } from "../Model/auth_model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
// 757213766387-o8n4p7n7jd5mqh8hoe2c5eu05aojo6jo.apps.googleusercontent.com
const LoginPage: FC<{ route: any; navigation: any; setTokenFunc: any }> = ({
    route,
    navigation,
    setTokenFunc,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [proccess, setProccess] = useState(false);

    React.useEffect(() => {
        const subscribe = navigation.addListener("focus", async () => {
            setEmail("");
            setPassword("");
            setError("");
            setProccess(false);
        });
    }, []);

    const onLoginCallback = async () => {
        setProccess(true);
        console.log("button was pressed");
        //TODO - check if username, password arent empty
        if (email == "" || password == "") {
            setProccess(false);
            setError("Please enter email and password");
            return;
        }
        const details: LoginDetails = {
            email: email,
            password: password,
        };

        try {
            const res = await authModel.userLogin(details);
            if (res == null) {
                console.log("returned status 400");
                setProccess(false);
                setError("Cannot login, please try again");
                return;
            }
            setTokenFunc(res.tokens.accessToken);
            apiClient.setHeader(
                "Authorization",
                "JWT " + res.tokens.accessToken
            );
            await AsyncStorage.setItem("accessToken", res.tokens.accessToken);
            await AsyncStorage.setItem("refreshToken", res.tokens.refreshToken);
            await AsyncStorage.setItem("userId", res.userId);
            console.log("posted");
            setProccess(false);
        } catch (err) {
            console.log("fail login");
            setProccess(false);
            setError("Cannot login, please try again");
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}> Welcome to my app :)</Text>
            <Text style={styles.text}>LOGIN !</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
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
            <ActivityIndicator
                size={180}
                color="#5c9665"
                animating={proccess}
                style={{ position: "absolute", marginTop: 75 }}
            />
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
        backgroundColor: "#7cab83",
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
function render() {
    throw new Error("Function not implemented.");
}
