"use client";
import * as React from "react";
import { Crud } from "@toolpad/core/Crud";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import createUserDataSource, { User } from "@/apps/frontend-repo/data/users";
import { db } from "@/apps/frontend-repo/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  getUserData,
  resetStatus,
  RootState,
} from "@/apps/frontend-repo/store";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function UsersCrudPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, error, loading } = useSelector(
    (state: RootState) => state.user
  );
  const router = useRouter();
  const token = Cookies.get("accessToken");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    dispatch(resetStatus());
  };

  const handleClose = () => {
    setOpen(false);
    router.push("/sign-up");
  };

  React.useEffect(() => {
    if (token) {
      dispatch(getUserData());
    }
  }, [dispatch, token]);

  React.useEffect(() => {
    if (token) {
      if (error === "Invalid token") {
        handleClickOpen();
      }
    }
  }, [error, token]);

  React.useEffect(() => {
    if (token) {
      if (loading) return;
      if (data === null) {
        handleClickOpen();
      }
    }
  }, [token, data, loading]);

  React.useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]);

  const [dataSource] = React.useState(() => createUserDataSource(db));

  return (
    <Box sx={{ px: 3 }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ paddingInline: "20px !important", paddingY: "12px !important" }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ paddingInline: "20px !important", paddingY: "12px !important" }}
        >
          {error}
        </DialogTitle>
        <DialogContent
          sx={{ paddingInline: "20px !important", paddingY: "12px !important" }}
        >
          <DialogContentText id="alert-dialog-description">
            User Not Registered
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ paddingInline: "20px !important", paddingY: "12px !important" }}
        >
          <Button onClick={handleClose} autoFocus>
            Go To Register Pages
          </Button>
        </DialogActions>
      </Dialog>
      <Crud<User>
        dataSource={dataSource}
        rootPath="/users"
        initialPageSize={25}
        defaultValues={{ itemCount: 1 }}
      />
    </Box>
  );
}
