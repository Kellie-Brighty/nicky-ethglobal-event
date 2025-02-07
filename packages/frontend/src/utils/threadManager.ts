import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads";

const THREAD_ID_KEY = "foodie_thread_id";

export const ThreadManager = {
  getCurrentThreadId: (): string | null => {
    return localStorage.getItem(THREAD_ID_KEY);
  },

  setCurrentThreadId: (threadId: string): void => {
    localStorage.setItem(THREAD_ID_KEY, threadId);
  },

  clearCurrentThread: (): void => {
    localStorage.removeItem(THREAD_ID_KEY);
  },

  waitForResponse: async (client: any, threadId: string, runId: string) => {
    let run = await client.beta.threads.runs.retrieve(threadId, runId);
    while (run.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      run = await client.beta.threads.runs.retrieve(threadId, runId);
    }
    const messages = await client.beta.threads.messages.list(threadId);
    return messages.data[0].content[0].text.value;
  },
};

export async function getOrCreateThread(
  client: OpenAI,
  message: string
): Promise<Thread> {
  const existingThreadId = ThreadManager.getCurrentThreadId();
  let thread: Thread;

  if (existingThreadId) {
    try {
      thread = await client.beta.threads.retrieve(existingThreadId);
      await client.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
      });
    } catch (error) {
      // If thread retrieval fails, create a new one
      thread = await createNewThread(client, message);
    }
  } else {
    thread = await createNewThread(client, message);
  }

  return thread;
}

async function createNewThread(
  client: OpenAI,
  message: string
): Promise<Thread> {
  const thread = await client.beta.threads.create();
  await client.beta.threads.messages.create(thread.id, {
    role: "user",
    content: message,
  });
  ThreadManager.setCurrentThreadId(thread.id);
  return thread;
}
