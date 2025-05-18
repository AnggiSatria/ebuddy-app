import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { DataField, DataSource } from "@toolpad/core";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  recentlyActive?: string | boolean;
  [key: string | symbol]: unknown;
}

const fields: DataField[] = [
  { field: "name", type: "string", headerName: "Name" },
  { field: "email", type: "string", headerName: "Email" },
  { field: "role", type: "string", headerName: "Role" },
  { field: "recentlyActive", type: "boolean", headerName: "Recently Active" },
];

type DataModelId = string;

const createUsersDataSource = (firestore: Firestore): DataSource<User> => {
  const usersCollection = collection(firestore, "USERS");

  return {
    async getMany({ paginationModel, sortModel, filterModel }) {
      let q = query(usersCollection);

      // Sorting
      if (Array.isArray(sortModel) && sortModel.length > 0) {
        const sort = sortModel[0];
        if (sort?.field && sort?.sort) {
          q = query(q, orderBy(sort.field as string, sort.sort));
        }
      }

      // Filtering
      filterModel.items.forEach((filter: any) => {
        if (filter.operator === "==") {
          q = query(q, where(filter.field as string, "==", filter.value));
        }
      });

      // Pagination
      q = query(q, limit(paginationModel.pageSize));

      const snapshot = await getDocs(q);
      // console.log(snapshot?.docs?.map((res) => res?.id));

      const items: User[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: (data.displayName as string) ?? "",
          email: (data.email as string) ?? "",
          role: (data.role as "admin" | "user") ?? "user",
          recentlyActive: data.recentlyActive ?? false,
        };
      });

      return { items, itemCount: items.length };
    },

    async getOne(id: DataModelId): Promise<User> {
      const docRef = doc(usersCollection, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("User not found");

      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: (data.name as string) ?? "",
        email: (data.email as string) ?? "",
        role: (data.role as "admin" | "user") ?? "user",
        recentlyActive: data.recentlyActive ?? false,
      };
    },

    async createOne(data: Partial<Omit<User, "id">>): Promise<User> {
      const docRef = await addDoc(usersCollection, data);
      return {
        id: docRef.id,
        name: (data.name as string) ?? "",
        email: (data.email as string) ?? "",
        role: (data.role as "admin" | "user") ?? "user",
        recentlyActive: false,
      };
    },

    async updateOne(
      id: DataModelId,
      data: Partial<Omit<User, "id">>
    ): Promise<User> {
      const docRef = doc(usersCollection, id);
      await updateDoc(docRef, data);
      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) throw new Error("User not found after update");
      const updatedData = updatedDoc.data();
      return {
        id: updatedDoc.id,
        name: (updatedData.name as string) ?? "",
        email: (updatedData.email as string) ?? "",
        role: (updatedData.role as "admin" | "user") ?? "user",
        recentlyActive: updatedData.recentlyActive ?? false,
      };
    },

    async deleteOne(id: DataModelId): Promise<void> {
      const docRef = doc(usersCollection, id);
      await deleteDoc(docRef);
    },

    fields,
  };
};

export default createUsersDataSource;
