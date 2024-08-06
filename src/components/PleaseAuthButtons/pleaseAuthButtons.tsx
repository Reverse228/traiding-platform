import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LOGIN, REGISTER } from "@/utils/constants";

const PleaseAuthButtons = () => {
  const router = useRouter();

  const handleLogIn = () => {
    router.push(LOGIN);
  };

  const handleRegister = () => {
    router.push(REGISTER);
  };

  return (
    <div className={"flex gap-2"}>
      <Button variant={"secondary"} onClick={handleLogIn}>
        Войти
      </Button>
      <Button onClick={handleRegister}>Зарегестрироатся</Button>
    </div>
  );
};

export default PleaseAuthButtons;
