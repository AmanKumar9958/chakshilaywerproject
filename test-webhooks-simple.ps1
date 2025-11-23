Write-Host "Testing N8N Webhooks..." -ForegroundColor Yellow

$webhooks = @(
    @{Name="Contract Comparison"; URL="https://n8n.srv983857.hstgr.cloud/webhook/a027ab82-e53c-4246-9982-c41c79ac9bca"},
    @{Name="Risk Analysis"; URL="https://n8n.srv983857.hstgr.cloud/webhook/32c4f30e-6722-4125-bd7d-691f0e9460e4"},
    @{Name="Document Summarizer"; URL="https://n8n.srv983857.hstgr.cloud/webhook/12ac51e5-e395-4c18-b5f9-ddd9516e6ed3"},
    @{Name="Authenticity Checker"; URL="https://n8n.srv983857.hstgr.cloud/webhook/ec8123eb-cee8-4ca3-a941-d499ed3f024d"},
    @{Name="Compliance Generator"; URL="https://n8n.srv983857.hstgr.cloud/webhook/compliance"}
)

foreach ($webhook in $webhooks) {
    Write-Host ""
    Write-Host "Testing: $($webhook.Name)" -ForegroundColor Cyan
    Write-Host "URL: $($webhook.URL)" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $webhook.URL -Method POST -ContentType "application/json" -Body '{}' -TimeoutSec 10
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Testing complete!" -ForegroundColor Yellow