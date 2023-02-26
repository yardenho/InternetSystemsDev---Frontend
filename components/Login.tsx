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
import FacebookLogin from "react-facebook-login";

import authModel, { LoginDetails } from "../Model/auth_model";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage: FC<{ route: any; navigation: any; setTokenFunc: any }> = ({
    route,
    navigation,
    setTokenFunc,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLoginCallback = async () => {
        console.log("button was pressed");
        //TODO - check if username, password arent empty
        const details: LoginDetails = {
            email: email,
            password: password,
        };

        try {
            const res = await authModel.userLogin(details);
            if (!res) {
                console.log("returned status 400");
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
        } catch (err) {
            console.log("fail login");
            console.log(err);
        }
    };

    const responseFacebook = (res: any) => {
        console.log(res);
    };
    const componenetClicked = () => {
        console.log("response");
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
            <FacebookLogin
                appId="904545097477815"
                autoLoad={true}
                fields="password,email"
                callback={responseFacebook}
                onClick={componenetClicked}
                cssClass="my-facebook-button-class"
                icon="fa-facebook"
            ></FacebookLogin>
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
function render() {
    throw new Error("Function not implemented.");
}
