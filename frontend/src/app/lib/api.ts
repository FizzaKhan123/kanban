import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const encodedToken = localStorage.getItem("token");
      if (encodedToken) {
        const decodedToken = atob(encodedToken); 
        console.log("Encoded Token:", encodedToken);
        console.log("Decoded Token:", decodedToken);
         if (config.headers)
        config.headers.Authorization = `Bearer ${decodedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- Auth ----------
export const signIn = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);


  if (res.data?.token) {
    localStorage.setItem("token", btoa(res.data.token));
    localStorage.setItem("email", res.data.user.email);
    localStorage.setItem("username", res.data.user.username);
  }

  return res.data;
};

export const signUp = async (data: { username: string; email: string; password: string }) => {
  const res = await api.post("/auth/signup", data);

  
  if (res.data?.token) {
    localStorage.setItem("token", btoa(res.data.token));
  }

  return res.data;
};

// ---------- Tasks ----------
export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

export const createTask = async (data: { title: string; description: string }) => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const updateTask = async (id: string, status: string) => {
  const res = await api.patch(`/tasks/${id}`, { status });
  return res.data;
};
export const deleteTask = async (id: string) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};