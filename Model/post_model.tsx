import postApi from "../api/PostApi";
import FormData from "form-data";
import userModel from "./user_model";

export type Post = {
    username: String;
    description: String;
    image: String;
    postId: String;
    userImage: String;
};

export type newPost = {
    //TODO
    description: String;
    image: String;
};

const createPostsList = async (res: any) => {
    let posts = Array<Post>();
    if (res.data) {
        console.log(" in  if (res.data)");
        console.log(res.data);
        const list = res.data.post;
        console.log(list);
        for (let i = 0; i < list.length; ++i) {
            console.log("element: " + list[i]._id);
            const user: any = await userModel.getUserById(list[i].sender);
            console.log("user name - " + user.fullName);
            const st: Post = {
                username: user.fullName,
                description: list[i].message,
                image: list[i].image,
                postId: list[i]._id,
                userImage: user.image,
            };
            posts.push(st);
        }
        // res.data.post.forEach((obj: any) => {
        // console.log(obj);
        // console.log("element: " + obj._id);
        // // const user: any = await userModel.getUserById(obj.sender);
        // // console.log("user name - " + user.fullName);
        // const st: Post = {
        //     username: obj.sender,
        //     description: obj.message,
        //     image: obj.image,
        //     postId: obj._id,
        //     userImage: "url",
        // };
        // posts.push(st);
        // });
    }
    return posts;
};

const getAllPosts = async () => {
    console.log("getAllPosts()");
    const res: any = await postApi.getAllPosts();
    // if (res.status == 401) { TODO
    //     //token expired
    //     // TODO - refresh token, saving it and try again
    // }
    return createPostsList(res);
    // return updatingUsersNames(posts);
    // return posts;
};

const getAllUserPosts = async (userId: string) => {
    console.log("getAllUserPosts()");
    let res: any = await postApi.getAllUserPosts(userId);
    // if (res.status == 401) { TODO
    //     //token expired
    //     // TODO - refresh token, saving it and try again
    // }
    return createPostsList(res);
};

const addPost = async (post: newPost) => {
    const data = {
        message: post.description,
        image: post.image,
    };
    try {
        await postApi.addPost(data);
    } catch (err) {
        console.log("add post fail " + err);
    }
};

const deletePost = async (postId: String) => {
    try {
        await postApi.deletePost(postId);
    } catch (err) {
        console.log("add post fail " + err);
    }
};

const uploadImage = async (imageURI: String) => {
    var body = new FormData();
    body.append("file", {
        name: "name",
        type: "image/jpeg",
        uri: imageURI,
    });
    try {
        const res = await postApi.uploadImage(body);
        if (!res.ok) {
            console.log("save failed " + res.problem);
        } else {
            if (res.data) {
                const d: any = res.data;
                console.log("url: " + d.url);
                return d.url;
            }
        }
    } catch (err) {
        console.log("save failed " + err);
    }
    return "";
};

export default {
    getAllPosts,
    addPost,
    uploadImage,
    getAllUserPosts,
    deletePost,
};
