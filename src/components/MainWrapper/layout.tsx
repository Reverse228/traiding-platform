import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/MainWrapper/components/header";
import { MenuVariant } from "@/utils/types";
import Menu from "@/components/MainWrapper/components/menu";

type Props = {
  children: ReactNode;
  className?: string;
  header?: boolean;
  menu?: MenuVariant;
  rootClassName?: string;
  secondBalance?: boolean;
};

const MainWrapper: FC<Props> = ({
  children,
  className,
  header,
  rootClassName,
  menu,
  secondBalance,
}) => {
  return (
    <div
      className={cn(
        `w-full min-h-screen flex items-center flex-col ${menu ? "px-6 pt-6 pb-20" : "p-6"} max-[670px]:p-3  max-[670px]:pb-20`,
        rootClassName,
      )}
    >
      <div className={cn("max-w-screen-md w-full relative", className)}>
        {header && <Header secondBalance={secondBalance} />}
        {children}
        {menu && <Menu currentTab={menu} />}
      </div>
    </div>
  );
};

export default MainWrapper;
