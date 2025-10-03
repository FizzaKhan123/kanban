"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import AuthForm from "../../components/AuthForm";
import { signUp } from "../../lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => router.push("/signin"),
  });

  return (
    <AuthForm type="signup" onSubmit={(data) => mutation.mutate(data)} 
          isError={mutation.isError}
          error={mutation.error}/>
  );
}
