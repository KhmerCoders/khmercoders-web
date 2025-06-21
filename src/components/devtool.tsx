"use client";
import { Settings } from "lucide-react";
import { Button } from "./generated/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./generated/dropdown-menu";
import { UserLevelBadge } from "./user-level-badge";
import { UserLevel } from "@/types";

export function KhmerCoderDevtool() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full fixed bottom-16 left-5 h-9 w-9">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuLabel>KhmerCoders Devtool</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            window.location.href =
              "/dev_only/login?id=usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB";
          }}
        >
          <span className="w-6 h-6 bg-yellow-500 rounded-full"></span>
          Login as <strong>Visal In</strong>{" "}
          <UserLevelBadge level={UserLevel.SuperAdmin} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            (window.location.href =
              "/dev_only/login?id=usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC")
          }
        >
          <span className="w-6 h-6 bg-yellow-500 rounded-full"></span>
          Login as <strong>Srey Pich</strong>{" "}
          <UserLevelBadge level={UserLevel.Premium} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
