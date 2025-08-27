import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UserList from "../../components/user/List";
import { handleGetApi } from "../../config";
import type { User, UserApiResponse, UserMeta } from "../../types/user";

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<UserMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      // Simplified: directly use searchParams as URLSearchParams
      const params = new URLSearchParams(searchParams).toString();
      const url = params ? `/user?${params}` : "/user";

      const response = await handleGetApi<UserApiResponse>(url);
      const payload = response.data;
      console.log("User data:", payload);

      setUsers(payload.data);
      setMeta(payload.meta);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Loading users...</div>
      </div>
    );
  }

  return (
    <>
      <section className="flex-grow">
        <div className="p-6 h-full">
          <UserList users={users} pagination={meta} onRefresh={fetchUsers} />
        </div>
      </section>
    </>
  );
};

export default UserPage;
