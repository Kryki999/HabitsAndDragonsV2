# Renders every look-dev page to ../golden/<name>.png at 2x (iPhone 390x844 logical).
# Usage: powershell -File docs/reference/ui/lookdev/render.ps1 [page-name ...]
param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Pages)

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path (Split-Path -Parent $here) "golden"
New-Item -ItemType Directory -Force $out | Out-Null

$browser = @(
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { throw "No Edge/Chrome found" }

if (-not $Pages) { $Pages = Get-ChildItem $here -Filter *.html | ForEach-Object { $_.BaseName } }

foreach ($p in $Pages) {
  $src = "file:///" + ((Join-Path $here "$p.html") -replace '\\', '/')
  $png = Join-Path $out "$p.png"
  $size = if ($p -like "kit-*") { "1000,2180" } else { "390,844" }
  $args = @("--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2",
    "--window-size=$size", "--virtual-time-budget=6000", "--user-data-dir=$env:TEMP\hd-lookdev-browser",
    "--screenshot=$png", $src)
  Start-Process -FilePath $browser -ArgumentList $args -Wait -NoNewWindow -RedirectStandardError "$env:TEMP\hd-lookdev.log"
  Write-Output "rendered $png"
}
