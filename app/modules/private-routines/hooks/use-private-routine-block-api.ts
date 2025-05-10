import { useMutation, useQuery } from "@tanstack/react-query";
import privateRoutineBlockApi from "../api/private-routine-block-api";
import { UpdateBlockStatusRequest } from "../api/private-routine-block-api";

export default function usePrivateRoutineBlockApi() {
  const updateStatusMutation = useMutation({
    mutationFn: (request: UpdateBlockStatusRequest) => privateRoutineBlockApi.updateBlockStatus(request),
  });

  return { updateStatusMutation };
};

