import { type ReactNode, useCallback, useState } from "react";
import { View } from "react-native";

import { useAuth } from "@/features/auth/presentation/useAuth";
import { appPalette } from "@/shared/theme/tokens";

import { AppBrandBar } from "./AppBrandBar";
import { AppDrawer } from "./AppDrawer";
import { AppHeader } from "./AppHeader";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { signOut } = useAuth();

  const handleOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleSignOut = useCallback(() => {
    void signOut();
  }, [signOut]);

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.crema }}>
      <AppHeader onMenuPress={handleOpen} />
      <AppBrandBar />
      <View style={{ flex: 1 }}>{children}</View>
      <AppDrawer
        open={drawerOpen}
        onClose={handleClose}
        onSignOut={handleSignOut}
      />
    </View>
  );
}
