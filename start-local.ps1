param(
  [int]$Port = 4173
)

$ErrorActionPreference = 'Stop'

$sitePath = Join-Path $PSScriptRoot 'math-sat'

if (-not (Test-Path $sitePath)) {
  throw "No se encontro la carpeta de despliegue: $sitePath"
}

Write-Host "Sirviendo SAT Math Practice Test en http://127.0.0.1:$Port"
Write-Host "Presiona Ctrl+C para detener el servidor."

python -m http.server $Port --bind 127.0.0.1 --directory $sitePath
