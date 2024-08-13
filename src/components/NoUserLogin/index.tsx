import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/api";
import { LOGIN, REGISTER } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { FC } from "react";

type Props = {
  label: string;
  userStatus: string;
};
const NoUserLogin: FC<Props> = ({ label, userStatus }) => {
  const router = useRouter();

  const handleLogIn = () => {
    router.push(LOGIN);
  };

  const handleRegister = () => {
    router.push(REGISTER);
  };

  return userStatus === "error" ? (
    <Alert className={"mb-5"}>
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>Внимания</AlertTitle>
      <AlertDescription>
        <Button variant={"link"} className={"pl-0 pr-1"} onClick={handleLogIn}>
          Войдите
        </Button>
        или
        <Button variant={"link"} className={"px-1"} onClick={handleRegister}>
          Зарегестрируйтесь
        </Button>
        {label}
      </AlertDescription>
    </Alert>
  ) : null;
};

export default NoUserLogin;
