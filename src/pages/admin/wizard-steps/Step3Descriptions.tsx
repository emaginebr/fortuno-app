import { useState, type Dispatch, type SetStateAction } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import type { WizardDraft } from './Step1BasicData';

interface Step3Props {
  draft: WizardDraft;
  setDraft: Dispatch<SetStateAction<WizardDraft>>;
}

type TabKey = 'description' | 'rules' | 'privacy';

interface TabDefinition {
  key: TabKey;
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export const Step3Descriptions = ({ draft, setDraft }: Step3Props): JSX.Element => {
  const [activeTab, setActiveTab] = useState<TabKey>('description');

  const tabs: TabDefinition[] = [
    {
      key: 'description',
      label: 'Descrição Principal',
      value: draft.descriptionMd,
      onChange: (v) => setDraft((prev) => ({ ...prev, descriptionMd: v })),
    },
    {
      key: 'rules',
      label: 'Regras',
      value: draft.rulesMd,
      onChange: (v) => setDraft((prev) => ({ ...prev, rulesMd: v })),
    },
    {
      key: 'privacy',
      label: 'Política de Privacidade',
      value: draft.privacyPolicyMd,
      onChange: (v) => setDraft((prev) => ({ ...prev, privacyPolicyMd: v })),
    },
  ];

  return (
    <div className="space-y-6" data-color-mode="dark">
      <div
        role="tablist"
        aria-label="Seções de descrição"
        className="flex flex-wrap gap-1 border-b border-fortuno-offwhite/10"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`step3-tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`step3-panel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-3 font-display text-sm tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fortuno-gold-soft ${
                isActive
                  ? 'text-fortuno-gold-intense'
                  : 'text-fortuno-offwhite/60 hover:text-fortuno-gold-soft'
              }`}
            >
              {tab.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-fortuno-gold-intense"
                />
              )}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <div
            key={tab.key}
            role="tabpanel"
            id={`step3-panel-${tab.key}`}
            aria-labelledby={`step3-tab-${tab.key}`}
            hidden={!isActive}
          >
            {isActive && (
              <MDEditor
                value={tab.value}
                onChange={(v) => tab.onChange(v ?? '')}
                preview="edit"
                height={400}
                visibleDragbar={false}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
