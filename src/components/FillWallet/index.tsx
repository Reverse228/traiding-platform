import { FC, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, Copy, Info } from "lucide-react";
import InputLabel from "@/components/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import QRCode from "react-qr-code";

type Props = {
  children: ReactNode;
  wallet: string;
};

const FillWallet: FC<Props> = ({ children, wallet }) => {
  const { toast } = useToast();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet ?? "").then(() => {
      toast({
        title: "Адресс кошелька скопирован!",
      });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Пополнение баланса</AlertDialogTitle>
        </AlertDialogHeader>
        <div className={"flex flex-col gap-4"}>
          <Alert>
            <Info className={"w-4"} />
            <AlertTitle>Важно!</AlertTitle>
            <AlertDescription>
              Для пополнения баланса стрества отправляются на адресс кошелька в
              формате <Label className={"text-primary"}>USDT TRC20</Label>.
              Иначе средства будут утеряны
            </AlertDescription>
          </Alert>
          <InputLabel
            label={"Способ оплаты"}
            inputProps={{
              disabled: true,
              value: "USDT TRC20",
            }}
          />
          <div className={"flex items-end gap-3"}>
            <InputLabel
              label={"Адресс кошелька"}
              inputProps={{
                disabled: true,
                value: wallet,
              }}
            />
            <Button variant={"secondary"} onClick={handleCopyAddress}>
              <Copy className={"w-5"} />
            </Button>
          </div>
          <div className={"flex justify-between items-center"}>
            <div className={"flex gap-2 items-center"}>
              <Label className={"text-base"}>QR-code вашего кошелька</Label>
              <ArrowRight />
            </div>

            <QRCode
              value={wallet ?? ""}
              style={{
                height: "auto",
                maxWidth: "100px",
                width: "100px",
              }}
              bgColor={"transparent"}
              fgColor={"white"}
              level={"Q"}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Зактрыть</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default FillWallet;
