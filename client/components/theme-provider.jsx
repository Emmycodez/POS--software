"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemesProvider ({ children, ...props })  {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};


