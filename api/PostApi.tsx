import authModel from "../Model/auth_model";
import apiClient from "./ClientApi";

const getAllPosts = async () => {
    const res: any = await apiClient.get("/post");
    console.log("in getAllPosts " + res.status);

    if (res.status == 401) {
        console.log("in 401 - getAllPosts");
        await authModel.refreshToken();
        return apiClient.get("/post");
    }
    return res;
};

const getAllUserPosts = async (userId: string) => {
    const res: any = await apiClient.get("/post?sender=" + userId);
    console.log("in getAllUserPosts " + res.status);

    if (res.status == 401) {
        console.log("in 401 - getAllUserPosts");
        await authModel.refreshToken();
        return apiClient.get("/post?sender=" + userId);
    }
    return res;
};

const addPost = async (postJson: any) => {
    const res: any = await apiClient.post("/post", postJson);
    console.log("in add new post " + res.status);
    if (res.status == 401) {
        console.log("in 401 - addPost");

        await authModel.refreshToken();
        return apiClient.post("/post", postJson);
    }
    return res;
};

const uploadImage = async (image: any) => {
    return apiClient.post("/file/file", image);
};

export default {
    getAllPosts,
    addPost,
    uploadImage,
    getAllUserPosts,
};
