export interface QueueAction {
  id: string;
  type: "trigger_sos" | "log_location" | "resolve_alert";
  payload: Record<string, unknown>;
  tempAlertId?: string;
  createdAt: string;
  retries: number;
}

const KEY = "sos_offline_queue";

function getLS(): any {
  try {
    return typeof globalThis !== "undefined"
      ? (globalThis as any).localStorage
      : null;
  } catch {
    return null;
  }
}

function readQueue(): QueueAction[] {
  const ls = getLS();
  if (!ls) return [];
  try {
    return JSON.parse(ls.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue: QueueAction[]): void {
  const ls = getLS();
  if (!ls) return;
  try {
    ls.setItem(KEY, JSON.stringify(queue));
  } catch {
    // storage full — silently ignore
  }
}

export function getQueueLength(): number {
  return readQueue().length;
}

export function getQueue(): QueueAction[] {
  return readQueue();
}

export function enqueue(
  action: Omit<QueueAction, "id" | "createdAt" | "retries">,
): void {
  const queue = readQueue();
  queue.push({
    ...action,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    retries: 0,
  });
  writeQueue(queue);
}

export function dequeue(id: string): void {
  const queue = readQueue();
  writeQueue(queue.filter((a) => a.id !== id));
}

export function replaceTempId(tempId: string, realId: string): void {
  const queue = readQueue();
  for (const a of queue) {
    if (
      a.type === "log_location" &&
      (a.payload as any).alert_id === tempId
    ) {
      (a.payload as any).alert_id = realId;
    }
    if (
      a.type === "resolve_alert" &&
      (a.payload as any).alertId === tempId
    ) {
      (a.payload as any).alertId = realId;
    }
  }
  writeQueue(queue);
}
