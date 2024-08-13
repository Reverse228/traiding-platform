import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, ArrowUpRight, Settings2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useGetMe, useGetPairs, usePostOrder } from "@/api";
import InputLabel from "@/components/Input";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LimitForm = () => {
  const searchParams = useSearchParams();

  const { data: pairs } = useGetPairs();
  const { status: userStatus, data: useData } = useGetMe();
  const { executeMutation: sendOrder, status: orderStatus } = usePostOrder();

  const [sum, setSum] = useState<number | undefined>(undefined);

  const baseCoin = searchParams.get("pair")?.split("-")[0];
  const secondCoin = searchParams.get("pair")?.split("-")[1];

  const pairsName = `${baseCoin} / ${secondCoin}`;

  const currentPairData = pairs?.find(
    ({ baseCurrency, quoteCurrency }) =>
      quoteCurrency === secondCoin && baseCurrency === baseCoin,
  );

  const lastPriceOfCoin = currentPairData?.lastPrice;

  const getBalances = (type: "baseCurrency" | "quoteCurrency") =>
    useData?.assetBalances.find(
      ({ currency }) => currency === currentPairData?.[type],
    )?.balance ?? 0;

  const enoughBalances = (type: "SELL" | "BUY") => {
    const mainBalance = getBalances("quoteCurrency");
    const secondBalance = getBalances("baseCurrency");

    if (sum && lastPriceOfCoin) {
      if (type === "SELL") {
        return sum > secondBalance;
      } else if (type === "BUY") {
        return sum * lastPriceOfCoin > mainBalance;
      }
      return true;
    }
    return true;
  };

  const onSubmit = (typeOfDeal: "BUY" | "SELL") => {
    if (typeOfDeal && lastPriceOfCoin && sum && pairsName) {
      sendOrder({
        pair: `${baseCoin}-${secondCoin}`,
        amount: sum,
        orderType: typeOfDeal,
        price: lastPriceOfCoin,
        margin: 1,
        orderCategory: "SPOT",
      });
    }
  };

  const handleSum = (value: string) => {
    const numericValue = Number(value);
    setSum(numericValue);
  };

  return (
    <Card>
      <CardHeader className={"flex-row justify-between"}>
        <CardTitle className={"text-xl"}>{pairsName}</CardTitle>
        <CardDescription className={"flex gap-1"}>
          <Label>Цена:</Label>
          <Label className={"text-card-foreground"}>
            {Number(lastPriceOfCoin).toFixed(3)} USD
          </Label>
        </CardDescription>
      </CardHeader>

      <CardContent className={"flex flex-col gap-3"}>
        <InputLabel
          inputProps={{
            type: "number",
            onChange: (event) => handleSum(event.target.value),
          }}
          label={`Сумма в ${baseCoin}`}
        />
        <Accordion type={"single"} collapsible>
          <AccordionItem value={"limit"} className={"border-0"}>
            <AccordionTrigger>
              <div className={"flex items-center gap-2"}>
                <Settings2 className={"w-4"} />
                <Label>Добавить лимит</Label>
              </div>
            </AccordionTrigger>
            <AccordionContent className={"flex  px-1  gap-2"}>
              <InputLabel
                label={"Take profit"}
                inputProps={{ type: "number" }}
              />
              <InputLabel label={"Stop loss"} inputProps={{ type: "number" }} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className={"flex gap-3 *:w-full"}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size={"lg"}
                disabled={
                  userStatus !== "success" || !sum || orderStatus === "loading"
                }
                className={
                  "bg-amber-600 hover:bg-amber-700 text-amber-100 text-left gap-2 overflow-hidden max-[402px]:px-3"
                }
              >
                {orderStatus === "loading" ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <ArrowDownRight />
                    Продать{" "}
                    {sum
                      ? `за ${(sum * (lastPriceOfCoin ?? 0)).toFixed(3)} ${secondCoin}`
                      : ""}
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            {enoughBalances("SELL") ? (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Недостаточный баланс!</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`На вашем счету недостаточно ${baseCoin}.`} <br />
                    {`Ваш баланс ${getBalances("baseCurrency")} ${baseCoin}`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отменить</AlertDialogCancel>
                  <AlertDialogAction>Пополнить баланс</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            ) : (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Подвержение продажи</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`Вы намерены продать ${sum} ${baseCoin} за ${((sum ?? 0) * (lastPriceOfCoin ?? 0)).toFixed(3)} USD`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отменить</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onSubmit("SELL")}>
                    Продать
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size={"lg"}
                disabled={
                  userStatus !== "success" || !sum || orderStatus === "loading"
                }
                className={
                  "bg-lime-600 hover:bg-lime-700 text-lime-100 gap-2 overflow-hidden max-[402px]:px-3"
                }
              >
                {orderStatus === "loading" ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <ArrowUpRight />
                    Купить{" "}
                    {sum
                      ? `за ${(sum * (lastPriceOfCoin ?? 0)).toFixed(3)} ${secondCoin}`
                      : ""}
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            {enoughBalances("BUY") ? (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Недостаточный баланс!</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`На вашем счету недостаточно ${secondCoin}.`} <br />
                    {`Ваш баланс ${getBalances("quoteCurrency")} ${secondCoin}`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отменить</AlertDialogCancel>
                  <AlertDialogAction>Пополнить баланс</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            ) : (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Подвержение покупки</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`Вы намерены купить ${sum} ${baseCoin} за ${((sum ?? 0) * (lastPriceOfCoin ?? 0)).toFixed(3)} ${secondCoin}`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отменить</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onSubmit("BUY")}>
                    Купить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default LimitForm;
