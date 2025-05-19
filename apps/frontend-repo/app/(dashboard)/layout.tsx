"use client";
import * as React from "react";
import { usePathname, useParams } from "next/navigation";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import PersonIcon from "@mui/icons-material/Person";
import type { Navigation } from "@toolpad/core/AppProvider";
import Image from "next/image";
import { Logout } from "@mui/icons-material";

const NAVIGATION: Navigation = [
  {
    segment: "users",
    title: "Users",
    icon: <PersonIcon />,
    pattern: "users{/:userId}*",
  },
  {
    segment: "logout",
    title: "Logout",
    icon: <Logout />,
  },
];

const BRANDING = {
  title: "EBuddy App",
  logo: (
    <Image
      src="/ebuddy.png"
      alt="EBuddy Logo"
      width={32}
      height={32}
      style={{ marginLeft: 8, marginRight: 8 }}
      priority
    />
  ),
};

export default function DashboardPagesLayout(props: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const [userId] = params.segments ?? [];

  const title = React.useMemo(() => {
    if (pathname === "/users/new") {
      return "New User";
    }
    if (userId && pathname.includes("/edit")) {
      return `User ${userId} - Edit`;
    }
    if (userId) {
      return `User ${userId}`;
    }

    return undefined;
  }, [userId, pathname]);

  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <NextAppProvider navigation={NAVIGATION} branding={BRANDING}>
            <DashboardLayout sx={{ px: "12px !important" }}>
              <PageContainer
                title={title}
                sx={{
                  "& .MuiAppBar-root": {
                    px: "12px !important",
                  },
                }}
              >
                {props.children}
              </PageContainer>
            </DashboardLayout>
          </NextAppProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
