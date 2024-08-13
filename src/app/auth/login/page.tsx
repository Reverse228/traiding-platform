"use client";

import MainWrapper from "@/components/MainWrapper/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import InputLabel from "@/components/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ASSETS } from "@/utils/constants";
import { useLogInUser } from "@/api";
import { setToken } from "@/utils/functions/authentication";
import { LifeBuoy } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type LogInData = {
  email: string;
  password: string;
};

const LogIn = () => {
  const router = useRouter();

  const {
    executeMutation: logInApi,
    status,
    isLoading,
    data: logInData,
  } = useLogInUser();

  const { toast } = useToast();
  const { register, handleSubmit, watch } = useForm<LogInData>();
  const onSubmit: SubmitHandler<LogInData> = (data) => {
    logInApi(data);
  };

  const handleReg = () => {
    router.replace("register");
  };

  const setCookiesToken = async (data: { accessToken: string }) => {
    await setToken(data.accessToken).then((data) => {
      localStorage.setItem("nodeAccess", "true");
    });
  };

  useEffect(() => {
    if (status === "error") {
      toast({
        variant: "destructive",
        description: "Данные для входа не действительны",
      });
    } else if (status === "success") {
      toast({
        variant: "default",
        description: "Успешный вход!",
      });

      if (logInData) {
        setCookiesToken(logInData).then(() => {
          setTimeout(() => {
            router.push(ASSETS);
          }, 300);
        });
      }
    }
  }, [status]);

  return (
    <>
      <MainWrapper
        className={"flex justify-center flex-col items-center"}
        rootClassName={"justify-center"}
      >
        <div className={"max-w-96 w-full flex flex-col gap-3 items-end"}>
          <Button
            variant={"link"}
            className={"w-fit transition opacity-60 hover:opacity-100"}
            onClick={handleReg}
          >
            Регестрация
          </Button>
          <Card className="w-full">
            <CardHeader className={"gap-2"}>
              <CardTitle>Вход</CardTitle>
              <CardDescription>Вход в существующий аккаунт</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className={"flex flex-col gap-4"}>
                <InputLabel
                  id={"email"}
                  label={"Email"}
                  inputProps={{ type: "email", ...register("email") }}
                />
                <InputLabel
                  id={"password"}
                  label={"Password"}
                  inputProps={{ type: "password", ...register("password") }}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className={"w-full"}
                  type={"submit"}
                  disabled={!(watch("email") && watch("password")) || isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner className={"absolute"} />
                  ) : (
                    "Войти"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </MainWrapper>
      <HoverCard>
        <HoverCardTrigger
          className={
            "absolute top-full left-full -translate-y-[200%] -translate-x-[200%]"
          }
        >
          <LifeBuoy
            className={"opacity-40 hover:opacity-100 transition cursor-pointer"}
          />
        </HoverCardTrigger>
        <HoverCardContent className={"text-xs w-fit"}>
          Служба поддержки
        </HoverCardContent>
      </HoverCard>
    </>
  );
};

export default LogIn;
