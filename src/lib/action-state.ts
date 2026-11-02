export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: Record<string, string>;
};

export const IDLE_STATE: ActionState = { status: "idle", message: "", errors: {} };

export function success(message: string): ActionState {
  return { status: "success", message, errors: {} };
}

export function failure(message: string, errors: Record<string, string> = {}): ActionState {
  return { status: "error", message, errors };
}
