import type { Dispatch, SetStateAction } from 'react';
import type { WizardDraft } from './Step1BasicData';
import { MarkdownView } from '@/components/lottery/MarkdownView';

interface Step3Props {
  draft: WizardDraft;
  setDraft: Dispatch<SetStateAction<WizardDraft>>;
}

const MarkdownField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}): JSX.Element => (
  <section>
    <h3 className="font-display text-lg text-fortuno-gold-intense">{label}</h3>
    <div className="mt-3 grid gap-4 md:grid-cols-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] rounded-md border border-fortuno-black/20 p-3 font-mono text-sm"
        placeholder="Edite em Markdown..."
      />
      <div className="rounded-md border border-fortuno-black/10 bg-white p-4">
        <MarkdownView content={value || '_Pré-visualização aparecerá aqui._'} />
      </div>
    </div>
  </section>
);

export const Step3Descriptions = ({ draft, setDraft }: Step3Props): JSX.Element => (
  <div className="space-y-8">
    <MarkdownField
      label="Descrição principal"
      value={draft.descriptionMd}
      onChange={(v) => setDraft((prev) => ({ ...prev, descriptionMd: v }))}
    />
    <MarkdownField
      label="Regras"
      value={draft.rulesMd}
      onChange={(v) => setDraft((prev) => ({ ...prev, rulesMd: v }))}
    />
    <MarkdownField
      label="Política de Privacidade"
      value={draft.privacyPolicyMd}
      onChange={(v) => setDraft((prev) => ({ ...prev, privacyPolicyMd: v }))}
    />
  </div>
);
