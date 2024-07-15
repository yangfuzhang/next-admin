import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

const InputNumber = forwardRef((props: any, ref) => {
  const { onChange, ...rest } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || value === undefined) {
      onChange(value);
      return;
    }

    onChange(Number(e.target.value));
  };
  return <Input type="number" step={1} onChange={handleChange} {...rest} />;
});

InputNumber.displayName = "InputNumber";

export { InputNumber };
