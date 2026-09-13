
/**
 * API Client for connecting Frontend to Agent 65 FastAPI Backend.
 * Uses NEXT_PUBLIC_BACKEND_URL or defaults to http://localhost:8000/api/v1
 */

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";


export interface BackendTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  student_id: string;
  roll_no: string;
  full_name: string;
  programme_code: string;
}

export interface ProfileResponse {
  roll_no: string;
  cgpa?: number;
  fee_outstanding?: number;
  overall_attendance_pct?: number;
}

export interface DashboardResponse {
  profile?: ProfileResponse;
  timetable?: Array<{
    day_of_week: string;
    time_slot?: string;
    course_title: string;
    course_code: string;
    room_no: string;
    faculty_name: string;
    slot_type?: string;
  }>;
}

export interface BackendMessageResponse {
  message_id: string;
  conversation_id: string;
  sender_role: string;
  content: string;
  category?: string;
  source_agent?: string;
  citations: Array<{
    title: string;
    clause: string;
    effective_date: string;
    summary?: string;
  }>;
  structured_card?: unknown;
  is_distress: boolean;
  suggested_follow_ups?: string[];
  created_at: string;
}

class Agent65ApiClient {
  private token: string | null = null;
  private activeConversationId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("agent65_token");
      this.activeConversationId = localStorage.getItem("agent65_conv_id");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("agent65_token", token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("agent65_token");
    }
    return this.token;
  }

  async login(username: string = "251FA04E03", password: string = "251FA04E03"): Promise<BackendTokenResponse | null> {
    try {
      const resp = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      this.setToken(data.access_token);
      return data;
    } catch (e) {
      console.warn("Backend unavailable during login, falling back to local mode:", e);
      return null;
    }
  }

  async ensureAuthenticated(): Promise<string | null> {
    let token = this.getToken();
    if (!token) {
      const savedRoll = typeof window !== "undefined" ? localStorage.getItem("agent65_active_student") : null;
      const rollToUse = savedRoll || "251FA04E03";
      const loginData = await this.login(rollToUse, rollToUse);
      if (loginData) {
        token = loginData.access_token;
      }
    }
    return token;
  }

  async getProfile(): Promise<ProfileResponse | null> {
    const token = await this.ensureAuthenticated();
    if (!token) return null;
    try {
      const resp = await fetch(`${BACKEND_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch {
      return null;
    }
  }

  async getDashboard(): Promise<DashboardResponse | null> {
    const token = await this.ensureAuthenticated();
    if (!token) return null;
    try {
      const resp = await fetch(`${BACKEND_BASE_URL}/student/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch {
      return null;
    }
  }

  async getOrCreateConversation(forceNew: boolean = false): Promise<string> {
    if (!forceNew && this.activeConversationId) return this.activeConversationId;

    const token = await this.ensureAuthenticated();
    if (token) {
      try {
        const resp = await fetch(`${BACKEND_BASE_URL}/conversations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: "Helpdesk Session" }),
        });
        if (resp.ok) {
          const conv = await resp.json();
          this.activeConversationId = conv.conversation_id;
          if (typeof window !== "undefined") {
            localStorage.setItem("agent65_conv_id", conv.conversation_id);
          }
          return conv.conversation_id;
        }
      } catch (e) {
        console.warn("Could not create conversation on backend:", e);
      }
    }
    return "local-conversation-session";
  }

  async sendMessage(
    content: string,
    language: string = "en"
  ): Promise<BackendMessageResponse | null> {
    let token = await this.ensureAuthenticated();
    let convId = await this.getOrCreateConversation();

    if (!token || convId === "local-conversation-session") {
      const savedRoll = typeof window !== "undefined" ? localStorage.getItem("agent65_active_student") : null;
      const rollToUse = savedRoll || "251FA04E03";
      token = await this.login(rollToUse, rollToUse).then((t) => t?.access_token || null);
      convId = await this.getOrCreateConversation(true);
      if (!token || convId === "local-conversation-session") {
        return null;
      }
    }

    try {
      let resp = await fetch(
        `${BACKEND_BASE_URL}/conversations/${convId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, language }),
        }
      );

      // Self-healing: if session or conversation expired/reset on backend (404/401)
      if (resp.status === 404 || resp.status === 401) {
        console.info("[Agent65] Stale conversation or token detected, auto-healing with fresh session...");
        this.activeConversationId = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("agent65_conv_id");
          if (resp.status === 401) localStorage.removeItem("agent65_token");
        }
        token = await this.ensureAuthenticated();
        convId = await this.getOrCreateConversation(true);

        resp = await fetch(
          `${BACKEND_BASE_URL}/conversations/${convId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content, language }),
          }
        );
      }

      if (!resp.ok) {
        console.warn(`[Agent65] Backend returned HTTP ${resp.status}`);
        return null;
      }
      return await resp.json();
    } catch (e) {
      console.warn("[Agent65] Backend call failed:", e);
      return null;
    }
  }

  async createServiceRequest(category: string, title: string, description: string): Promise<unknown | null> {
    const token = await this.ensureAuthenticated();
    if (!token) return null;
    try {
      const resp = await fetch(`${BACKEND_BASE_URL}/service-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, title, description }),
      });
      if (resp.ok) return await resp.json();
    } catch (e) {
      console.warn("Could not post service request to backend:", e);
    }
    return null;
  }

  async sendFeedback(
    conversationId: string | null | undefined,
    messageId: string | null | undefined,
    rating: "up" | "down",
    comment?: string,
    messagesContext?: Array<{ role: string; content: string }>,
    responseText?: string
  ): Promise<{ status: string; saved_for_training: boolean; rating: string; message: string } | null> {
    const token = await this.ensureAuthenticated();
    if (!token) return null;
    try {
      const convId = conversationId || this.activeConversationId || "local-conversation-session";
      const msgId = messageId || `msg-${Date.now()}`;
      const resp = await fetch(
        `${BACKEND_BASE_URL}/conversations/${convId}/messages/${msgId}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            comment,
            messages: messagesContext,
            response_text: responseText,
          }),
        }
      );
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn("[Agent65] Feedback submission failed:", e);
    }
    return null;
  }
}

export const apiClient = new Agent65ApiClient();
