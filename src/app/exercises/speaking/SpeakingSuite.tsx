import { memo } from "react";
import type { Action } from "../../types";
import { PrimaryButton } from "../../shared/PrimaryButton";

import { Trophy } from "lucide-react";

interface Props {
  dispatch: React.Dispatch<Action>;
}

// Echo Practice lives in its own module: it is the only screen here with real
// speech recognition, and pulling it out keeps that machinery off the others.
export { ExSpeakingEchoPractice } from "./EchoPractice";

// 8. Speaking Results
export const ExSpeakingResults = memo(function ExSpeakingResults({ dispatch }: Props) {
  return (
    <div className="min-h-svh bg-secondary flex flex-col items-center justify-center p-6 text-center">
      <div className="size-24 rounded-3xl bg-wp-green-light border border-wp-green/30 flex items-center justify-center shadow-2xl mb-4">
        <Trophy className="size-12 text-wp-green" />
      </div>
      <h1 className="font-sans font-black text-foreground text-3xl">Speaking Session Complete!</h1>
      <p className="font-sans text-muted-foreground text-sm mt-1 max-w-md">
        Speaking practice is self-assessed, so nothing here is scored. Keep echoing the model daily — that repetition
        is what moves pronunciation.
      </p>
      <PrimaryButton label="Return to Explore Worlds" onClick={() => dispatch({ type: "GO", to: "explore" })} />
    </div>
  );
});
