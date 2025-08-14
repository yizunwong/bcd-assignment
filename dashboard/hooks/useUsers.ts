import {
  useUserControllerFindAll,
  useUserControllerFindOne,
  useUserControllerCreate,
  useUserControllerUpdate,
  useUserControllerGetStats,
  type UserControllerFindAllParams,
  type CreateUserDto,
  type UpdateUserDto,
  type CommonResponseDto,
} from "@/api";
import { parseError } from "../utils/parseError";
import { useMutation } from "@tanstack/react-query";
import { customFetcher } from "@/api/fetch";

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

export function useUploadAvatarMutation() {
  const mutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      return customFetcher<CommonResponseDto>({
        url: `/users/${id}/avatar`,
        method: "POST",
        data: formData,
      });
    },
  });

  return {
    ...mutation,
    uploadAvatar: (id: string, file: File) => mutation.mutateAsync({ id, file }),
    error: parseError(mutation.error),
  };
}
