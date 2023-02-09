import apiClient from "./ClientApi";

const getAllPosts = async () => {
    console.log("in post api get all posts");
    return apiClient.get("/post");
};

const addPost = async (postJson: any) => {
    return apiClient.post("/post", postJson);
};

const uploadImage = async (image: any) => {
    return apiClient.post("/file/file", image);
};

export default {
    getAllPosts,
    addPost,
    uploadImage,
};
