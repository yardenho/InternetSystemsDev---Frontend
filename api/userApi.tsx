import apiClient from "./ClientApi";
import authModel from "../Model/auth_model";

const getUserById = async (userId: String) => {
    console.log(userId);
    let res: any = await apiClient.get("/user/" + userId);
    console.log("in getUserById " + res.status);
    console.log("res " + res.data.fullName);

    if (res.status == 401) {
        console.log("in 401 - getUserById");
        await authModel.refreshToken();
        res = await apiClient.get("/user/" + userId);
    }
    return res.data;
};

export default {
    getUserById,
};
