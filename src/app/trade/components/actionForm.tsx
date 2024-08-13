import { useSearchParams } from "next/navigation";
import { useGetMe, useGetPairs } from "@/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LimitForm from "@/app/trade/components/limitForm";
import PendingForm from "@/app/trade/components/pendingForm";
import { urlQuery } from "@/utils/functions/urlQuery";
import { Skeleton } from "@/components/ui/skeleton";

const ActionForm = () => {
  const searchParams = useSearchParams();
  const currentSearchParams = new URLSearchParams(
    Array.from(searchParams.entries()),
  );

  const { status: userStatus } = useGetMe();
  const { status: pairsStatus } = useGetPairs();

  const handleAction = (value: "limit" | "pending") => {
    currentSearchParams.set("action", value);
    window.history.pushState(null, "", urlQuery(currentSearchParams));
  };

  console.log(pairsStatus === "loading" && userStatus === "loading");

  return pairsStatus === "loading" && userStatus === "loading" ? (
    <>
      <Skeleton className={"w-full h-[40px] mb-2"} />
      <Skeleton className={"w-full h-[218px] rounded-lg"} />
    </>
  ) : (
    <Tabs defaultValue={searchParams.get("action") ?? "limit"}>
      <TabsList className={"w-full *:w-full"}>
        <TabsTrigger value={"limit"} onClick={() => handleAction("limit")}>
          Рыночная сделка
        </TabsTrigger>
        <TabsTrigger value={"pending"} onClick={() => handleAction("pending")}>
          Отложенная сделка
        </TabsTrigger>
      </TabsList>
      <TabsContent value="limit">
        <LimitForm />
      </TabsContent>
      <TabsContent value={"pending"}>
        <PendingForm />
      </TabsContent>
    </Tabs>
  );
};

export default ActionForm;
