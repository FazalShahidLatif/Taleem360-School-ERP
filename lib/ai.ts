// Simulates ai/prompt_templates.py and ai/generator.py

interface PromptContext {
  [key: string]: any;
}

const PROMPTS = {
  attendance_alert: (ctx: PromptContext) => 
    `Subject: Attendance Alert for ${ctx.student_name}\n\n` +
    `Dear Parent,\n\n` +
    `This is a polite message from ${ctx.school_name}. ` +
    `We noticed that ${ctx.student_name} was marked ${ctx.status} today (${ctx.date}). ` +
    `Please ensure they catch up on any missed work.\n\n` +
    `Regards,\n${ctx.school_name} Administration`,

  class_summary: (ctx: PromptContext) => 
    `### AI Analysis for ${ctx.class_name}\n\n` +
    `**Overview:**\n` +
    `The class has an average attendance of **${ctx.average_attendance}%** over the recorded period. ` +
    `Active student count: ${ctx.total_students}.\n\n` +
    `**Key Insights:**\n` +
    `- ${ctx.risk_count > 0 ? `⚠️ **Attention Needed:** ${ctx.risk_count} student(s) have falling attendance rates (<75%).` : `✅ **Great Job:** Most students are maintaining good attendance.`}\n` +
    `- ${ctx.average_attendance > 90 ? "Class engagement is high." : "Class engagement shows room for improvement."}\n\n` +
    `**AI Recommendations:**\n` +
    `1. ${ctx.risk_count > 0 ? "Schedule brief 1-on-1 check-ins with at-risk students." : "Continue current engagement strategies."}\n` +
    `2. ${ctx.average_attendance < 85 ? "Consider sending a positive reinforcement message to the whole class group." : "Plan a reward activity for consistent attendance."}\n` +
    `3. ${ctx.risk_count > 2 ? "Review the curriculum pace; multiple students falling behind might indicate content difficulty." : "Monitor the upcoming exam results to correlate with attendance patterns."}`,
    
  payment_receipt: (ctx: PromptContext) =>
    `Subject: Payment Receipt - ${ctx.transaction_id}\n\n` +
    `Dear Parent,\n\n` +
    `We have successfully received a payment of **$${ctx.amount}** for **${ctx.fee_name}** regarding student **${ctx.student_name}**.\n` +
    `Date: ${ctx.date}\n` +
    `Payment Method: ${ctx.method}\n\n` +
    `Thank you for your prompt payment.\n` +
    `Regards,\n${ctx.school_name} Finance Dept.`
};

export const ai = {
  /**
   * Simulates calling OpenAI to generate a message based on a template.
   */
  generateMessage: async (templateKey: keyof typeof PROMPTS, context: PromptContext): Promise<string> => {
    // Simulate network latency for AI processing
    await new Promise(res => setTimeout(res, 800));
    
    const template = PROMPTS[templateKey];
    if (!template) {
      throw new Error(`Prompt template '${templateKey}' not found.`);
    }

    // In a real app, 'context' would be passed to the LLM system prompt
    return template(context);
  },

  /**
   * Specific helper to analyze class data and return an "AI" insight
   */
  generateClassInsight: async (data: {
    className: string;
    totalStudents: number;
    averageAttendance: number;
    atRiskCount: number;
    schoolName: string;
  }) => {
    return ai.generateMessage('class_summary', {
      class_name: data.className,
      total_students: data.totalStudents,
      average_attendance: data.averageAttendance.toFixed(1),
      risk_count: data.atRiskCount,
      school_name: data.schoolName
    });
  }
};