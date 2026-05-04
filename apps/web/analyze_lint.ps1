$json = Get-Content lint_results.json | ConvertFrom-Json
$messages = $json | ForEach-Object { $_.messages }
$rules = $messages | Group-Object ruleId | Select-Object Name, Count | Sort-Object Count -Descending
Write-Host "--- TOP RULES ---"
$rules | Select-Object -First 10 | ConvertTo-Json

Write-Host "`n--- TOP FILES ---"
$json | Select-Object @{Name='Path';Expression={$_.filePath.Replace('c:\Users\khoal\.gemini\antigravity\scratch\newreleasehub\apps\web\', '')}}, @{Name='ErrorCount';Expression={($_.messages | Where-Object { $_.severity -eq 2 }).Count}} | Sort-Object ErrorCount -Descending | Select-Object -First 20 | ConvertTo-Json

