"use client";

import MainWrapper from "@/components/MainWrapper/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { urlQuery } from "@/utils/functions/urlQuery";
import DealsType from "@/app/deals/components/dealsType";
import { useGetMe } from "@/api";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import NoUserLogin from "@/components/NoUserLogin";

type DataType = {
  id: string | null;
  activePair: {
    baseCurrency: string | null;
    lastPrice: number | null;
    type: string;
    quoteCurrency: string | null;
  };
  amount: number | null;
  price: number | null;
  orderType:
    | "BUY"
    | "SELL"
    | "BUY_LIMIT"
    | "SELL_LIMIT"
    | "BUY_STOP"
    | "SELL_STOP";
  orderCategory: "OPTIONS" | "MARGIN" | "SPOT" | "FUTURES";
  margin: number | null;
  orderStatus: string | null;
  timestamp: string | null;
};

const Deals = () => {
  const searchParams = useSearchParams();
  const currentSearchParams = new URLSearchParams(
    Array.from(searchParams.entries()),
  );

  const { data: userData, status: userStatus } = useGetMe();

  const [filteredData, setFilteredData] = useState<DataType[] | undefined>(
    undefined,
  );

  const openOrders =
    filteredData?.filter(({ orderStatus }) => orderStatus === "OPEN") ??
    userData?.orders.filter(({ orderStatus }) => orderStatus === "OPEN");

  const closeOrders =
    filteredData?.filter(({ orderStatus }) => orderStatus === "COMPLETED") ??
    userData?.orders.filter(({ orderStatus }) => orderStatus === "COMPLETED");

  const handleType = (value: "open" | "close") => {
    currentSearchParams.set("type", value);
    window.history.pushState(null, "", urlQuery(currentSearchParams));
  };

  useEffect(() => {
    if (!searchParams.get("type")) {
      currentSearchParams.set("type", "open");
      window.history.pushState(null, "", urlQuery(currentSearchParams));
    }
  }, []);

  const handleSearch = (value: string) => {
    const lowerValue = value.toLowerCase();

    const newData = userData?.orders.filter(
      ({
        activePair: { baseCurrency, quoteCurrency },
        amount,
        price,
        orderType,
        orderCategory,
        orderStatus,
      }) =>
        baseCurrency?.toLowerCase().includes(lowerValue) ||
        quoteCurrency?.toLowerCase().includes(lowerValue) ||
        amount?.toString().includes(lowerValue) ||
        price?.toString().includes(lowerValue) ||
        orderType.toLowerCase().includes(lowerValue) ||
        orderCategory.toLowerCase().includes(lowerValue) ||
        orderStatus?.toLowerCase().includes(lowerValue),
    );

    setFilteredData(newData);
  };

  return (
    <MainWrapper header menu={"/deals"}>
      <NoUserLogin label={"чтобы управлять сделками"} userStatus={userStatus} />
      <div className={"flex flex-col gap-3"}>
        <Command className={"border *:border-b-0"}>
          <CommandInput
            placeholder="Поиск активов"
            onValueChange={(value) => {
              handleSearch(value);
            }}
          />
          <CommandList />
        </Command>

        <Tabs defaultValue={searchParams.get("type") ?? "open"}>
          <TabsList className={"w-full *:w-full"}>
            <TabsTrigger
              value={"open"}
              onClick={() => handleType("open")}
              disabled={userStatus !== "success"}
            >
              Открытые сделки
            </TabsTrigger>
            <TabsTrigger
              value={"close"}
              onClick={() => handleType("close")}
              disabled={userStatus !== "success"}
            >
              Зактрыктые сделки
            </TabsTrigger>
          </TabsList>
          <TabsContent value="open">
            <DealsType data={openOrders} cancelButton userStatus={userStatus} />
          </TabsContent>
          <TabsContent value={"close"}>
            <DealsType data={closeOrders} userStatus={userStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </MainWrapper>
  );
};

export default Deals;
