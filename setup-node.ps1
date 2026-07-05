$nodeVersion = "v20.11.0"
$zipUrl = "https://nodejs.org/dist/$nodeVersion/node-$nodeVersion-win-x64.zip"
$zipPath = "$PSScriptRoot\node.zip"
$extractPath = "$PSScriptRoot\node_temp"
$destPath = "$PSScriptRoot\.node"

Write-Host "Downloading Node.js $nodeVersion..."
Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath

Write-Host "Extracting archive..."
if (Test-Path $extractPath) { Remove-Item -Recurse -Force $extractPath }
Expand-Archive -Path $zipPath -DestinationPath $extractPath

Write-Host "Setting up directory..."
if (Test-Path $destPath) { Remove-Item -Recurse -Force $destPath }
New-Item -ItemType Directory -Path $destPath | Out-Null

$extractedFolder = Get-ChildItem -Path $extractPath | Select-Object -First 1
Move-Item -Path "$($extractedFolder.FullName)\*" -Destination $destPath

Write-Host "Cleaning up temporary files..."
Remove-Item -Force $zipPath
Remove-Item -Recurse -Force $extractPath

Write-Host "Node.js installation completed successfully in $destPath"
