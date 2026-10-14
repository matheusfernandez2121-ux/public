$uri = "http://localhost:3000/api/expenses"
$body = '{"description": "Teste webhook", "amount": 15.50, "category": "groceries", "date": "2026-10-14"}'

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -ContentType "application/json" -Body $body
    Write-Host "Success: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "Response: $($_.ErrorDetails.Message)"
    }
}
