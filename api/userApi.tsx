import apiClient from "./ClientApi";
import authModel from "../Model/auth_model";

const getUserById = async (userId: String) => {
    console.log(userId);
    let res: any = await apiClient.get("/user/" + userId);

    if (res.status == 401) {
        console.log("in 401 - getUserById");
        await authModel.refreshToken();
        res = await apiClient.get("/user/" + userId);
    }
    return res.data;
};

const putUserById = async (userId: String, userDetails: any) => {
    console.log(userId);
    let res: any = await apiClient.put("/user/" + userId, userDetails);

    if (res.status == 401) {
        console.log("in 401 - getUserById");
        await authModel.refreshToken();
        res = await apiClient.put("/user/" + userId, userDetails);
    }
    return res.data;
};

export default {
    getUserById,
    putUserById,
};
