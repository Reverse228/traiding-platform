import {
  ChartCandlestick,
  CircleUser,
  Cuboid,
  Handshake,
  History,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { MenuVariant } from "@/utils/types";
import { FC } from "react";
import { useRouter } from "next/navigation";

type Props = {
  currentTab: MenuVariant;
};

const menuContent = [
  {
    name: "Активы",
    path: "/assets",
    Icon: Cuboid,
  },
  {
    name: "Торговля",
    path: "/trade",
    Icon: ChartCandlestick,
  },
  {
    name: "Сделки",
    path: "/deals",
    Icon: Handshake,
  },
  {
    name: "История",
    path: "/history",
    Icon: History,
  },
  {
    name: "Профиль",
    path: "/profile",
    Icon: CircleUser,
  },
];

const Menu: FC<Props> = ({ currentTab }) => {
  const router = useRouter();

  const handleNavigate = (value: string) => {
    router.push(value);
  };

  return (
    <Tabs
      defaultValue={currentTab as string}
      className="max-w-screen-md w-full fixed top-full -translate-y-full pb-2 shadow left-2/4 -translate-x-1/2  max-[670px]:px-3"
    >
      <TabsList className="w-full flex h-fit">
        {menuContent.map(({ name, path, Icon }) => (
          <TabsTrigger
            value={path}
            key={path}
            className={"w-full gap-2 py-3 max-[670px]:flex-col"}
            onClick={() => handleNavigate(path)}
          >
            <Icon className={"max-[670px]:h-4"} />
            <Label className={"max-[670px]:text-[10px]"}>{name}</Label>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default Menu;
