$body = @{
    messages = @(
        @{ role = "user"; content = "hola" }
    )
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/chat" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    Write-Host "SUCCESS:" $response.Content
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = [System.IO.StreamReader]::new($stream)
    $body = $reader.ReadToEnd()
    Write-Host "ERROR $statusCode :" $body
}
