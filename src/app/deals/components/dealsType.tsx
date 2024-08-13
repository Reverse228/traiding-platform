import { FC, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleX } from "lucide-react";
import { usePostCancelOrder } from "@/api";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
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

type Props = {
  data:
    | {
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
      }[]
    | undefined;
  cancelButton?: boolean;
  userStatus?: string;
};

const DealsType: FC<Props> = ({ data, cancelButton, userStatus }) => {
  const { executeMutation: cancelOrder, status: cancelOrderStatus } =
    usePostCancelOrder();

  const { toast } = useToast();

  const skeletonArray = new Array(10).fill(0);

  const handleCancel = (value: string | null) => {
    cancelOrder({ orderId: value });
  };

  useEffect(() => {
    if (cancelOrderStatus === "success" && userStatus === "success") {
      toast({
        variant: "default",
        description: "Сделка успешно отменина!",
      });
    }
  }, [cancelOrderStatus]);

  return (
    <div className={"flex flex-col gap-4"}>
      {userStatus === "success" ? (
        <>
          {data ? (
            data.length ? (
              data.map(
                ({
                  id,
                  activePair: { baseCurrency, quoteCurrency },
                  amount,
                  price,
                  orderType,
                  orderCategory,
                  orderStatus,
                  timestamp,
                }) => (
                  <Card key={id}>
                    <CardHeader
                      className={
                        "flex-row justify-between items-center space-y-0 flex-wrap"
                      }
                    >
                      <CardTitle
                        className={"text-xl"}
                      >{`${baseCurrency} / ${quoteCurrency}`}</CardTitle>
                      <CardDescription
                        className={
                          "flex gap-4 items-center justify-between max-[450px]:w-full"
                        }
                      >
                        <Label>
                          {dayjs(timestamp).format("YYYY/MM/DD HH:mm")}
                        </Label>
                        {cancelButton && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant={"destructive"}
                                size={"sm"}
                                className={"gap-2"}
                                disabled={cancelOrderStatus === "loading"}
                              >
                                {cancelOrderStatus === "loading" ? (
                                  <LoadingSpinner />
                                ) : (
                                  <>
                                    Зактрыть
                                    <CircleX className={"w-4"} />
                                  </>
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Вы уверены что хотите отменить даную сделку?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Данные об этой сделки после ее отмены можно
                                  будет найти во вкладке История
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отменить</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancel(id)}
                                  className={
                                    "bg-destructive text-white hover:bg-destructive/90"
                                  }
                                >
                                  Зактрыть сделку
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent
                      className={
                        "grid grid-cols-3 grid-rows-2  max-[670px]:grid-cols-2 max-[670px]:grid-rows-3 gap-4 pt-5  justify-between"
                      }
                    >
                      <div className={"flex gap-2"}>
                        <Label className={"text-muted-foreground"}>
                          Сумма:{" "}
                        </Label>
                        <Label>
                          {amount} {baseCurrency}
                        </Label>
                      </div>
                      <div className={"flex gap-2 max-[670px]:justify-end"}>
                        <Label className={"text-muted-foreground"}>
                          Категория:{" "}
                        </Label>
                        <Label>{orderCategory}</Label>
                      </div>
                      <div className={"flex gap-2 "}>
                        <Label className={"text-muted-foreground"}>
                          Цена:{" "}
                        </Label>
                        <Label>
                          {price} {quoteCurrency}
                        </Label>
                      </div>
                      <div className={"flex gap-2  max-[670px]:justify-end"}>
                        <Label className={"text-muted-foreground"}>
                          Статус:{" "}
                        </Label>
                        <Label>{orderStatus}</Label>
                      </div>

                      <div className={"flex gap-2 min-w-44"}>
                        <Label className={"text-muted-foreground "}>
                          Тип сделки:{" "}
                        </Label>
                        <Label>{orderType}</Label>
                      </div>
                      <div className={"flex gap-2  max-[670px]:justify-end"}>
                        <Label className={"text-muted-foreground"}>
                          Категория:{" "}
                        </Label>
                        <Label>{orderCategory}</Label>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )
            ) : (
              <>
                <Label
                  className={"text-muted-foreground text-xl text-center mt-6"}
                >
                  Не найдено ни одной сделки
                </Label>
              </>
            )
          ) : (
            skeletonArray.map((_, idx) => (
              <Skeleton key={idx} className={`w-full h-[174px] rounded-lg`} />
            ))
          )}
        </>
      ) : (
        <Label className={"text-muted-foreground text-xl text-center mt-5"}>
          Список сделок пуст
        </Label>
      )}
    </div>
  );
};

export default DealsType;
