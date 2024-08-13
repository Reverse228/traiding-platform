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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCountry, usePostRegister } from "@/api";
import { CompareObjects } from "@/utils/functions/compareObjects";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { ASSETS } from "@/utils/constants";
import { setToken } from "@/utils/functions/authentication";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LifeBuoy } from "lucide-react";

type LogInData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  phone: string;
};

const defaultValues: LogInData = {
  name: "",
  surname: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "",
  phone: "+",
};

const Registration = () => {
  const router = useRouter();

  const { data: country } = useGetCountry();
  const {
    executeMutation: registerApi,
    status,
    data: registerData,
    isLoading,
  } = usePostRegister();

  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch } = useForm<LogInData>({
    defaultValues,
  });

  const disableSubmit = !CompareObjects(defaultValues, watch());

  const onSubmit: SubmitHandler<LogInData> = (data) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        description: "Пароли не совпадают",
      });
    } else {
      registerApi({
        email: data.email,
        password: data.password,
        phone: data.phone,
        country: data.country,
        name: `${data.name} ${data.surname}`,
      });
    }
  };

  const handleReg = () => {
    router.replace("login");
  };

  const handlePhone = (value: string) => {
    const normalNumber = value.replace(/[^\d.+]|(?<!^)\+/g, "");
    setValue("phone", normalNumber);
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
        description: "Данная почта уже используется!",
      });
    } else if (status === "success") {
      toast({
        variant: "default",
        description: "Регестрация завершина успешно!",
      });

      if (registerData) {
        setCookiesToken(registerData).then(() => {
          setTimeout(() => {
            router.push(ASSETS);
          }, 300);
        });
      }

      setTimeout(() => {
        router.push(ASSETS);
      }, 200);
    }
  }, [status]);

  return (
    <>
      <MainWrapper className={"flex justify-center flex-col items-center"}>
        <div className={"max-w-96 w-full flex flex-col gap-3 items-end"}>
          <Button
            variant={"link"}
            className={"w-fit transition opacity-60 hover:opacity-100"}
            onClick={handleReg}
          >
            Войти
          </Button>
          <Card className="w-full">
            <CardHeader className={"gap-2"}>
              <CardTitle>Регистрация</CardTitle>
              <CardDescription>Создание нового аккаунта</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className={"flex flex-col gap-4"}>
                <InputLabel
                  id={"name"}
                  label={"Имя*"}
                  inputProps={{
                    type: "text",
                    required: true,
                    ...register("name"),
                  }}
                />
                <InputLabel
                  id={"surname"}
                  label={"Фамилия*"}
                  inputProps={{
                    type: "text",
                    required: true,
                    ...register("surname"),
                  }}
                />
                <InputLabel
                  id={"email"}
                  label={"Почта*"}
                  inputProps={{
                    type: "email",
                    required: true,
                    ...register("email"),
                  }}
                />
                <Separator className="my-4" />
                <InputLabel
                  id={"password"}
                  label={"Пароль*"}
                  inputProps={{
                    type: "password",
                    required: true,
                    ...register("password"),
                  }}
                />
                <InputLabel
                  id={"confirmPassword"}
                  label={"Подвердите пароль*"}
                  inputProps={{
                    type: "password",
                    required: true,
                    ...register("confirmPassword"),
                  }}
                />
                <Separator className="my-4" />
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={"country"} className={"ml-1"}>
                    Страна*
                  </Label>
                  <Select
                    name={"country"}
                    onValueChange={(value) => setValue("country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={country ? country[0] : ""}
                        id={"country"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {country ? (
                          country?.map((item) => (
                            <SelectItem value={item} key={item}>
                              {item}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value={"noOption"} disabled>
                            Нету вариантов
                          </SelectItem>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <InputLabel
                  id={"phone"}
                  label={"Телефон*"}
                  inputProps={{
                    type: "text",
                    required: true,
                    name: "phone",
                    value: watch("phone"),
                    onChange: (value) => {
                      handlePhone(value.target.value);
                    },
                  }}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className={"w-full"}
                  type={"submit"}
                  disabled={disableSubmit || isLoading}
                >
                  {isLoading ? <LoadingSpinner /> : "Зарегестрироваться"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </MainWrapper>
      <HoverCard>
        <HoverCardTrigger
          className={
            "absolute top-auto left-full -translate-y-[200%] -translate-x-[200%]"
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

export default Registration;
