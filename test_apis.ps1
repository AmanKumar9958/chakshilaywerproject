# PowerShell Script for Testing Document Processing APIs
# Run this script from the project root directory

Write-Host "Document Processing API Test Script" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Function to test compliance API (no file needed)
function Test-ComplianceAPI {
    Write-Host "`nTesting Compliance Task Generator..." -ForegroundColor Yellow
    
    $body = @{
        Regulation = "labor law"
        Country = "INDIA"
        CompanyType = "justice"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://n8n.srv983857.hstgr.cloud/webhook/compliance" -Method POST -Body $body -ContentType "application/json"
        Write-Host "✅ Compliance API Response:" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
    }
    catch {
        Write-Host "❌ Compliance API Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to test file upload APIs (requires sample PDF)
function Test-FileUploadAPI {
    param(
        [string]$Endpoint,
        [string]$Name,
        [string]$FilePath1,
        [string]$FilePath2 = $null
    )
    
    Write-Host "`nTesting $Name..." -ForegroundColor Yellow
    
    if (!(Test-Path $FilePath1)) {
        Write-Host "❌ File not found: $FilePath1" -ForegroundColor Red
        return
    }
    
    try {
        $form = @{
            file1 = Get-Item -Path $FilePath1
        }
        
        if ($FilePath2 -and (Test-Path $FilePath2)) {
            $form.file2 = Get-Item -Path $FilePath2
        }
        
        $response = Invoke-RestMethod -Uri $Endpoint -Method POST -Form $form
        Write-Host "✅ $Name Response:" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
    }
    catch {
        Write-Host "❌ $Name Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create a sample text file if no PDF exists
$sampleFile = "sample_contract.txt"
if (!(Test-Path $sampleFile)) {
    Write-Host "Creating sample file for testing..." -ForegroundColor Cyan
    @"
SAMPLE CONTRACT AGREEMENT

This is a sample contract between Party A and Party B.

Terms and Conditions:
1. Payment terms: Net 30 days
2. Delivery: Within 10 business days
3. Warranty: 1 year limited warranty
4. Liability: Limited to contract value
5. Termination: 30 days written notice

This contract is governed by the laws of the applicable jurisdiction.
"@ | Out-File -FilePath $sampleFile -Encoding UTF8
    Write-Host "✅ Sample file created: $sampleFile" -ForegroundColor Green
}

# Test all APIs
Write-Host "`n1. Testing Compliance API (no file required)..." -ForegroundColor Cyan
Test-ComplianceAPI

Write-Host "`n2. Testing File Upload APIs..." -ForegroundColor Cyan
Write-Host "Note: Using text file as PDF substitute for testing" -ForegroundColor Yellow

# Test Document Summarizer
Test-FileUploadAPI -Endpoint "https://n8n.srv983857.hstgr.cloud/webhook/12ac51e5-e395-4c18-b5f9-ddd9516e6ed3" -Name "Document Summarizer" -FilePath1 $sampleFile

# Test Risk Analysis  
Test-FileUploadAPI -Endpoint "https://n8n.srv983857.hstgr.cloud/webhook/32c4f30e-6722-4125-bd7d-691f0e9460e4" -Name "Risk Analysis" -FilePath1 $sampleFile

# Test Contract Comparison (needs 2 files)
$sampleFile2 = "sample_contract2.txt"
if (!(Test-Path $sampleFile2)) {
    @"
SAMPLE CONTRACT AGREEMENT - VERSION 2

This is a modified sample contract between Party A and Party B.

Updated Terms and Conditions:
1. Payment terms: Net 15 days (CHANGED)
2. Delivery: Within 5 business days (CHANGED)
3. Warranty: 2 years limited warranty (CHANGED)
4. Liability: Limited to 2x contract value (CHANGED)
5. Termination: 60 days written notice (CHANGED)

This contract includes additional liability coverage.
"@ | Out-File -FilePath $sampleFile2 -Encoding UTF8
}

Test-FileUploadAPI -Endpoint "https://n8n.srv983857.hstgr.cloud/webhook/a027ab82-e53c-4246-9982-c41c79ac9bca" -Name "Contract Comparison" -FilePath1 $sampleFile -FilePath2 $sampleFile2

Write-Host "`n===================================" -ForegroundColor Green
Write-Host "API Testing Complete!" -ForegroundColor Green
Write-Host "Check the responses above for results." -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green