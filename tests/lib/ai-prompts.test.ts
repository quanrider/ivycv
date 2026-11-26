import { describe, it, expect } from 'vitest';
import { buildAiPrompt } from '@/lib/ai-prompts';
import { getUniversityById } from '@/data/universities';

describe('buildAiPrompt', () => {
  it('injects Vietnamese action verbs and Vietnamese output instruction when language is vi', () => {
    const harvard = getUniversityById('harvard-ocs')!;
    const { systemInstruction, userPrompt } = buildAiPrompt({
      action: 'rewrite_bullet',
      template: harvard,
      language: 'vi',
      targetText: 'Làm báo cáo doanh thu hàng tuần bằng Excel',
    });

    expect(systemInstruction).toContain('Harvard University');
    expect(systemInstruction).toContain(harvard.styleRules[0]);
    expect(systemInstruction).toContain(harvard.actionVerbs.vi[0]);
    expect(systemInstruction).toMatch(/tiếng Việt/i);
    expect(userPrompt).toContain('Làm báo cáo doanh thu hàng tuần bằng Excel');
  });

  it('injects English action verbs when language is en', () => {
    const mit = getUniversityById('mit-capd')!;
    const { systemInstruction } = buildAiPrompt({
      action: 'rewrite_bullet',
      template: mit,
      language: 'en',
      targetText: 'Worked on backend caching',
    });

    expect(systemInstruction).toContain('Massachusetts Institute of Technology');
    expect(systemInstruction).toContain(mit.actionVerbs.en[0]);
    expect(systemInstruction).toMatch(/English/i);
  });
});
