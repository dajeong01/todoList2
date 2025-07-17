import api from "./axios";

export const reqRegister = (data) => api.post("/api/todos", data);
export const reqGetList = () => api.get("/api/todos");
export const reqModify = (todoId, data) => api.put(`/api/todos/${todoId}`, data);
export const reqDeleteOne = (todoId) => api.delete(`/api/todos/${todoId}`);
export const reqDeleteAll = (todoIds) => api.delete("/api/todos", {data: todoIds});