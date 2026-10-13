import { createAssessmentHandler } from "../../../src/features/pronunciation/assessmentServer.ts";

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Promise<Response>): void;
};
const env = (name: string) => Deno.env.get(name) ?? "";
const project = env("SUPABASE_URL");
const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
const region = env("AZURE_SPEECH_REGION");
const speechKey = env("AZURE_SPEECH_KEY");

Deno.serve(
  createAssessmentHandler({
    allowedOrigins: env("PRONUNCIATION_ALLOWED_ORIGINS")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    enabled:
      env("PRONUNCIATION_ASSESSMENT_ENABLED") === "true" &&
      /^[a-z0-9-]+$/.test(region) &&
      Boolean(speechKey && serviceKey),
    verifyUser: async (authorization) => {
      const response = await fetch(`${project}/auth/v1/user`, {
        redirect: "error",
        headers: { Authorization: authorization, apikey: env("SUPABASE_ANON_KEY") },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return null;
      const user = await response.json();
      return typeof user.id === "string" ? user.id : null;
    },
    consumeQuota: async (userId) => {
      const response = await fetch(
        `${project}/rest/v1/rpc/consume_pronunciation_assessment_quota`,
        {
          redirect: "error",
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ learner_id: userId }),
          signal: AbortSignal.timeout(5000),
        }
      );
      if (!response.ok) throw new Error("quota-unavailable");
      const allowed = await response.json();
      if (typeof allowed !== "boolean") throw new Error("quota-unavailable");
      return allowed;
    },
    assess: async (audio, reference, signal) => {
      const parameters = btoa(
        String.fromCharCode(
          ...new TextEncoder().encode(
            JSON.stringify({
              ReferenceText: reference,
              GradingSystem: "HundredMark",
              Granularity: "Phoneme",
              Dimension: "Comprehensive",
              EnableMiscue: true,
            })
          )
        )
      );
      const response = await fetch(
        `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`,
        {
          method: "POST",
          redirect: "error",
          signal,
          headers: {
            "Ocp-Apim-Subscription-Key": speechKey,
            "Pronunciation-Assessment": parameters,
            "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
            Accept: "application/json",
          },
          body: new Blob([audio.slice().buffer], { type: "audio/wav" }),
        }
      );
      if (!response.ok) throw new Error("assessment-unavailable");
      return response.json();
    },
  })
);
