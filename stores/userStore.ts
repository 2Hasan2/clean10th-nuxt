import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";

export const userStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  const fetchUser = async (query: Prisma.UserFindUniqueArgs) => {
    const data = await $fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(query),
    });

    user.value = await data;
  };

  const clearUser = () => {
    user.value = null;
  };

  return {
    user,
    fetchUser,
    clearUser,
  };
});
