$ErrorActionPreference = 'Stop'
Copy-Item -Force public/.htaccess dist/.htaccess
Write-Host "Compressing dist..."
Compress-Archive -Path 'dist\*' -DestinationPath 'dist_update_broadbeach.zip' -Force

$desktop = [Environment]::GetFolderPath('Desktop')
$dest = Join-Path $desktop 'dist_update_broadbeach.zip'
Copy-Item -Force 'dist_update_broadbeach.zip' $dest

$info = Get-Item $dest
Write-Host "Updated zip on Desktop:"
Write-Host "Path:" $info.FullName
Write-Host "Size:" $info.Length
Write-Host "Modified:" $info.LastWriteTime
