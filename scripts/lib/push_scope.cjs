/** A draft push must explicitly target only Codex branches; unknown/main/tag pushes fail closed. */
function isDraftPush(input) {
  const lines = input.trim().split(/\r?\n/).filter(Boolean);
  return (
    lines.length > 0 &&
    lines.every((line) => {
      const fields = line.trim().split(/\s+/);
      return (
        fields.length === 4 &&
        /^refs\/heads\/codex\/[a-z0-9_/-]+$/i.test(fields[2]) &&
        /^[a-f0-9]{40}$/i.test(fields[1]) &&
        !/^0+$/.test(fields[1])
      );
    })
  );
}
module.exports = { isDraftPush };
