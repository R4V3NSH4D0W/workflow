"use client";
import { DottedSeprator } from "@/components/dotted-sperator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { LoginSchema } from "../schemas";
import { useLogin } from "../api/use-login";

export const SignInCard = () => {
  const { mutate, isPending } = useLogin();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (value: z.infer<typeof LoginSchema>) => {
    mutate({ json: value });
  };

  return (
    <Card className=" w-full h-full md:w-[487px] border-none shadow-none ">
      <CardHeader className=" flex items-center justify-center text-center px-7 py-4">
        <CardTitle className=" text-2xl">Welcome Back!</CardTitle>
      </CardHeader>
      <div className=" px-7">
        <DottedSeprator />
      </div>
      <CardContent className=" px-7">
        <Form {...form}>
          <form className=" space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter Email Address"
                      disabled={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter Password"
                      disabled={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} size="lg" className=" w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className=" px-7 py-4">
        <DottedSeprator />
      </div>
      <CardContent className=" px-7 flex flex-col gap-y-4">
        <Button
          variant="secondary"
          size="lg"
          className=" w-full"
          disabled={isPending}
        >
          <FcGoogle className=" mr-2 size-5" />
          Login with Google
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className=" w-full"
          disabled={isPending}
        >
          <FaGithub className=" mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
      <div className=" px-7">
        <DottedSeprator />
      </div>
      <CardContent className=" py-4 flex items-center justify-center">
        <p>
          Don&apos;t have an Account?{" "}
          <Link href="/sign-up">
            <span className=" text-blue-700">Sign up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
