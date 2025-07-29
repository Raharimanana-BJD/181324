"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";

type InputFieldProps = {
  id?: string;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
} & InputHTMLAttributes<HTMLInputElement>; // pour supporter {...register()}

export default function PasswordInput({
  id,
  placeholder,
  type = "password",
  icon,
  showPasswordToggle = false,
  ...rest // ici on récupère {...register("password")}
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-2.5 h-5 w-5">{icon}</div>}
      <Input
        id={id}
        type={showPasswordToggle && showPassword ? "text" : type}
        placeholder={placeholder}
        className={icon ? "pl-10" : ""}
        {...rest} // ici on injecte les props comme onChange, name, ref, etc.
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}
