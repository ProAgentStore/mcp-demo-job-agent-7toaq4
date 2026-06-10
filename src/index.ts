import { Hono } from "hono";

interface Env {
	AI: Ai;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.json({ agent: "mcp-demo-job-agent-7toaq4", status: "ok" }));

app.post("/chat", async (c) => {
	const { message } = await c.req.json<{ message: string }>();
	const result = await c.env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
		messages: [
			{ role: "system", content: "You are MCP Demo Job Agent. A smoke-test agent created through ProAgentStore MCP browser sign-in." },
			{ role: "user", content: message },
		],
	});
	return c.json(result);
});

export class AgentDO {
	constructor(private state: DurableObjectState, private env: Env) {}

	async fetch(request: Request): Promise<Response> {
		return app.fetch(request, this.env);
	}
}

export default app;
