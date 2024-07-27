import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../App";
export const useUserIds = () => {
  const query = useQuery({
    queryFn: async () => (await axios.get(`${BACKEND_URL}/get_user_ids`)).data,
    queryKey: ["user_ids"],
  });
  return query;
};

const userByIdQueryFn = async (id: string) => {
  const data = (await axios.post(`${BACKEND_URL}/get_user`, { id })).data;
  const parsed = JSON.parse(data.cache);
  return parsed;
};

async function getTableData() {
  return (await axios.get(`${BACKEND_URL}/get_table`)).data;
}

export const useUserById = (id: string) => {
  const query = useQuery({
    queryFn: () => userByIdQueryFn(id),
    queryKey: ["user", id],
  });
  return query;
};

export const useUsers = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryFn: getTableData,
    queryKey: ["usersTable"],
  });
  if (query.data) {
    for (const row of query.data) {
      queryClient.setQueryData(["user", row.id], row, {
        updatedAt: Date.now(),
      });
    }
  }
  return query.data;
};
