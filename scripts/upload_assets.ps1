param([switch]$Force)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $root ".env.local"
$values = @{}
Get-Content -LiteralPath $envPath | ForEach-Object {
  if ($_ -match '^\s*([^#=\s]+)\s*=\s*(.*)$') {
    $values[$matches[1]] = $matches[2].Trim().Trim('"').Trim("'")
  }
}

$account = $values.R2_ACCOUNT_ID
$access = $values.R2_ACCESS_KEY_ID
$secret = $values.R2_SECRET_ACCESS_KEY
$bucket = $values.R2_BUCKET
if (-not $account -or -not $access -or -not $secret -or -not $bucket) {
  throw "Missing R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, or R2_BUCKET in .env.local"
}

$types = @{
  ".avif" = "image/avif"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"
  ".png" = "image/png"; ".svg" = "image/svg+xml"; ".webp" = "image/webp"
}
$files = Get-ChildItem (Join-Path $root "public") -Recurse -File |
  Where-Object { $types.ContainsKey($_.Extension.ToLowerInvariant()) }
Write-Output ("images={0}" -f $files.Count)
$forceUpload = $Force.IsPresent

$files | ForEach-Object -Parallel {
  $file = $_
  $relative = [IO.Path]::GetRelativePath((Join-Path $using:root "public"), $file.FullName).Replace([IO.Path]::DirectorySeparatorChar, "/")
  $encoded = (($relative -split "/") | ForEach-Object { [Uri]::EscapeDataString($_) }) -join "/"
  $url = "https://$($using:account).r2.cloudflarestorage.com/$($using:bucket)/images/v1/$encoded"
  $typeMap = $using:types
  $contentType = $typeMap[$file.Extension.ToLowerInvariant()]
  $curlArgs = @(
    "--silent", "--show-error", "--fail", "--retry", "4", "--retry-all-errors",
    "--connect-timeout", "30", "--max-time", "300", "--aws-sigv4", "aws:amz:auto:s3",
    "--user", "$($using:access):$($using:secret)", "--upload-file", $file.FullName,
    "--header", "Content-Type: $contentType", "--header", "Cache-Control: public, max-age=31536000, immutable",
    "--output", "NUL", $url
  )
  if (-not $using:forceUpload) {
    try {
      $headArgs = @("--silent", "--output", "NUL", "--write-out", "%{http_code}", "--aws-sigv4", "aws:amz:auto:s3", "--user", "$($using:access):$($using:secret)", "--head", $url)
      $headStatus = (& curl.exe @headArgs).Trim()
    } catch {
      return "failed"
    }
    if ($headStatus -eq "200") { return "skipped" }
  }
  try {
    & curl.exe @curlArgs
    if ($LASTEXITCODE -ne 0) { return "failed" }
    "uploaded"
  } catch {
    "failed"
  }
} -ThrottleLimit 8 | ForEach-Object -Begin { $n = 0; $uploaded = 0; $skipped = 0 } -Process {
  $n++
  if ($_ -eq "uploaded") { $uploaded++ } elseif ($_ -eq "skipped") { $skipped++ }
  if (($n % 100) -eq 0) { Write-Output ("processed {0}/{1} uploaded={2} skipped={3} failed={4}" -f $n, $files.Count, $uploaded, $skipped, ($n - $uploaded - $skipped)) }
}
Write-Output ("complete uploaded={0} skipped={1} failed={2}" -f $uploaded, $skipped, ($files.Count - $uploaded - $skipped))
