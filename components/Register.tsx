import { FC, useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
} from "react-native";
import authModel, { LoginDetails, RegisterDetails } from "../Model/auth_model";

const RegisterPage: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onRegisterCallback = async () => {
        console.log("button was pressed");
        const details: RegisterDetails = {
            email: username,
            password: password,
            fullName: fullName,
            image: "url",
        };

        try {
            const res = await authModel.userRegister(details);
            console.log(res);
            console.log("registered");
            navigation.goBack();
        } catch (err) {
            console.log("fail in register");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>REGISTER !</Text>
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

export default RegisterPage;
