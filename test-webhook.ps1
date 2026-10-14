$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    description = "Teste webhook"
    amount = 15.50
    category = "groceries"
    date = "2026-10-14"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/expenses" -Method POST -Headers $headers -Body $body
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.ErrorDetails.Message)"
}
