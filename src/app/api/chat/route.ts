import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { schools } from "@/data/schools";
import { metrics } from "@/data/metrics";
import { surveys } from "@/data/surveys";
import type { ChartConfig } from "@/lib/types";

interface ChatRequestBody {
  question: string;
  role: string;
  schoolId: string | null;
}

interface FallbackResponse {
  text: string;
  chartConfig: ChartConfig | null;
}

function getLatestMetrics() {
  return metrics.filter((m) => m.year === 2026);
}

function matchFallback(question: string): FallbackResponse {
  const q = question.toLowerCase();

  // 1. Admissions yield
  if (q.includes("yield") || q.includes("admissions yield") || (q.includes("admissions") && q.includes("compare"))) {
    const latest = getLatestMetrics();
    const yieldData = schools.map((s) => {
      const m = latest.find((x) => x.schoolId === s.id);
      const yieldRate = m && m.acceptances > 0 ? Math.round((m.enrolledNew / m.acceptances) * 1000) / 10 : 0;
      return { school: s.name.split(" ").slice(0, 2).join(" "), yield: yieldRate };
    }).sort((a, b) => b.yield - a.yield);

    return {
      text: `Admissions yield rates vary significantly across the network. ${yieldData[0].school} leads with a ${yieldData[0].yield}% yield, while the network average is ${Math.round(yieldData.reduce((sum, d) => sum + d.yield, 0) / yieldData.length * 10) / 10}%. Smaller schools tend to have higher yields due to more personalized recruitment processes and stronger community engagement.`,
      chartConfig: {
        type: "bar",
        title: "Admissions Yield Rate by School (2026)",
        data: yieldData,
        xKey: "school",
        yKey: "yield",
        colors: ["#1E40AF"],
      },
    };
  }

  // 2. Retention rates
  if (q.includes("retention") || q.includes("highest retention")) {
    const latest = getLatestMetrics();
    const retentionData = schools
      .map((s) => {
        const m = latest.find((x) => x.schoolId === s.id);
        return { school: s.name.split(" ").slice(0, 2).join(" "), retention: m?.retentionRate ?? 0 };
      })
      .sort((a, b) => b.retention - a.retention);

    return {
      text: `${retentionData[0].school} leads the network with a ${retentionData[0].retention}% retention rate, followed by ${retentionData[1].school} at ${retentionData[1].retention}%. Instituto Bolivariano has the lowest retention at ${retentionData[retentionData.length - 1].retention}%, reflecting ongoing challenges in Venezuela. The network-wide average is ${Math.round(retentionData.reduce((sum, d) => sum + d.retention, 0) / retentionData.length * 10) / 10}%.`,
      chartConfig: {
        type: "horizontal_bar",
        title: "Student Retention Rates by School (2026)",
        data: retentionData,
        xKey: "retention",
        yKey: "school",
        colors: ["#059669"],
      },
    };
  }

  // 3. Student-teacher ratio / tuition above
  if (q.includes("student-teacher") || q.includes("student teacher") || (q.includes("tuition") && q.includes("above"))) {
    const latest = getLatestMetrics();
    const highTuitionSchools = schools.filter((s) => s.tuitionHigh > 15000);
    const ratioData = highTuitionSchools.map((s) => {
      const m = latest.find((x) => x.schoolId === s.id);
      return {
        school: s.name.split(" ").slice(0, 2).join(" "),
        ratio: m?.studentTeacherRatio ?? 0,
        tuition: s.tuitionHigh,
      };
    }).sort((a, b) => a.ratio - b.ratio);

    const avgRatio = Math.round(ratioData.reduce((sum, d) => sum + d.ratio, 0) / ratioData.length * 10) / 10;

    return {
      text: `Among schools with tuition above $15,000, the average student-teacher ratio is ${avgRatio}:1. ${ratioData[0].school} has the lowest ratio at ${ratioData[0].ratio}:1, providing the most individualized attention. Higher-tuition schools generally invest more in faculty, resulting in smaller class sizes that support differentiated instruction.`,
      chartConfig: {
        type: "bar",
        title: "Student-Teacher Ratio (Schools with Tuition > $15K)",
        data: ratioData,
        xKey: "school",
        yKey: "ratio",
        colors: ["#D97706"],
      },
    };
  }

  // 4. Enrollment trends / South American
  if (q.includes("enrollment trend") || q.includes("south american") || q.includes("south america")) {
    const saSchools = schools.filter((s) => s.region === "South America");
    const years = [2022, 2023, 2024, 2025, 2026];
    const trendData = years.map((year) => {
      const row: Record<string, unknown> = { year: year.toString() };
      saSchools.forEach((s) => {
        const m = metrics.find((x) => x.schoolId === s.id && x.year === year);
        const shortName = s.name.split(" ").slice(0, 2).join(" ");
        row[shortName] = m?.enrollment ?? 0;
      });
      return row;
    });

    const seriesKeys = saSchools.map((s) => s.name.split(" ").slice(0, 2).join(" "));

    return {
      text: `Enrollment trends across South American schools show generally positive momentum. Academia Americana continues to grow steadily, reaching 2,217 students in 2026. Instituto Bolivariano, however, has seen a consistent decline from 243 to 183 students over five years due to the ongoing situation in Venezuela. The remaining South American schools show stable or slight growth patterns.`,
      chartConfig: {
        type: "line",
        title: "Enrollment Trends - South American Schools (2022-2026)",
        data: trendData,
        xKey: "year",
        yKey: seriesKeys,
        colors: ["#1E40AF", "#D97706", "#059669", "#DC2626", "#7C3AED", "#0891B2"],
      },
    };
  }

  // 5. Survey completion
  if (q.includes("survey") || q.includes("completion") || q.includes("lowest survey")) {
    const distributedSurveys = surveys.filter((s) => s.status === "distributed");
    const completionBySchool = schools.map((s) => {
      let completed = 0;
      let total = 0;
      distributedSurveys.forEach((survey) => {
        const comp = survey.completions.find((c) => c.schoolId === s.id);
        if (comp) {
          total++;
          if (comp.completed) completed++;
        }
      });
      return {
        school: s.name.split(" ").slice(0, 2).join(" "),
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    }).sort((a, b) => a.completionRate - b.completionRate);

    return {
      text: `Survey completion rates vary across the network. ${completionBySchool[completionBySchool.length - 1].school} and ${completionBySchool[completionBySchool.length - 2].school} lead with ${completionBySchool[completionBySchool.length - 1].completionRate}% completion of distributed surveys. Several schools, including ${completionBySchool[0].school} and ${completionBySchool[1].school}, have not completed any distributed surveys yet. Improving follow-up processes could help close these gaps.`,
      chartConfig: {
        type: "bar",
        title: "Survey Completion Rate by School",
        data: completionBySchool,
        xKey: "school",
        yKey: "completionRate",
        colors: ["#7C3AED"],
      },
    };
  }

  // 6. Faculty turnover / large vs small
  if (q.includes("faculty turnover") || q.includes("turnover") || (q.includes("large") && q.includes("small"))) {
    const latest = getLatestMetrics();
    const largeSchools = schools.filter((s) => s.sizeCategory === "large");
    const smallSchools = schools.filter((s) => s.sizeCategory === "small");

    const avgTurnover = (group: typeof schools) => {
      const rates = group.map((s) => {
        const m = latest.find((x) => x.schoolId === s.id);
        return m?.facultyTurnoverRate ?? 0;
      });
      return Math.round((rates.reduce((sum, r) => sum + r, 0) / rates.length) * 10) / 10;
    };

    const largeAvg = avgTurnover(largeSchools);
    const smallAvg = avgTurnover(smallSchools);

    const groupData = [
      ...largeSchools.map((s) => {
        const m = latest.find((x) => x.schoolId === s.id);
        return { school: s.name.split(" ").slice(0, 2).join(" "), turnover: m?.facultyTurnoverRate ?? 0, group: "Large" };
      }),
      ...smallSchools.map((s) => {
        const m = latest.find((x) => x.schoolId === s.id);
        return { school: s.name.split(" ").slice(0, 2).join(" "), turnover: m?.facultyTurnoverRate ?? 0, group: "Small" };
      }),
    ];

    return {
      text: `Large schools average ${largeAvg}% faculty turnover compared to ${smallAvg}% for small schools. Instituto Bolivariano is an outlier at 17.6% turnover, driven by the challenging operating environment in Venezuela. Among large schools, Academia Americana has the lowest turnover at 8.9%, reflecting strong faculty retention strategies and competitive compensation.`,
      chartConfig: {
        type: "bar",
        title: "Faculty Turnover Rate: Large vs Small Schools (2026)",
        data: groupData,
        xKey: "school",
        yKey: "turnover",
        colors: ["#1E40AF", "#DC2626"],
      },
    };
  }

  // Default fallback
  const latest = getLatestMetrics();
  const enrollmentData = schools.map((s) => {
    const m = latest.find((x) => x.schoolId === s.id);
    return { school: s.name.split(" ").slice(0, 2).join(" "), enrollment: m?.enrollment ?? s.enrollment };
  }).sort((a, b) => b.enrollment - a.enrollment);

  return {
    text: `Here is an overview of current enrollment across the AMISA network. The 12 member schools range from ${enrollmentData[enrollmentData.length - 1].enrollment} to ${enrollmentData[0].enrollment} students, representing a diverse mix of school sizes across the Americas. Let me know if you would like me to analyze a specific aspect of the data in more detail.`,
    chartConfig: {
      type: "bar",
      title: "Current Enrollment by School (2026)",
      data: enrollmentData,
      xKey: "school",
      yKey: "enrollment",
      colors: ["#1E40AF"],
    },
  };
}

function buildSystemPrompt(role: string, schoolId: string | null): string {
  const schoolSummaries = schools.map((s) => {
    const latest = metrics.find((m) => m.schoolId === s.id && m.year === 2026);
    return `- ${s.name} (${s.city}, ${s.country}): ${s.enrollment} students, ${s.sizeCategory} school, ${s.curriculum} curriculum, tuition $${s.tuitionLow.toLocaleString()}-$${s.tuitionHigh.toLocaleString()}, retention ${latest?.retentionRate ?? "N/A"}%, student-teacher ratio ${latest?.studentTeacherRatio ?? "N/A"}:1, faculty turnover ${latest?.facultyTurnoverRate ?? "N/A"}%`;
  }).join("\n");

  const surveyInfo = surveys.map((s) => {
    return `- "${s.title}" (${s.status}): ${s.completedSchools}/${s.totalSchools} schools completed`;
  }).join("\n");

  let roleContext = "";
  if (role === "network_admin") {
    roleContext = "The user is a Network Administrator with full access to all school data across the AMISA network.";
  } else if (role === "school_admin") {
    const school = schools.find((s) => s.id === schoolId);
    roleContext = `The user is a School Administrator at ${school?.name ?? "their school"}. They can see their own school's full data and anonymized aggregate data for peer comparisons. Do not reveal specific data from other individual schools by name -- use anonymized labels like "Peer School A" for comparisons.`;
  } else {
    const school = schools.find((s) => s.id === schoolId);
    roleContext = `The user is a School User at ${school?.name ?? "their school"}. They can only see their own school's admissions and enrollment data. Do not share data from other schools.`;
  }

  return `You are an AI analytics assistant for the AMISA (Association of American Schools in the Americas) data system. You help school administrators analyze enrollment, admissions, faculty, financial, and survey data across a network of 12 American international schools in Latin America and the Caribbean.

${roleContext}

Available school data (2026):
${schoolSummaries}

Survey status:
${surveyInfo}

Historical metrics are available from 2022-2026 for all schools, including: enrollment, applications, acceptances, enrolled new students, retention rate, student-teacher ratio, faculty count, faculty turnover rate, tuition ranges, operating budget, financial aid percent, and faculty nationality breakdown (host country, US, third country).

IMPORTANT: You must respond with valid JSON in this exact format:
{
  "text": "Your conversational response here (2-3 sentences, be specific with numbers)",
  "chartConfig": {
    "type": "bar|line|pie|horizontal_bar",
    "title": "Chart Title",
    "data": [{"key": "value", ...}],
    "xKey": "keyForXAxis",
    "yKey": "keyForYAxis" or ["key1", "key2"] for multiple series
  }
}

If no chart is appropriate, set chartConfig to null.

Use short school names (first 2 words) in chart data to keep labels readable. Always include specific numbers in your text response. Be conversational but data-driven.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { question, role, schoolId } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return fallback response
      const fallback = matchFallback(question);
      return NextResponse.json({
        text: fallback.text,
        chartConfig: fallback.chartConfig,
      });
    }

    // Call Anthropic API
    const client = new Anthropic({ apiKey });
    const systemPrompt = buildSystemPrompt(role, schoolId);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    // Extract text content
    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from API");
    }

    // Parse JSON response
    const responseText = textBlock.text;
    // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If no JSON found, return the text as-is with no chart
      return NextResponse.json({
        text: responseText,
        chartConfig: null,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      text: parsed.text ?? responseText,
      chartConfig: parsed.chartConfig ?? null,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    // On any error, fall back to keyword matching
    try {
      const body = await request.clone().json();
      const fallback = matchFallback(body.question ?? "");
      return NextResponse.json({
        text: fallback.text,
        chartConfig: fallback.chartConfig,
      });
    } catch {
      return NextResponse.json(
        {
          text: "I encountered an issue processing your question. Please try rephrasing your query or ask about enrollment, admissions, retention, faculty, or survey data.",
          chartConfig: null,
        },
        { status: 200 }
      );
    }
  }
}
