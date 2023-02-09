import authApi from "../api/authApi";

export type LoginDetails = {
    email: String;
    password: String;
};

export type RegisterDetails = {
    email: String;
    password: String;
};

const userLogin = async (loginDetails: LoginDetails) => {
    console.log("login()");
    const res: any = await authApi.login(loginDetails);
    if (res.status == 400) {
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

export default { userLogin, userRegister };
