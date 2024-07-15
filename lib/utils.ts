import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Column } from "@tanstack/react-table";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function getCookie(name: string) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(`${name}=`) === 0) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }

  return "";
}

export function getIsDarkMode() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return true;
  } else {
    return false;
  }
}

// 深度比较简易实现
export function isEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (isEqual(val1, val2)) {
      // 日期特殊处理
      if (val1 instanceof Date && val2 instanceof Date) {
        const time1 = new Date(val1).getTime();
        const time2 = new Date(val2).getTime();
        if (time1 !== time2) {
          return false;
        }
      }
      continue;
    } else {
      return false;
    }
  }
  return true;
}

export function getPinnedStyle<TData>(column: Column<TData>) {
  if (column.getIsPinned() === "left") {
    return {
      zIndex: 9,
      position: "sticky" as any,
      left: `${column.getStart()}px`,
      background: "hsl(var(--card))",
      width: `${column.getSize()}px`,
    };
  } else if (column.getIsPinned() === "right") {
    return {
      zIndex: 9,
      position: "sticky" as any,
      right: 0,
      background: "hsl(var(--card))",
      width: `${column.getSize()}px`,
    };
  }

  return {};
}
