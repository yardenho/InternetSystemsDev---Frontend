import apiClient from "./ClientApi";
import authModel from "../Model/auth_model";

const getUserById = async (userId: string) => {
    console.log(userId);
    const res: any = await apiClient.get("/user", userId);
    console.log("in getUserById " + res.status);
    console.log("res " + res);

    if (res.status == 401) {
        console.log("in 401 - getUserById");
        await authModel.refreshToken();
        return apiClient.get("/user", userId);
    }
    return res;
};

export default {
    getUserById,
};
