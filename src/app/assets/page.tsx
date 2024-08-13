"use client";

import MainWrapper from "@/components/MainWrapper/layout";
import { useGetMe, useGetPairs } from "@/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { TRADE } from "@/utils/constants";

import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { useState } from "react";
import { GetPairsApi } from "@/api/GetPairs";
import { urlQuery } from "@/utils/functions/urlQuery";
import NoUserLogin from "@/components/NoUserLogin";

const Assets = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearchParams = new URLSearchParams(
    Array.from(searchParams.entries()),
  );

  const {
    data: pairs,
    status: pairStatus,
    isLoading: pairIsLoading,
  } = useGetPairs();
  const {
    data: userData,
    status: userStatus,
    isLoading: userIsLoading,
  } = useGetMe();

  const [filteredPair, setFilteredPairs] = useState<GetPairsApi | undefined>(
    undefined,
  );

  const skeletonArray = new Array(10).fill(0);

  const handleAction = (pair: string, type: string) => {
    currentSearchParams.set("pair", pair);
    currentSearchParams.set("type", type);

    router.push(`${TRADE}${urlQuery(currentSearchParams)}`);
  };

  const handleSearch = (value: string | null) => {
    const searchPair = value?.trim()
      ? pairs?.filter(
          ({ baseCurrency, quoteCurrency }) =>
            baseCurrency.toLowerCase().includes(value?.toLowerCase()) ||
            quoteCurrency.toLowerCase().includes(value?.toLowerCase()),
        )
      : undefined;

    setFilteredPairs(searchPair);
  };

  return (
    <MainWrapper header menu={"/assets"}>
      <div className={"w-full flex flex-col gap-3"}>
        {userStatus !== "loading" && pairStatus !== "loading" ? (
          <>
            <NoUserLogin
              label={"чтобы иметь возможность торговать активыми"}
              userStatus={userStatus}
            />
            <Command className={"border *:border-b-0"}>
              <CommandInput
                placeholder="Поиск активов"
                onValueChange={(value) => {
                  handleSearch(value);
                }}
              />
              <CommandList />
            </Command>

            {pairs?.length ? (
              filteredPair?.length === 0 ? (
                <Label
                  className={"text-muted-foreground text-xl text-center mt-6"}
                >
                  Не найдено активов с таким названием
                </Label>
              ) : (
                (filteredPair ?? pairs)?.map(
                  ({ quoteCurrency, baseCurrency, lastPrice, type }) => (
                    <Card key={`${baseCurrency}-${quoteCurrency}`}>
                      <CardHeader className={"flex-row justify-between"}>
                        <CardTitle className={"text-xl"}>
                          {`${baseCurrency} / ${quoteCurrency}`}
                        </CardTitle>
                        <CardDescription className={"flex gap-1"}>
                          <Label>Цена:</Label>
                          <Label className={"text-card-foreground"}>
                            {Number(lastPrice).toFixed(3)} USD
                          </Label>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className={"flex gap-3 *:w-full"}>
                        <Button
                          size={"lg"}
                          disabled={userStatus !== "success"}
                          className={
                            "bg-amber-600 hover:bg-amber-700 text-amber-100 text-left gap-2 max-[402px]:px-3"
                          }
                          onClick={() =>
                            handleAction(
                              `${baseCurrency}-${quoteCurrency}`,
                              type,
                            )
                          }
                        >
                          <ArrowDownRight />
                          Продать
                        </Button>
                        <Button
                          size={"lg"}
                          disabled={userStatus !== "success"}
                          className={
                            "bg-lime-600 hover:bg-lime-700 text-lime-100 gap-2 max-[402px]:px-3"
                          }
                          onClick={() =>
                            handleAction(
                              `${baseCurrency}-${quoteCurrency}`,
                              type,
                            )
                          }
                        >
                          <ArrowUpRight />
                          Купить
                        </Button>
                      </CardContent>
                    </Card>
                  ),
                )
              )
            ) : (
              <>
                <Label className={"text-muted-foreground text-xl text-center "}>
                  Список активов пуст
                </Label>
                <Label
                  className={"text-muted-foreground opacity-60 text-center"}
                >
                  Проверьте подключение к интернету или свяжитесь с службой
                  поддержки
                </Label>
              </>
            )}
          </>
        ) : (
          <>
            <Skeleton className={"w-full h-[44px]"} />
            {skeletonArray.map((_, idx) => (
              <Skeleton key={idx} className={"w-full h-[146px] rounded-lg"} />
            ))}
          </>
        )}
      </div>
    </MainWrapper>
  );
};

export default Assets;
