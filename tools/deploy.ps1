$ErrorActionPreference = 'Stop'
$troiaRoot = Split-Path -Parent $PSScriptRoot
$troiaPublish = Join-Path $troiaRoot '.deploy'
New-Item -ItemType Directory -Force -Path $troiaPublish | Out-Null
foreach ($troiaFile in @('index.html', 'styles.css', 'design.css', 'script.js', '_headers', '404.html', 'robots.txt', 'sitemap.xml')) {
    Copy-Item -LiteralPath (Join-Path $troiaRoot $troiaFile) -Destination $troiaPublish -Force
}
$troiaAssetDestination = Join-Path $troiaPublish 'assets'
New-Item -ItemType Directory -Force -Path $troiaAssetDestination | Out-Null
Get-ChildItem -LiteralPath (Join-Path $troiaRoot 'assets') |
    Where-Object { $_.Name -ne 'original' } |
    ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination $troiaAssetDestination -Recurse -Force }
& npx --yes wrangler@4.151.3 deploy --config (Join-Path $troiaRoot 'wrangler.jsonc') --keep-vars
if ($LASTEXITCODE -ne 0) { throw 'A publicação no Cloudflare falhou.' }
