$line = Get-Content "C:\Users\khoal\.gemini\antigravity\brain\0dd870a3-d32d-4f17-9b75-e1aa78962dbf\.system_generated\logs\overview.txt" | Where-Object { $_ -match '"step_index":14' }
$obj = $line | ConvertFrom-Json
$obj.content | Out-File -FilePath "c:\Users\khoal\.gemini\antigravity\scratch\newreleasehub\full_prompt.txt" -Encoding utf8
