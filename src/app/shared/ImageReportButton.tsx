import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { Flag, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "../context/I18nContext";
import { useModalA11y } from "./useModalA11y";
import { Button } from "./Button";
import {
  imageReportReasonSchema,
  saveImageReport,
  type ImageReportContext,
} from "../media/imageReports";

const formSchema = z.object({ reason: imageReportReasonSchema });
export function ImageReportButton({
  imagePath,
  context,
  overlay = true,
}: {
  imagePath: string;
  context: ImageReportContext;
  overlay?: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const id = useId();
  const ref = useModalA11y({ isOpen: open, onDismiss: () => setOpen(false) });
  const { register, handleSubmit, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { reason: "mismatch" },
  });
  return (
    <>
      <button
        type="button"
        aria-label={t("imageQuality.reportImage")}
        title={t("imageQuality.reportImage")}
        className={`${overlay ? "absolute bottom-2 end-2 z-10" : "inline-flex"} flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-card p-2 text-foreground shadow-sm hover:bg-secondary active:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
        onClick={(event) => {
          // WebKit does not focus a button on a pointer tap. Establish the
          // invoking element before the dialog captures its return target.
          event.currentTarget.focus({ preventScroll: true });
          setStatus("idle");
          reset();
          setOpen(true);
        }}
      >
        <Flag className="size-4" aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4">
            {/* Contain dialog keys so lesson shortcuts cannot answer behind the modal. */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-title`}
              aria-describedby={`${id}-description`}
              tabIndex={-1}
              onKeyDown={(event) => event.stopPropagation()}
              className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 id={`${id}-title`} className="text-lg font-bold">
                  {t("imageQuality.reportImage")}
                </h2>
                <Button
                  variant="ghost"
                  aria-label={t("action.close")}
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" aria-hidden="true" />
                </Button>
              </div>
              <p id={`${id}-description`} className="my-4 text-sm leading-relaxed">
                {t("imageQuality.localReportHint")}
              </p>
              {status === "saved" ? (
                <>
                  <p role="status" className="my-4 font-semibold">
                    {t("imageQuality.reportSaved")}
                  </p>
                  <Button onClick={() => setOpen(false)}>{t("action.close")}</Button>
                </>
              ) : (
                <form
                  onSubmit={handleSubmit(async ({ reason }) => {
                    setStatus("saving");
                    try {
                      await saveImageReport({ context, imagePath, reason });
                      setStatus("saved");
                    } catch {
                      setStatus("error");
                    }
                  })}
                  className="space-y-4"
                  aria-busy={status === "saving"}
                >
                  <label htmlFor={`${id}-reason`} className="block font-semibold">
                    {t("imageQuality.reason")}
                  </label>
                  <select
                    id={`${id}-reason`}
                    {...register("reason")}
                    disabled={status === "saving"}
                    className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {imageReportReasonSchema.options.map((reason) => (
                      <option key={reason} value={reason}>
                        {t(`imageQuality.reason_${reason}`)}
                      </option>
                    ))}
                  </select>
                  {status === "error" && <p role="alert">{t("imageQuality.reportError")}</p>}
                  <Button
                    type="submit"
                    disabled={status === "saving"}
                    loading={status === "saving"}
                  >
                    {t("imageQuality.saveReport")}
                  </Button>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
