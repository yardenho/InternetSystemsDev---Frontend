import apiClient from "./ClientApi";

const login = async (loginJson: any) => {
    return apiClient.post("/auth/login", loginJson);
};

const register = async (registerJson: any) => {
    return apiClient.post("/auth/register", registerJson);
};

export default {
    login,
    register,
};
