import {
  useUserControllerFindAll,
  useUserControllerFindOne,
  useUserControllerCreate,
  useUserControllerUpdate,
  useUserControllerGetStats,
  type UserControllerFindAllParams,
  type CreateUserDto,
  type UpdateUserDto,
} from "@/api";
import { parseError } from "../utils/parseError";

export function useUsersQuery(filters: UserControllerFindAllParams) {
  const query = useUserControllerFindAll(filters);
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useUserQuery(id: string) {
  const query = useUserControllerFindOne(id);
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useCreateUserMutation() {
  const mutation = useUserControllerCreate();
  return {
    ...mutation,
    createUser: (data: CreateUserDto) => mutation.mutateAsync({ data }),
    error: parseError(mutation.error),
  };
}

export function useUpdateUserMutation() {
  const mutation = useUserControllerUpdate();
  return {
    ...mutation,
    updateUser: (id: string, data: UpdateUserDto) =>
      mutation.mutateAsync({ id, data }),
    error: parseError(mutation.error),
  };
}

export function useUserStatsQuery() {
  const query = useUserControllerGetStats();
  return {
    ...query,
    error: parseError(query.error),
  };
}
