import userApi from "../api/userApi";

const getUserById = async (userId: String) => {
    console.log("getUserById()");
    const res = await userApi.getUserById(userId);
    // if (res.status == 401) { TODO
    //     //token expired
    //     // TODO - refresh token, saving it and try again
    // }
    return res;
};

export default { getUserById };
