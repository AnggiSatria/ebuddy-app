import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/apps/frontend-repo/firebase";
import type {
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
} from "@mui/x-data-grid";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page: GridPaginationModel["page"] =
    Number(searchParams.get("page")) || 0;
  const pageSize: GridPaginationModel["pageSize"] =
    Number(searchParams.get("pageSize")) || 10;
  const sortModel: GridSortModel = searchParams.get("sort")
    ? JSON.parse(searchParams.get("sort")!)
    : [];
  const filterModel: GridFilterModel = searchParams.get("filter")
    ? JSON.parse(searchParams.get("filter")!)
    : [];

  // Get all data from Firestore (note: bisa dioptimasi pakai query langsung kalau perlu)
  const snapshot = await getDocs(collection(db, "users"));
  let users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // FILTER
  if (filterModel?.items?.length) {
    users = users.filter((user) => {
      return filterModel.items.every(({ field, value, operator }) => {
        if (!field || value == null) return true;
        const userVal = user[field];

        switch (operator) {
          case "contains":
            return String(userVal)
              .toLowerCase()
              .includes(String(value).toLowerCase());
          case "equals":
            return userVal === value;
          case "startsWith":
            return String(userVal)
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
          case "endsWith":
            return String(userVal)
              .toLowerCase()
              .endsWith(String(value).toLowerCase());
          case ">":
            return Number(userVal) > Number(value);
          case "<":
            return Number(userVal) < Number(value);
          default:
            return true;
        }
      });
    });
  }

  // SORT
  if (sortModel.length) {
    users.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        if ((a[field] ?? "") < (b[field] ?? "")) return sort === "asc" ? -1 : 1;
        if ((a[field] ?? "") > (b[field] ?? "")) return sort === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  // PAGINATION
  const start = page * pageSize;
  const end = start + pageSize;
  const paginated = users.slice(start, end);

  return NextResponse.json({
    items: paginated,
    itemCount: users.length,
  });
}
