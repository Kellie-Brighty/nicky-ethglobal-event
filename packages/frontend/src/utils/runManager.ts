import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";
import { tools } from "../tools/allTools";

interface ToolOutput {
  tool_call_id: string;
  output: string;
}

interface HealthTipResponse {
  tip: string;
  imageUrl: string;
}

export async function createAndManageRun(
  client: OpenAI,
  thread: Thread,
  assistantId: string
): Promise<string | HealthTipResponse> {
  const run = await createRun(client, thread, assistantId);
  const result = await performRun(client, thread, run);

  if (result.type === "text") {
    try {
      // Try to parse as health tip response
      const parsed = JSON.parse(result.text.value);
      if ("tip" in parsed && "imageUrl" in parsed) {
        return parsed as HealthTipResponse;
      }
    } catch (e) {
      // If parsing fails, return as regular string
    }
    return result.text.value;
  }

  return "No response from assistant";
}

async function createRun(
  client: OpenAI,
  thread: Thread,
  assistantId: string
): Promise<Run> {
  let run = await client.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
  });

  while (run.status === "in_progress" || run.status === "queued") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    run = await client.beta.threads.runs.retrieve(thread.id, run.id);
  }

  return run;
}

async function performRun(client: OpenAI, thread: Thread, run: Run) {
  while (run.status === "requires_action") {
    run = await handleRunToolCall(client, thread, run);
  }

  if (run.status === "failed") {
    const errorMessage = `Error: ${run.last_error?.message || "Unknown error"}`;
    console.error("Run failed:", run.last_error);
    return { type: "text", text: { value: errorMessage, annotations: [] } };
  }

  const messages = await client.beta.threads.messages.list(thread.id);
  const lastMessage = messages.data.find(
    (message) => message.role === "assistant"
  );

  const content = lastMessage?.content[0];
  if (!content || content.type !== "text") {
    return {
      type: "text",
      text: { value: "No response from assistant", annotations: [] },
    };
  }

  return content;
}

async function handleRunToolCall(
  client: OpenAI,
  thread: Thread,
  run: Run
): Promise<Run> {
  const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls;
  if (!toolCalls) return run;

  const toolOutputs = await Promise.all(
    toolCalls.map(async (tool) => {
      const toolConfig = tools[tool.function.name];
      if (!toolConfig) {
        console.error(`Tool ${tool.function.name} not found`);
        return null;
      }

      try {
        const args = JSON.parse(tool.function.arguments);
        const output = await toolConfig.handler(args);
        console.log("Tool output:", output);
        return {
          tool_call_id: tool.id,
          output:
            typeof output === "object"
              ? JSON.stringify(output)
              : String(output),
        };
      } catch (error) {
        return {
          tool_call_id: tool.id,
          output: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        };
      }
    })
  );

  const validOutputs = toolOutputs.filter(
    (output): output is ToolOutput => output !== null
  );

  if (validOutputs.length === 0) return run;

  return client.beta.threads.runs.submitToolOutputsAndPoll(thread.id, run.id, {
    tool_outputs: validOutputs,
  });
}
