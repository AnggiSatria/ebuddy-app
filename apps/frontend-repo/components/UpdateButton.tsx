"use client";
import {
  useAppDispatch,
  useAppSelector,
} from "@/apps/frontend-repo/store/hooks";
import { updateUser } from "@/apps/frontend-repo/store";
import { Button, Typography } from "@mui/material";

export default function UpdateButton({ id, data }) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);

  return (
    <>
      <Button
        onClick={() => dispatch(updateUser({ id, data }))}
        disabled={loading}
      >
        Update User
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {!error && !loading && <Typography>Updated Successfully</Typography>}
    </>
  );
}
