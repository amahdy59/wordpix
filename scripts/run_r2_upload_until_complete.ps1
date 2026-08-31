$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
$log = Join-Path $root "r2-upload-supervisor.log"
$uploader = Join-Path $PSScriptRoot "upload_assets.ps1"

Add-Content -LiteralPath $log -Value "[$(Get-Date -Format o)] supervisor started"
while ($true) {
  $result = @(& pwsh -NoProfile -File $uploader 2>&1)
  $result | Add-Content -LiteralPath $log
  $complete = $result | Where-Object { $_ -match '^complete uploaded=\d+ skipped=\d+ failed=0$' }
  if ($complete) {
    Add-Content -LiteralPath $log -Value "[$(Get-Date -Format o)] supervisor complete"
    break
  }
  Add-Content -LiteralPath $log -Value "[$(Get-Date -Format o)] run interrupted; retrying in 15 seconds"
  Start-Sleep -Seconds 15
}
