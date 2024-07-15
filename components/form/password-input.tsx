import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PasswordInput = forwardRef(
  (props: React.InputHTMLAttributes<HTMLInputElement>, ref) => {
    const [type, setType] = useState<"password" | "text">("password");

    const handleTypeChange = () => {
      if (type === "password") {
        setType("text");
      } else {
        setType("password");
      }
    };

    return (
      <div className="relative">
        <Input {...props} type={type}></Input>
        <Button
          type="button"
          variant="ghost"
          className="absolute right-0 top-0"
          onClick={handleTypeChange}
        >
          {type === "password" ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
