import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "../../i18n";

export function DiscussionPromptSelect({
  prompts,
  selectedIndex,
  onSelect,
}: {
  prompts: readonly { id: string | number; prompt: string }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const { t } = useI18n();
  const id = useId();
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="block text-base font-bold text-foreground">
        {t("conversation.chooseSpeakingPrompt")}
      </label>
      <div className="relative">
        <select
          id={id}
          value={selectedIndex}
          onChange={(event) => onSelect(Number(event.target.value))}
          className="min-h-[44px] w-full min-w-0 appearance-none rounded-xl border border-border bg-wp-card ps-3.5 pe-10 py-2.5 text-base font-semibold text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary hover:border-primary/50 shadow-wp-xs transition-colors cursor-pointer"
        >
          {prompts.map((prompt, index) => (
            <option key={prompt.id} value={index} className="bg-wp-card text-foreground">
              {index + 1}. {prompt.prompt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
