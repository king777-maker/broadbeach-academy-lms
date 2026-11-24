$ErrorActionPreference = 'Stop'
$sourceDir = (Get-Item .).FullName
$desktop = [Environment]::GetFolderPath('Desktop')
$zipPath = Join-Path $desktop 'bb_exp-2.0_backup.zip'
$tempDir = Join-Path $env:TEMP ('bb_backup_staging_' + [Guid]::NewGuid().ToString('N'))

Write-Host "===================================================="
Write-Host "Creating Clean Project Backup on Desktop..."
Write-Host "Source Directory: $sourceDir"
Write-Host "Target Archive:   $zipPath"
Write-Host "===================================================="

if (Test-Path $zipPath) {
    Write-Host "Removing existing archive at $zipPath..."
    Remove-Item -Force $zipPath
}

if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

$excludeDirs = @('node_modules', '.git', 'dist', 'build', '.next', '.vercel', 'BROADBEACH_WEBSITE_BACKUP')

# 1. Copy root files (exclude .env live secrets and existing .zip files)
Get-ChildItem -Path $sourceDir -File | ForEach-Object {
    $fileName = $_.Name
    if ($fileName -eq '.env' -or $fileName -like '*.zip' -or $fileName -like '*.log') {
        # Excluded
    } else {
        Copy-Item -Path $_.FullName -Destination $tempDir
    }
}

# 2. Copy directories
Get-ChildItem -Path $sourceDir -Directory | ForEach-Object {
    $dirName = $_.Name
    if ($excludeDirs -contains $dirName) {
        Write-Host "Skipping directory: $dirName"
    } else {
        Write-Host "Copying directory:  $dirName"
        $destSub = Join-Path $tempDir $dirName
        Copy-Item -Path $_.FullName -Destination $destSub -Recurse
    }
}

# Ensure PROJECT_HANDOFF.md and .env.example are in staging
if (!(Test-Path (Join-Path $tempDir 'PROJECT_HANDOFF.md'))) {
    throw "PROJECT_HANDOFF.md is missing from staging!"
}
if (!(Test-Path (Join-Path $tempDir '.env.example'))) {
    throw ".env.example is missing from staging!"
}

Write-Host "Staging complete. Compressing archive..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)

# Clean up staging directory
Remove-Item -Recurse -Force $tempDir

$zipInfo = Get-Item $zipPath
Write-Host "===================================================="
Write-Host "Archive created successfully!"
Write-Host "Path: $($zipInfo.FullName)"
Write-Host "Size: $([Math]::Round($zipInfo.Length / 1MB, 2)) MB ($($zipInfo.Length) bytes)"
Write-Host "Last Modified: $($zipInfo.LastWriteTime)"
Write-Host "===================================================="
