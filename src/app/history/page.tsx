"use client";

import MainWrapper from "@/components/MainWrapper/layout";
import { useGetHistory, useGetMe } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import NoUserLogin from "@/components/NoUserLogin";

const History = () => {
  const { data: historyData, status: historyStatus } = useGetHistory();
  const { status: userStatus } = useGetMe();

  const skeletonArray = new Array(10).fill(0);

  return (
    <MainWrapper header menu={"/history"}>
      <NoUserLogin
        label={"чтобы увидеть свою историю"}
        userStatus={userStatus}
      />
      {!(userStatus === "error") ? (
        <>
          {!(historyStatus === "loading") ? (
            <div className={"border rounded-lg overflow-x-scroll"}>
              <Table className={"w-full"}>
                <TableHeader>
                  <TableRow className={"*:whitespace-nowrap"}>
                    <TableHead>ID</TableHead>
                    <TableHead>Пара</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Цена входа</TableHead>
                    <TableHead>Цена выхода</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData?.map(
                    (
                      {
                        id,
                        activePair: { baseCurrency, quoteCurrency },
                        amount,
                        order: { price },
                        entryPrice,
                        exitPrice,
                        status,
                        timestamp,
                      },
                      idx,
                    ) => (
                      <TableRow key={id} className={`*:whitespace-nowrap  `}>
                        <TableCell className={"text-muted-foreground text-xs"}>
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          {baseCurrency}/
                          <Label className={"text-xs"}>{quoteCurrency}</Label>
                        </TableCell>
                        <TableCell>
                          {amount}{" "}
                          <Label className={"text-xs"}>{baseCurrency}</Label>
                        </TableCell>
                        <TableCell>
                          {price}{" "}
                          <Label className={"text-xs"}>{quoteCurrency}</Label>
                        </TableCell>
                        <TableCell className={" text-muted-foreground text-xs"}>
                          {entryPrice} {quoteCurrency}
                        </TableCell>
                        <TableCell className={"text-muted-foreground text-xs"}>
                          {exitPrice} {quoteCurrency}
                        </TableCell>
                        <TableCell>{status}</TableCell>
                        <TableCell className={"text-muted-foreground text-xs"}>
                          {dayjs(timestamp).format("YYYY/MM/DD HH:mm")}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className={"flex flex-col gap-4"}>
              <Skeleton className={"w-full h-[48px]"} />
              {skeletonArray.map((_, idx) => (
                <Skeleton className={"w-full h-[24px]"} key={idx} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={"w-full flex justify-center"}>
          <Label className={"text-muted-foreground text-xl text-center "}>
            История отсусивует
          </Label>
        </div>
      )}
    </MainWrapper>
  );
};

export default History;
