"use client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </MantineProvider>
  );
}
