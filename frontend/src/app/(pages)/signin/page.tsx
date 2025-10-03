"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import AuthForm from "../../components/AuthForm";
import { signIn } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { connection } from "next/server";

export default function SignInPage() {
  const router = useRouter();
   const { login } = useAuth();
  const mutation = useMutation({
    mutationFn: signIn,
     onSuccess: (data) => {
        console.log(data);
         console.log("token",data.token);
      login({ email: data.user.email, token: data.token , username: data.user.username});
      router.push("/dashboard");
    },
   });

  return (
    <AuthForm type="signin" onSubmit={(data) => mutation.mutate(data)} 
     isError={mutation.isError}
          error={mutation.error} />
  );
}
