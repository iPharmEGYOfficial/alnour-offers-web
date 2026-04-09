# AlNour Offers Web

????? ???? ?????/??? ????? ????? ?? React + Vite ??? ????? AlNour Offers.

## Features
- Homepage + branding
- Products / offers
- Product details
- Public reviews
- Cart
- Checkout
- Multi-country payment-ready structure
- Account + addresses
- Admin orders
- Admin banners
- Social channels layer

## Local Run
```bash
npm install
npm run dev












































$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "ALNOUR OFFERS - SCRIPT 08" -ForegroundColor Cyan
Write-Host "Bridge Integration + Runtime Switching" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

$Root        = "D:\iPharmEGY_RUNTIME\AlNourOffers\alnour-offers-web"
$Src         = Join-Path $Root "src"
$Config      = Join-Path $Src "config"
$Services    = Join-Path $Src "services"
$Common      = Join-Path $Src "components\common"
$Pages       = Join-Path $Src "pages"
$Stamp       = Get-Date -Format "yyyyMMdd_HHmmss"

$TargetFiles = @(
    (Join-Path $Services "apiClient.js"),
    (Join-Path $Services "productService.js"),
    (Join-Path $Common "Header.jsx"),
    (Join-Path $Pages "OffersPage.jsx"),
    (Join-Path $Root ".env"),
    (Join-Path $Root ".env.development"),
    (Join-Path $Root ".env.production"),
    (Join-Path $Src "index.css")
)

foreach ($f in $TargetFiles) {
    if (Test-Path $f) {
        Copy-Item $f "$f.bak_$Stamp" -Force
    }
}

New-Item -ItemType Directory -Force -Path $Config | Out-Null

# -------------------------------------------------
# 1) RUNTIME CONFIG
# -------------------------------------------------
Set-Content (Join-Path $Config "runtimeConfig.js") @'
export const runtimeModes = {
  LOCAL: "local",
  BRIDGE: "bridge",
  PRODUCTION: "production"
};

export function getRuntimeMode() {
  const raw =
    import.meta.env.VITE_RUNTIME_MODE ||
    import.meta.env.MODE ||
    "development";

  if (raw === "bridge") return runtimeModes.BRIDGE;
  if (raw === "production") return runtimeModes.PRODUCTION;
  return runtimeModes.LOCAL;
}

export function getApiBaseUrl() {
  const mode = getRuntimeMode();

  if (mode === runtimeModes.BRIDGE) {
    return (
      import.meta.env.VITE_BRIDGE_BASE_URL ||
      "http://127.0.0.1:5192"
    );
  }

  if (mode === runtimeModes.PRODUCTION) {
    return (
      import.meta.env.VITE_API_BASE_URL ||
      "https://api.example.com"
    );
  }

  return (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5193"
  );
}

export function getBridgeKey() {
  return import.meta.env.VITE_BRIDGE_KEY || "";
}

export function shouldUseBridgeHeaders() {
  return getRuntimeMode() === runtimeModes.BRIDGE;
}

export function getRuntimeLabel() {
  const mode = getRuntimeMode();

  if (mode === runtimeModes.BRIDGE) return "Bridge";
  if (mode === runtimeModes.PRODUCTION) return "Production";
  return "Local";
}
