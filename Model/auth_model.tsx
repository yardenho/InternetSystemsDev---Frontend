import authApi from "../api/authApi";
import apiClient from "../api/ClientApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

//TODO - fix the types - needs them both??
export type LoginDetails = {
    email: String;
    password: String;
};

export type RegisterDetails = {
    email: String;
    password: String;
    fullName: String;
    image: String;
};

const userLogin = async (loginDetails: LoginDetails) => {
    console.log("login()");
    const res: any = await authApi.login(loginDetails);
    console.log(res);
    if (res.status == 400) {
        console.log(res.data.error);
        console.log("error in login");
        return null; //?????????/
    }
    return res.data;
};

const userRegister = async (loginDetails: RegisterDetails) => {
    console.log("register()");
    const res: any = await authApi.register(loginDetails);
    if (res.status == 400) {
        console.log("error in register");
        return null; //?????????/
    }
    console.log("end register");
    console.log(res);
    return res.data._id;
};

const refreshToken = async () => {
    console.log("refresh()");
    const token = await AsyncStorage.getItem("refreshToken");
    apiClient.setHeader("Authorization", "JWT " + token);

    const res: any = await authApi.refresh();
    if (res.status == 400) {
        console.log("error in refresh");
        console.log(res);
        return; //?????????/ TODO
    }
    console.log("end refresh");
    console.log(res);
    //TODO - maybe to do one function with login
    apiClient.setHeader("Authorization", "JWT " + res.data.accessToken);
    await AsyncStorage.setItem("accessToken", res.data.accessToken);
    await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
};

export default { userLogin, userRegister, refreshToken };
