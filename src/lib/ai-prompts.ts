import type { CvContent, CvLanguage, UniversityTemplate } from '@/types/cv';

export type AiAction = 'rewrite_bullet' | 'review_section' | 'review_cv';

export interface AiPromptInput {
  action: AiAction;
  template: UniversityTemplate;
  language: CvLanguage;
  content?: CvContent;
  sectionId?: string;
  targetText?: string;
}

export function buildAiPrompt(input: AiPromptInput): {
  systemInstruction: string;
  userPrompt: string;
} {
  const { action, template, language, content, sectionId, targetText } = input;
  const verbs = language === 'vi' ? template.actionVerbs.vi : template.actionVerbs.en;
  const langDirective =
    language === 'vi'
      ? 'Respond strictly in natural, professional Vietnamese (tiếng Việt). Use strong Vietnamese action verbs and clear quantified impact.'
      : 'Respond strictly in crisp, professional English matching top university career center standards.';

  const systemInstruction = [
    `You are an elite career advisor trained on the CV/resume guidelines of ${template.universityName} (${template.officeOrProgram}).`,
    `Target field: ${template.field}. Format: ${template.format}.`,
    `Mandatory style rules from ${template.universityName}:`,
    ...template.styleRules.map((rule, idx) => `${idx + 1}. ${rule}`),
    `Preferred action verbs: ${verbs.join(', ')}.`,
    langDirective,
    'Always return valid JSON only, with no markdown code fences.',
  ].join('\n');

  if (action === 'rewrite_bullet') {
    const userPrompt = [
      'Rewrite the following CV bullet point into 3 stronger, concise options applying the university style rules (Action Verb + Context + Quantified Impact). If metrics are missing, use clear placeholders like [X%] or [N users] so the user can fill them in.',
      `Original bullet: "${targetText ?? ''}"`,
      'Return JSON with exact shape: { "suggestions": string[], "explanation": string }',
    ].join('\n');
    return { systemInstruction, userPrompt };
  }

  if (action === 'review_section') {
    const targetSection = content?.sections.find((s) => s.id === sectionId);
    const userPrompt = [
      `Review this CV section against ${template.universityName} standards:`,
      JSON.stringify(targetSection ?? { note: 'Section not specified' }, null, 2),
      'Return JSON with exact shape: { "score": number (1-10), "strengths": string[], "improvements": string[], "rewrittenExamples": string[] }',
    ].join('\n');
    return { systemInstruction, userPrompt };
  }

  const sanitizedContent = content
    ? {
        ...content,
        personalInfo: {
          fullName: content.personalInfo.fullName,
          headline: content.personalInfo.headline,
          email: content.personalInfo.email,
          phone: content.personalInfo.phone,
          location: content.personalInfo.location,
          links: content.personalInfo.links,
          hasPhoto: Boolean(content.personalInfo.photoDataUrl),
        },
      }
    : {};

  const userPrompt = [
    `Review this complete CV against ${template.universityName} standards (structure, clarity, ATS readiness, action verbs, quantification, length):`,
    JSON.stringify(sanitizedContent, null, 2),
    'Return JSON with exact shape: { "score": number (1-10), "summary": string, "strengths": string[], "improvements": string[] }',
  ].join('\n');
  return { systemInstruction, userPrompt };
}
