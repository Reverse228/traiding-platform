import { useGetMe } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PleaseAuthButtons from "@/components/PleaseAuthButtons/pleaseAuthButtons";

const Header = () => {
  const { data: userData, status } = useGetMe();

  const balance = userData?.assetBalances
    ? `${userData.assetBalances.find(({ currency }) => currency === "USD")?.balance} USD`
    : "0.00 USD";

  return (
    <div className={"w-full pb-6 max-w-screen-md border-b"}>
      <div className={"flex justify-between"}>
        {status === "loading" ? (
          <>
            <div className={"flex gap-2 items-center"}>
              <Skeleton className={"h-[24px] w-[72px]"} />
              <Skeleton className={"h-[24px] w-[172px]"} />
            </div>
            <Skeleton className={"h-[40px] w-[160px]"} />
          </>
        ) : (
          <>
            {status === "success" ? (
              <>
                <div className={"flex gap-2 items-center"}>
                  <Label className={"text-muted-foreground"}>Доступно:</Label>
                  <Label className={"text-base"}>{balance}</Label>
                </div>
                <Button>Пополнить баланс</Button>
              </>
            ) : (
              <>{status === "error" && <PleaseAuthButtons />}</>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
