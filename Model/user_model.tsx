import userApi from "../api/userApi";

const getUserById = async (userId: string) => {
    console.log("getUserById()");
    return userApi.getUserById(userId);
    // if (res.status == 401) { TODO
    //     //token expired
    //     // TODO - refresh token, saving it and try again
    // }
};

export default { getUserById };
