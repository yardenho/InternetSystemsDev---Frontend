import userApi from "../api/userApi";

const getUserById = async (userId: String) => {
    console.log("getUserById()");
    const res = await userApi.getUserById(userId);
    return res;
};

const putUserById = async (userId: String, userDetails: any) => {
    console.log("putUserById()");
    const res = await userApi.putUserById(userId, userDetails);
    return res;
};

export default { getUserById, putUserById };
