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

const PendingForm = () => {
  const searchParams = useSearchParams();

  const { data: pairs } = useGetPairs();
  const { status: userStatus, data: useData } = useGetMe();
  const { executeMutation: sendOrder, status: orderStatus } = usePostOrder();

  const baseCoin = searchParams.get("pair")?.split("-")[0];
  const secondCoin = searchParams.get("pair")?.split("-")[1];

  const pairsName = `${baseCoin} / ${secondCoin}`;

  const currentPairData = pairs?.find(
    ({ baseCurrency, quoteCurrency }) =>
      quoteCurrency === secondCoin && baseCurrency === baseCoin,
  );

  const lastPriceOfCoin = currentPairData?.lastPrice;

  const [sum, setSum] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(lastPriceOfCoin);

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

  const onSubmit = (typeOfDeal: "BUY_LIMIT" | "SELL_LIMIT") => {
    if (typeOfDeal && price && sum && pairsName) {
      sendOrder({
        pair: `${baseCoin}-${secondCoin}`,
        amount: sum,
        orderType: typeOfDeal,
        price: price,
        margin: 1,
        orderCategory: "SPOT",
      });
    }
  };

  const handleSum = (value: string) => {
    const numericValue = Number(value);
    setSum(numericValue);
  };

  const handlePrice = (value: string) => {
    const numericValue = Number(value);
    setPrice(numericValue);
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
        <div className={"flex gap-3"}>
          <InputLabel
            inputProps={{
              type: "number",
              onChange: (event) => handleSum(event.target.value),
            }}
            label={`Сумма в ${baseCoin}`}
          />
          <InputLabel
            inputProps={{
              type: "number",
              value: price?.toString(),
              onChange: (event) => handlePrice(event.target.value),
            }}
            label={"Цена"}
          />
        </div>
        <div className={"flex gap-3 *:w-full"}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size={"lg"}
                disabled={
                  userStatus !== "success" ||
                  !sum ||
                  orderStatus === "loading" ||
                  price === 0
                }
                className={
                  "bg-amber-600 hover:bg-amber-700 text-amber-100 text-left gap-2 overflow-hidden"
                }
              >
                {orderStatus === "loading" ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <ArrowDownRight />
                    Продать{" "}
                    {sum && price && price > 0
                      ? `за ${(sum * price).toFixed(3)} ${secondCoin}`
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
                  <AlertDialogAction onClick={() => onSubmit("SELL_LIMIT")}>
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
                  userStatus !== "success" ||
                  !sum ||
                  orderStatus === "loading" ||
                  price === 0
                }
                className={
                  "bg-lime-600 hover:bg-lime-700 text-lime-100 gap-2 overflow-hidden"
                }
              >
                {orderStatus === "loading" ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <ArrowUpRight />
                    Купить{" "}
                    {sum && price && price > 0
                      ? `за ${(sum * price).toFixed(3)} ${secondCoin}`
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
                  <AlertDialogAction onClick={() => onSubmit("BUY_LIMIT")}>
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

export default PendingForm;
