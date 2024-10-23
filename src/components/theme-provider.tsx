"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { MoonIcon, SunIcon } from "lucide-react";

export function ModeToggle({ show }: { show?: boolean }) {
  const { setTheme, theme } = useTheme();
  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Button
              className="rounded-full w-8 h-8 bg-background mr-2"
              variant="outline"
              size="icon"
            >
              <SunIcon className="w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
              <MoonIcon className="absolute w-[1.2rem] h-[1.2rem] rotate-0 scale-1000 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
            </Button>
            {show == true ? <span className="">Switch Theme</span> : ""}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">Switch Theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
