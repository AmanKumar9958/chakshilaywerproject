# PowerShell script to test N8N webhooks
Write-Host "Testing N8N Webhooks..." -ForegroundColor Yellow

$webhooks = @{
    "Contract Comparison" = "https://n8n.srv983857.hstgr.cloud/webhook/a027ab82-e53c-4246-9982-c41c79ac9bca"
    "Risk Analysis" = "https://n8n.srv983857.hstgr.cloud/webhook/32c4f30e-6722-4125-bd7d-691f0e9460e4"
    "Document Summarizer" = "https://n8n.srv983857.hstgr.cloud/webhook/12ac51e5-e395-4c18-b5f9-ddd9516e6ed3"
    "Authenticity Checker" = "https://n8n.srv983857.hstgr.cloud/webhook/ec8123eb-cee8-4ca3-a941-d499ed3f024d"
    "Compliance Generator" = "https://n8n.srv983857.hstgr.cloud/webhook/compliance"
}

foreach ($webhook in $webhooks.GetEnumerator()) {
    Write-Host "`nTesting: $($webhook.Key)" -ForegroundColor Cyan
    Write-Host "URL: $($webhook.Value)" -ForegroundColor Gray
    
    try {
        # Test with GET request first
        $response = Invoke-WebRequest -Uri $webhook.Value -Method GET -TimeoutSec 10
        Write-Host "✅ GET Response: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ GET Error: $($_.Exception.Message)" -ForegroundColor Red
        
        # Try POST request
        try {
            $response = Invoke-WebRequest -Uri $webhook.Value -Method POST -ContentType "application/json" -Body '{}' -TimeoutSec 10
            Write-Host "✅ POST Response: $($response.StatusCode)" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ POST Error: $($_.Exception.Message)" -ForegroundColor Red
            
            # Check if it's a DNS/connectivity issue
            try {
                $uri = [System.Uri]$webhook.Value
                $result = Test-NetConnection -ComputerName $uri.Host -Port 443 -InformationLevel Quiet
                if ($result) {
                    Write-Host "🔗 Network connectivity to host: OK" -ForegroundColor Yellow
                } else {
                    Write-Host "🔗 Network connectivity to host: FAILED" -ForegroundColor Red
                }
            }
            catch {
                Write-Host "🔗 Could not test network connectivity" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host ""
Write-Host "Testing complete!" -ForegroundColor Yellow
Write-Host "If all webhooks are failing, check:" -ForegroundColor White
Write-Host "1. Internet connectivity" -ForegroundColor Gray
Write-Host "2. N8N workflows are active/running" -ForegroundColor Gray
Write-Host "3. Webhook URLs are correct" -ForegroundColor Gray
Write-Host "4. N8N server is operational" -ForegroundColor Gray