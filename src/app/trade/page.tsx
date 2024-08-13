"use client";

import MainWrapper from "@/components/MainWrapper/layout";
import { useSearchParams } from "next/navigation";
import { useGetMe, useGetPairs } from "@/api";
import { useEffect } from "react";
import { urlQuery } from "@/utils/functions/urlQuery";
import ActionForm from "@/app/trade/components/actionForm";
import NoUserLogin from "@/components/NoUserLogin";
import LimitForm from "@/app/trade/components/limitForm";

const Trade = () => {
  const searchParams = useSearchParams();
  const currentSearchParams = new URLSearchParams(
    Array.from(searchParams.entries()),
  );

  const { status: userStatus } = useGetMe();
  const { data: pairData } = useGetPairs();

  useEffect(() => {
    if (pairData?.length) {
      const pairParam = searchParams.get("pair");
      const typeParam = searchParams.get("type");

      if (!pairParam) {
        const pair = `${pairData[0].baseCurrency}-${pairData[0].quoteCurrency}`;
        currentSearchParams.set("pair", pair);
      }

      if (!typeParam) {
        const existPairType =
          pairParam &&
          pairData.find(
            ({ baseCurrency }) => pairParam.split("-")[0] === baseCurrency,
          )?.type;

        const type = existPairType ?? pairData[0].type;
        currentSearchParams.set("type", type);
      }

      if (!pairParam || !typeParam) {
        window.history.pushState(null, "", urlQuery(currentSearchParams));
      }
    }
  }, [searchParams.size, pairData?.length]);

  return (
    <MainWrapper header menu={"/trade"} secondBalance>
      <NoUserLogin
        label={"чтобы иметь возможность торговать активыми"}
        userStatus={userStatus}
      />
      <LimitForm />
      {/*<Chart />*/}
    </MainWrapper>
  );
};

export default Trade;
