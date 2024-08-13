import { Label } from "@/components/ui/label";
import { Input, InputProps } from "@/components/ui/input";
import { FC, RefAttributes } from "react";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  label?: string;
  id?: string;
  inputProps?: InputProps & RefAttributes<HTMLInputElement>;
  labelProps?: Omit<
    LabelPrimitive.LabelProps & RefAttributes<HTMLLabelElement>,
    "ref"
  >;
};

const InputLabel: FC<Props> = ({
  className,
  labelClassName,
  inputClassName,
  label,
  id,
  inputProps,
  labelProps,
}) => {
  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn("ml-1", labelClassName)}
          {...labelProps}
        >
          {label}
        </Label>
      )}
      <Input id={id} className={inputClassName} {...inputProps} />
    </div>
  );
};

export default InputLabel;
