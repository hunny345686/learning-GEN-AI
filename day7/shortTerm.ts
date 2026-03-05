type msgType = {
  role: "user" | "assistant" | "system";
  content: string;
};
export class shortTermMemory {
  private msg: msgType[] = [];

  addMsg(role: msgType["role"], content: string) {
    this.msg.push({ role, content });
  }
  getMsg() {
    return this.msg;
  }
  clear() {
    this.msg = [];
  }
  trim(limit: number = 10) {
    this.msg = this.msg.slice(-limit);
  }
}
