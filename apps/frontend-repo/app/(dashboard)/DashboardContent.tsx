"use client";
import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import StatCard, { StatCardProps } from "../../components/StatCard";
import createUsersDataSource from "../../data/users";
import { db } from "../../firebase";

export default function DashboardContent() {
  const [dataSource] = React.useState(() => createUsersDataSource(db));
  const [data, setData] = React.useState<StatCardProps[]>([
    {
      title: "Users",
      value: "0",
      interval: "Last 30 days",
      trend: "up",
      data: [],
    },
  ]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const result = await dataSource.getMany({
          paginationModel: { page: 0, pageSize: 10 },
          sortModel: [],
          filterModel: { items: [] },
        });
        setData([
          {
            title: "Users",
            value: String(result?.itemCount ?? "0"),
            interval: "Last 30 days",
            trend: "up",
            data: [
              200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320,
              360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
              460, 600, 880, 920,
            ],
          },
        ]);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    }
    fetchData();
  }, [dataSource]);

  return (
    <Box
      sx={{
        display: "flex",
        p: "12px !important",
      }}
    >
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: "auto",
          paddingX: 2,
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Overview
            </Typography>
            <Grid
              container
              spacing={2}
              columns={12}
              sx={{ mb: (theme) => theme.spacing(2) }}
            >
              {data?.map((card, index) => (
                <Grid key={index} size={{ xs: 12, sm: 12, lg: 12 }}>
                  <StatCard {...card} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
