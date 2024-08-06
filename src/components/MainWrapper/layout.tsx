import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/MainWrapper/components/header";

type Props = {
  children: ReactNode;
  className?: string;
  header?: boolean;
  rootClassName?: string;
};

const MainWrapper: FC<Props> = ({
  children,
  className,
  header,
  rootClassName,
}) => {
  return (
    <div
      className={cn(
        "w-full min-h-screen flex items-center  flex-col p-6",
        rootClassName,
      )}
    >
      {header && <Header />}
      <div className={cn("max-w-screen-md w-full", className)}>{children}</div>
    </div>
  );
};

export default MainWrapper;
