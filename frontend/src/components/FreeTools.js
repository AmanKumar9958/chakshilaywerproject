import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTemplateCategories, getTemplates } from '../lib/api';

const FreeTools = () => {
  const { user, loading: authLoading } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // This state is not used in the current JSX, but kept for potential future use.
  const [selectedTool, setSelectedTool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [bookmarkedTools, setBookmarkedTools] = useState([]); // This state is not used in the current JSX, but kept for potential future use.
  const [showGeneratorForm, setShowGeneratorForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (authLoading) return; // Wait for auth to load

      if (!user || !user.token) {
        setError("Authentication required to fetch templates.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [categoriesResponse, templatesResponse] = await Promise.all([
          getTemplateCategories(user.token),
          getTemplates(user.token, {
            categoryId: selectedCategory === "All" ? undefined : selectedCategory,
            isFree: showOnlyFree ? true : undefined,
            // Add other filters here if needed
          }),
        ]);

        setCategories([{ id: "All", name: "All", slug: "all" }, ...categoriesResponse.data.categories]);
        setTemplates(templatesResponse.data.templates);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to load templates and categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user, authLoading, selectedCategory, showOnlyFree]); // Re-fetch when user, authLoading, selectedCategory, or showOnlyFree changes

  // Filter tools based on category, search query, and additional filters
  const filteredTools = templates
    .filter(tool => {
      const categoryMatch = selectedCategory === "All" || tool.categoryId === selectedCategory;
      const searchMatch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const freeMatch = !showOnlyFree || tool.isFree;
      
      return categoryMatch && searchMatch && freeMatch;
    })
    .sort((a, b) => {
      // The API response doesn't directly provide 'popularity' or 'uses' as in the hardcoded data.
      // We'll use 'rating' and 'createdAt' for sorting.
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      // Default sort could be by title or creation date if no specific sort is chosen
      return a.title.localeCompare(b.title);
    });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setShowOnlyFree(false);
    setSortBy("default");
  };

  // Template generation logic
  const generateDocument = async (toolId, userData) => {
    setIsGenerating(true);
    try {
      const tool = templates.find(t => t.id === toolId);
      if (!tool) {
        throw new Error("Template not found for generation.");
      }
      let generatedContent = '';
      
      // The switch cases here are based on the hardcoded tool IDs.
      // In a real-world scenario, you might have a more dynamic way to determine
      // which generator function to call based on the template's properties or a backend service.
      switch (tool.title) { // Using title as a proxy for the hardcoded tool types
        case "RTI Application Generator":
          generatedContent = generateRTIApplication(userData);
          break;
        case "Police Complaint Builder":
          generatedContent = generatePoliceComplaint(userData);
          break;
        case "Consumer Court Assistant":
          generatedContent = generateConsumerComplaint(userData);
          break;
        case "Smart Rental Agreement":
          generatedContent = generateRentalAgreement(userData);
          break;
        case "Will & Testament Creator":
          generatedContent = generateWillTestament(userData);
          break;
        case "Legal Notice Generator":
          generatedContent = generateLegalNotice(userData);
          break;
        case "FIR Copy Application":
          generatedContent = generateFIRCopyApplication(userData);
          break;
        case "Property Due Diligence Kit":
          generatedContent = generatePropertyDueDiligence(userData);
          break;
        case "Employment Contract Builder":
          generatedContent = generateEmploymentContract(userData);
          break;
        case "Startup Legal Essentials":
          generatedContent = generateStartupDocuments(userData);
          break;
        default:
          generatedContent = tool.content || 'Template not available for this tool.'; // Use API content if no specific generator
      }
      
      setGeneratedDocument({
        title: tool.title,
        content: generatedContent,
        generatedAt: new Date().toLocaleString(),
        userData: userData
      });
      
      setShowGeneratorForm(false);
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Error generating document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Template generators for each tool type
  const generateRTIApplication = (data) => {
    return `
RIGHT TO INFORMATION APPLICATION

Date: ${new Date().toLocaleDateString()}

To,
The Public Information Officer
${data.department || '[Department Name]'}
${data.office || '[Office Address]'}

Subject: Application under Right to Information Act, 2005

Dear Sir/Madam,

I, ${data.applicantName || '[Applicant Name]'}, ${data.relationship || 'S/o D/o W/o'} ${data.guardianName || '[Guardian Name]'}, resident of ${data.address || '[Complete Address]'}, would like to obtain the following information under the Right to Information Act, 2005:

INFORMATION SOUGHT:
${data.informationSought || '[Specify the information you want]'}

PURPOSE: ${data.purpose || '[Mention the purpose for which information is sought]'}

PERIOD: Information from ${data.fromDate || '[Start Date]'} to ${data.toDate || '[End Date]'}

I am enclosing a crossed demand draft/postal order/court fee stamp worth Rs. ${data.feeAmount || '10'}/-  (Rupees ${data.feeAmountWords || 'Ten'} only) towards the application fee as prescribed under the RTI Act, 2005.

Please provide the information within the statutory period of 30 days. If the information sought is held by another public authority, kindly transfer this application to the concerned authority under Section 6(3) of the RTI Act.

I would prefer to receive the information in the following format:
☐ Photocopies of documents
☐ Email: ${data.email || '[Email Address]'}
☐ Inspection of records
☐ ${data.preferredFormat || 'Other format'}

Thanking You,

Yours faithfully,

${data.applicantName || '[Applicant Name]'}
Mobile: ${data.mobile || '[Mobile Number]'}
Email: ${data.email || '[Email Address]'}

Enclosures:
1. Application fee of Rs. ${data.feeAmount || '10'}/-
2. Copy of identity proof
3. ${data.additionalDocuments || 'Any other relevant documents'}
`;
  };

  const generatePoliceComplaint = (data) => {
    return `
POLICE COMPLAINT

Date: ${new Date().toLocaleDateString()}

To,
The Station House Officer
${data.policeStation || '[Police Station Name]'}
${data.policeStationAddress || '[Police Station Address]'}

Subject: Complaint regarding ${data.incidentType || '[Type of Incident]'}

Sir/Madam,

I, ${data.complainantName || '[Complainant Name]'}, ${data.relationship || 'S/o D/o W/o'} ${data.guardianName || '[Guardian Name]'}, aged ${data.age || '[Age]'} years, resident of ${data.address || '[Complete Address]'}, Mobile: ${data.mobile || '[Mobile Number]'}, would like to file the following complaint:

INCIDENT DETAILS:
Date of Incident: ${data.incidentDate || '[Date]'}
Time of Incident: ${data.incidentTime || '[Time]'}
Place of Incident: ${data.incidentPlace || '[Place of Incident]'}

DESCRIPTION OF INCIDENT:
${data.incidentDescription || '[Detailed description of the incident]'}

ACCUSED PERSON(S):
Name: ${data.accusedName || '[Name of accused if known]'}
Address: ${data.accusedAddress || '[Address if known]'}
Description: ${data.accusedDescription || '[Physical description]'}

WITNESSES:
1. ${data.witness1 || '[Witness 1 Name and Address]'}
2. ${data.witness2 || '[Witness 2 Name and Address]'}

EVIDENCE/DOCUMENTS ATTACHED:
${data.evidence || '[List of evidence/documents attached]'}

PRAYER:
I request you to kindly register an FIR and investigate the matter as per law and take necessary action against the accused person(s).

I hereby declare that the above information is true to the best of my knowledge and belief.

Thanking You,

Yours faithfully,

${data.complainantName || '[Complainant Name]'}
Signature: ________________
Date: ${new Date().toLocaleDateString()}
Mobile: ${data.mobile || '[Mobile Number]'}
Email: ${data.email || '[Email Address]'}
`;
  };

  const generateConsumerComplaint = (data) => {
    return `
CONSUMER COMPLAINT

Date: ${new Date().toLocaleDateString()}

To,
The ${data.forumLevel || 'District'} Consumer Disputes Redressal Forum
${data.forumAddress || '[Forum Address]'}

COMPLAINT UNDER THE CONSUMER PROTECTION ACT, 2019

Complainant: ${data.complainantName || '[Complainant Name]'}
Address: ${data.complainantAddress || '[Complete Address]'}
Mobile: ${data.mobile || '[Mobile Number]'}
Email: ${data.email || '[Email Address]'}

Vs.

Opposite Party: ${data.sellerName || '[Seller/Service Provider Name]'}
Address: ${data.sellerAddress || '[Seller Address]'}

FACTS OF THE CASE:

1. Date of Purchase: ${data.purchaseDate || '[Purchase Date]'}
2. Product/Service: ${data.productService || '[Product/Service Details]'}
3. Amount Paid: Rs. ${data.amountPaid || '[Amount]'}/-
4. Bill/Receipt No.: ${data.billNumber || '[Bill Number]'}

DEFECT/DEFICIENCY:
${data.defectDescription || '[Detailed description of defect or deficiency in goods/services]'}

CORRESPONDENCE WITH SELLER:
${data.correspondence || '[Details of communication with seller for resolution]'}

RELIEF SOUGHT:
1. Replacement of the defective product / Re-performance of service
2. Refund of Rs. ${data.amountPaid || '[Amount]'}/- with interest @ 9% per annum
3. Compensation of Rs. ${data.compensationAmount || '[Amount]'}/- for mental agony and harassment
4. Cost of litigation
5. Any other relief deemed fit

DOCUMENTS ENCLOSED:
1. Copy of Bill/Receipt
2. Copy of Warranty/Guarantee Card
3. Photographs of defective product (if applicable)
4. Copy of correspondence with seller
5. ${data.additionalDocuments || 'Other relevant documents'}

I hereby declare that the above complaint is filed within the limitation period and the facts stated are true to the best of my knowledge.

Place: ${data.place || '[Place]'}
Date: ${new Date().toLocaleDateString()}

Signature of Complainant
${data.complainantName || '[Complainant Name]'}
`;
  };

  const generateRentalAgreement = (data) => {
    return `
RENTAL AGREEMENT

This Rental Agreement is made on ${data.agreementDate || new Date().toLocaleDateString()} between:

LANDLORD:
Name: ${data.landlordName || '[Landlord Name]'}
Address: ${data.landlordAddress || '[Landlord Address]'}
Mobile: ${data.landlordMobile || '[Mobile Number]'}
PAN: ${data.landlordPAN || '[PAN Number]'}

AND

TENANT:
Name: ${data.tenantName || '[Tenant Name]'}
Address: ${data.tenantAddress || '[Tenant Address]'}
Mobile: ${data.tenantMobile || '[Mobile Number]'}
Aadhaar: ${data.tenantAadhaar || '[Aadhaar Number]'}

PROPERTY DETAILS:
Address: ${data.propertyAddress || '[Property Address]'}
Type: ${data.propertyType || '[Apartment/House/Commercial]'}
Built-up Area: ${data.area || '[Area]'} sq.ft.
Furnishing: ${data.furnishing || '[Furnished/Semi-furnished/Unfurnished]'}

TERMS AND CONDITIONS:

1. RENT: Rs. ${data.monthlyRent || '[Amount]'}/- per month
2. SECURITY DEPOSIT: Rs. ${data.securityDeposit || '[Amount]'}/-
3. MAINTENANCE: Rs. ${data.maintenance || '[Amount]'}/- per month
4. LEASE PERIOD: ${data.leasePeriod || '[Duration]'} starting from ${data.startDate || '[Start Date]'}
5. RENT DUE DATE: ${data.rentDueDate || '5th'} of every month
6. LATE PAYMENT: Interest @ ${data.latePaymentInterest || '2%'} per month on delayed rent

UTILITIES:
☐ Electricity - ${data.electricityBy || 'Tenant responsibility'}
☐ Water - ${data.waterBy || 'Tenant responsibility'}
☐ Gas - ${data.gasBy || 'Tenant responsibility'}
☐ Internet - ${data.internetBy || 'Tenant responsibility'}

RULES AND REGULATIONS:
1. ${data.rule1 || 'No pets allowed without written permission'}
2. ${data.rule2 || 'No structural modifications without consent'}
3. ${data.rule3 || 'Maintain cleanliness and hygiene'}
4. ${data.rule4 || 'No illegal activities or nuisance'}
5. ${data.rule5 || 'Prior notice required for guests staying over 2 days'}

TERMINATION:
Either party can terminate this agreement by giving ${data.noticePeriod || '30'} days written notice.

WITNESS 1:                          WITNESS 2:
Name: ${data.witness1Name || '[Name]'}              Name: ${data.witness2Name || '[Name]'}
Signature: ________________        Signature: ________________

LANDLORD:                           TENANT:
${data.landlordName || '[Landlord Name]'}                    ${data.tenantName || '[Tenant Name]'}
Signature: ________________        Signature: ________________
Date: ${new Date().toLocaleDateString()}                     Date: ${new Date().toLocaleDateString()}

Note: This agreement should be printed on stamp paper of appropriate value as per state laws.
`;
  };

  const generateWillTestament = (data) => {
    return `
LAST WILL AND TESTAMENT

I, ${data.testatorName || '[Testator Name]'}, ${data.relationship || 'S/o D/o W/o'} ${data.parentName || '[Parent Name]'}, aged ${data.age || '[Age]'} years, resident of ${data.address || '[Complete Address]'}, being of sound mind and memory, do hereby make this my Last Will and Testament, hereby revoking all previous wills and codicils made by me.

DECLARATION:
1. I am making this Will voluntarily without any coercion or undue influence.
2. I am of sound disposing mind and memory.
3. I understand the nature and effect of this Will.

APPOINTMENT OF EXECUTOR:
I hereby appoint ${data.executorName || '[Executor Name]'}, ${data.executorRelation || '[Relation]'}, resident of ${data.executorAddress || '[Executor Address]'}, as the Executor of this Will.

BENEFICIARIES:
${data.beneficiary1Name || '[Beneficiary 1 Name]'} - ${data.beneficiary1Relation || '[Relation]'}
${data.beneficiary2Name || '[Beneficiary 2 Name]'} - ${data.beneficiary2Relation || '[Relation]'}
${data.beneficiary3Name || '[Beneficiary 3 Name]'} - ${data.beneficiary3Relation || '[Relation]'}

ASSET DISTRIBUTION:

IMMOVABLE PROPERTY:
1. ${data.property1Description || '[Property 1 Description]'}
   Beneficiary: ${data.property1Beneficiary || '[Beneficiary Name]'}
   Share: ${data.property1Share || '[Share/Percentage]'}

2. ${data.property2Description || '[Property 2 Description]'}
   Beneficiary: ${data.property2Beneficiary || '[Beneficiary Name]'}
   Share: ${data.property2Share || '[Share/Percentage]'}

MOVABLE PROPERTY:
1. Bank Accounts: ${data.bankDetails || '[Bank Account Details]'}
   Beneficiary: ${data.bankBeneficiary || '[Beneficiary]'}

2. Investments: ${data.investmentDetails || '[Investment Details]'}
   Beneficiary: ${data.investmentBeneficiary || '[Beneficiary]'}

3. Jewelry and Valuables: ${data.jewelryDetails || '[Details]'}
   Beneficiary: ${data.jewelryBeneficiary || '[Beneficiary]'}

4. Household Items and Personal Effects:
   Beneficiary: ${data.householdBeneficiary || '[Beneficiary]'}

SPECIFIC BEQUESTS:
${data.specificBequests || '[Any specific items to specific beneficiaries]'}

CONTINGENCY PROVISION:
In case any beneficiary predeceases me, their share shall be distributed equally among the surviving beneficiaries.

DEBTS AND LIABILITIES:
All my debts, funeral expenses, and legal charges shall be paid from my estate before distribution.

GUARDIANSHIP:
${data.minorChildren ? `In case of minor children, I appoint ${data.guardianName || '[Guardian Name]'} as their guardian.` : 'Not applicable'}

I hereby declare this to be my Last Will and Testament.

IN WITNESS WHEREOF, I have set my hand and seal this ${new Date().toLocaleDateString()}.

TESTATOR:
${data.testatorName || '[Testator Name]'}
Signature: ________________

WITNESSES:
We, the undersigned witnesses, certify that the testator signed this Will in our presence and that we signed as witnesses in the testator's presence and in the presence of each other.

WITNESS 1:                          WITNESS 2:
Name: ${data.witness1Name || '[Name]'}              Name: ${data.witness2Name || '[Name]'}
Address: ${data.witness1Address || '[Address]'}     Address: ${data.witness2Address || '[Address]'}
Signature: ________________        Signature: ________________
Date: ${new Date().toLocaleDateString()}                     Date: ${new Date().toLocaleDateString()}

Note: This Will should be executed as per the legal requirements of your state. Consider consulting a lawyer for complex estates.
`;
  };

  const generateLegalNotice = (data) => {
    return `
LEGAL NOTICE

To,
${data.recipientName || '[Recipient Name]'}
${data.recipientAddress || '[Recipient Address]'}

UNDER SECTION 80 OF THE CODE OF CIVIL PROCEDURE, 1908

Sir/Madam,

TAKE NOTICE that I, ${data.senderName || '[Sender Name]'}, ${data.senderAddress || '[Sender Address]'}, through my advocate, do hereby give you this notice for the following reasons:

FACTS OF THE CASE:
${data.factOfCase || '[Detailed facts of the case/dispute]'}

CAUSE OF ACTION:
${data.causeOfAction || '[Events that led to this legal notice]'}

LEGAL POSITION:
${data.legalPosition || '[Legal basis and rights of the sender]'}

NOTICE:
TAKE NOTICE that you are hereby called upon to ${data.demandAction || '[specific action demanded]'} within ${data.noticePeriod || '15'} days from the receipt of this notice, failing which I shall be constrained to initiate appropriate legal proceedings against you for:

1. ${data.relief1 || '[Relief 1]'}
2. ${data.relief2 || '[Relief 2]'}
3. ${data.relief3 || '[Relief 3]'}
4. Cost of legal proceedings
5. Any other relief deemed fit by the Hon'ble Court

TAKE FURTHER NOTICE that if you fail to comply with the demands made herein within the stipulated time, you will be solely responsible for all legal consequences, costs, and damages.

This notice is given to you so that you may avoid unnecessary litigation and settle the matter amicably.

YOU ARE HEREBY CALLED UPON TO TAKE NOTICE AND ACT ACCORDINGLY.

Date: ${new Date().toLocaleDateString()}
Place: ${data.place || '[Place]'}

Yours faithfully,

${data.advocateName || '[Advocate Name]'}
Advocate for ${data.senderName || '[Sender Name]'}
Bar Council No.: ${data.barCouncilNo || '[Bar Council Number]'}
Address: ${data.advocateAddress || '[Advocate Address]'}
Mobile: ${data.advocateMobile || '[Mobile Number]'}
Email: ${data.advocateEmail || '[Email Address]'}

SERVED THROUGH:
☐ Registered Post A.D.
☐ Speed Post
☐ Personal Service
☐ Courier Service
☐ Email
`;
  };

  const generateFIRCopyApplication = (data) => {
    return `
APPLICATION FOR CERTIFIED COPY OF FIR

Date: ${new Date().toLocaleDateString()}

To,
The Station House Officer
${data.policeStation || '[Police Station Name]'}
${data.policeStationAddress || '[Police Station Address]'}

Subject: Application for certified copy of FIR

Sir/Madam,

I, ${data.applicantName || '[Applicant Name]'}, ${data.relationship || 'S/o D/o W/o'} ${data.guardianName || '[Guardian Name]'}, aged ${data.age || '[Age]'} years, resident of ${data.address || '[Complete Address]'}, Mobile: ${data.mobile || '[Mobile Number]'}, do hereby apply for a certified copy of FIR for the following:

FIR DETAILS:
FIR No.: ${data.firNumber || '[FIR Number]'}
Date of FIR: ${data.firDate || '[FIR Date]'}
Police Station: ${data.policeStation || '[Police Station]'}
Sections: ${data.sections || '[IPC/Other Sections]'}

CASE DETAILS:
Nature of Case: ${data.caseNature || '[Nature of case/offense]'}
Complainant: ${data.complainant || '[Complainant Name]'}
Accused: ${data.accused || '[Accused Name if known]'}

APPLICANT'S RELATION TO CASE:
☐ Complainant
☐ Victim
☐ Legal Heir of victim
☐ Authorized representative
☐ Other: ${data.otherRelation || '[Specify]'}

REASON FOR REQUIREMENT:
${data.purpose || '[Purpose for which FIR copy is required - Court proceedings/Insurance claim/Legal advice etc.]'}

I am enclosing the following documents:
1. Copy of identity proof (Aadhaar/Voter ID/Driving License)
2. Court fee stamp/DD for Rs. ${data.feeAmount || '[Fee Amount]'}/-
3. ${data.additionalDocs || 'Any other relevant documents'}

I undertake that the information provided above is true and correct to the best of my knowledge and belief.

I request you to kindly provide me with a certified copy of the above-mentioned FIR at the earliest.

Thanking You,

Yours faithfully,

${data.applicantName || '[Applicant Name]'}
Signature: ________________
Mobile: ${data.mobile || '[Mobile Number]'}
Email: ${data.email || '[Email Address]'}

For Office Use:
Application received on: _______________
Fee received: Rs. ____________________
Receipt No.: _________________________
Copy provided on: ____________________
Signature of concerned officer: __________
`;
  };

  const generatePropertyDueDiligence = (data) => {
    return `
PROPERTY DUE DILIGENCE CHECKLIST

Property Address: ${data.propertyAddress || '[Property Address]'}
Survey No./Plot No.: ${data.surveyNumber || '[Survey Number]'}
Area: ${data.area || '[Area]'}
Property Type: ${data.propertyType || '[Residential/Commercial/Agricultural]'}

TITLE VERIFICATION CHECKLIST:

☐ 1. ORIGINAL TITLE DOCUMENTS
   - Sale Deed
   - Gift Deed
   - Partition Deed
   - Court Decree (if applicable)
   - Other: ${data.titleDocs || '[Specify]'}

☐ 2. CHAIN OF TITLE (Last 30 years)
   - Previous owner: ${data.previousOwner1 || '[Name]'}
   - Previous owner: ${data.previousOwner2 || '[Name]'}
   - Previous owner: ${data.previousOwner3 || '[Name]'}

☐ 3. ENCUMBRANCE CERTIFICATE
   - Period: ${data.encumbrancePeriod || '[Period]'}
   - Registration Office: ${data.regOffice || '[Office]'}
   - Status: ${data.encumbranceStatus || '[Clear/Pending]'}

☐ 4. SURVEY RECORDS
   - Survey Settlement Number: ${data.surveyNumber || '[Number]'}
   - Survey records match: ${data.surveyMatch || 'Yes/No'}
   - Pahani/Khata: ${data.pahani || '[Number]'}

☐ 5. MUNICIPAL/PANCHAYAT RECORDS
   - Khata Number: ${data.khataNumber || '[Number]'}
   - Property Tax: ${data.propertyTaxStatus || '[Paid/Pending]'}
   - Building Plan Approval: ${data.buildingApproval || 'Yes/No'}
   - Completion Certificate: ${data.completionCert || 'Yes/No'}

LEGAL COMPLIANCE:

☐ 6. PERMISSIONS AND APPROVALS
   - Building Plan Sanction: ${data.buildingPlan || 'Available/Not Available'}
   - Occupancy Certificate: ${data.occupancyCert || 'Available/Not Available'}
   - Environmental Clearance: ${data.envClearance || 'Required/Not Required'}
   - Fire NOC: ${data.fireNOC || 'Available/Not Available'}

☐ 7. STATUTORY CLEARANCES
   - Electricity Connection: ${data.electricityConn || 'Available/Applied'}
   - Water Connection: ${data.waterConn || 'Available/Applied'}
   - Sewerage Connection: ${data.sewerageConn || 'Available/Applied'}

☐ 8. LITIGATION CHECK
   - Civil Cases: ${data.civilCases || 'None/Pending'}
   - Criminal Cases: ${data.criminalCases || 'None/Pending'}
   - Revenue Cases: ${data.revenueCases || 'None/Pending'}

FINANCIAL VERIFICATION:

☐ 9. LOAN/MORTGAGE STATUS
   - Bank Loan: ${data.bankLoan || 'None/Pending/Cleared'}
   - Mortgage: ${data.mortgage || 'None/Exists'}
   - NOC from Bank: ${data.bankNOC || 'Required/Obtained'}

☐ 10. TAX COMPLIANCE
   - Property Tax paid till: ${data.propertyTaxTill || '[Date]'}
   - Arrears: ${data.taxArrears || 'None/Rs. [Amount]'}

PHYSICAL VERIFICATION:

☐ 11. SITE INSPECTION
   - Boundaries match documents: ${data.boundariesMatch || 'Yes/No'}
   - Access to property: ${data.propertyAccess || 'Available/Disputed'}
   - Encroachment: ${data.encroachment || 'None/Exists'}

☐ 12. NEIGHBOURHOOD VERIFICATION
   - Area development status: ${data.areaStatus || '[Status]'}
   - Connectivity: ${data.connectivity || '[Details]'}
   - Amenities: ${data.amenities || '[Available amenities]'}

RISK ASSESSMENT:

HIGH RISK FACTORS:
${data.highRiskFactors || '[Any factors that pose high risk]'}

MEDIUM RISK FACTORS:
${data.mediumRiskFactors || '[Any factors that pose medium risk]'}

LOW RISK FACTORS:
${data.lowRiskFactors || '[Any factors that pose low risk]'}

RECOMMENDATIONS:
${data.recommendations || '[Professional recommendations based on due diligence]'}

OVERALL ASSESSMENT: ${data.overallAssessment || '[Recommended/Not Recommended/Conditional]'}

Verification completed by: ${data.verifierName || '[Name]'}
Date: ${new Date().toLocaleDateString()}
Signature: ________________

Note: This is a basic checklist. Consult a qualified legal professional for comprehensive due diligence.
`;
  };

  const generateEmploymentContract = (data) => {
    return `
EMPLOYMENT AGREEMENT

This Employment Agreement is entered into on ${data.agreementDate || new Date().toLocaleDateString()} between:

EMPLOYER:
Company: ${data.companyName || '[Company Name]'}
Address: ${data.companyAddress || '[Company Address]'}
Represented by: ${data.companyRepresentative || '[Name & Designation]'}

AND

EMPLOYEE:
Name: ${data.employeeName || '[Employee Name]'}
Address: ${data.employeeAddress || '[Employee Address]'}
Contact: ${data.employeeContact || '[Mobile/Email]'}

1. POSITION AND DUTIES:
The Employee is hired for the position of ${data.designation || '[Designation]'} in the ${data.department || '[Department]'} department.

Key Responsibilities:
- ${data.responsibility1 || '[Responsibility 1]'}
- ${data.responsibility2 || '[Responsibility 2]'}
- ${data.responsibility3 || '[Responsibility 3]'}
- ${data.responsibility4 || '[Responsibility 4]'}

2. EMPLOYMENT TERMS:
Start Date: ${data.startDate || '[Start Date]'}
Employment Type: ${data.employmentType || '[Permanent/Contract/Probation]'}
Probation Period: ${data.probationPeriod || '[Duration]'} (if applicable)
Working Hours: ${data.workingHours || '[Hours per day/week]'}
Working Days: ${data.workingDays || 'Monday to Friday'}

3. COMPENSATION:
Basic Salary: Rs. ${data.basicSalary || '[Amount]'}/- per month
HRA: Rs. ${data.hra || '[Amount]'}/- per month
Special Allowance: Rs. ${data.specialAllowance || '[Amount]'}/- per month
Other Benefits: ${data.otherBenefits || '[Medical, PF, etc.]'}
Total CTC: Rs. ${data.totalCTC || '[Amount]'}/- per annum

4. LEAVE POLICY:
Annual Leave: ${data.annualLeave || '[Days]'} days per year
Sick Leave: ${data.sickLeave || '[Days]'} days per year
Casual Leave: ${data.casualLeave || '[Days]'} days per year
Maternity/Paternity Leave: As per company policy

5. CONFIDENTIALITY:
The Employee agrees to maintain strict confidentiality regarding:
- Company's business information
- Client data and records
- Technical processes and procedures
- Financial information
- Any proprietary information

6. NON-COMPETE CLAUSE:
The Employee agrees not to engage in any competing business during employment and for ${data.nonCompetePeriod || '[Duration]'} after termination.

7. TERMINATION:
Either party may terminate this agreement by giving ${data.noticePeriod || '[Notice Period]'} written notice.

Grounds for immediate termination without notice:
- Gross misconduct
- Breach of confidentiality
- Criminal conviction
- Unauthorized absence exceeding ${data.unauthorizedAbsence || '[Days]'} days

8. BENEFITS:
- Medical Insurance: ${data.medicalInsurance || '[Coverage details]'}
- Provident Fund: ${data.pf || 'As per law'}
- Gratuity: ${data.gratuity || 'As per law'}
- Other Benefits: ${data.additionalBenefits || '[Specify]'}

9. PERFORMANCE REVIEW:
Performance will be reviewed ${data.reviewFrequency || 'annually'} and increment will be based on performance and company policy.

10. GOVERNING LAW:
This agreement shall be governed by the laws of ${data.jurisdiction || '[State/Country]'}.

EMPLOYEE ACKNOWLEDGMENT:
I have read, understood, and agree to be bound by the terms and conditions of this Employment Agreement.

EMPLOYER:                           EMPLOYEE:
${data.companyName || '[Company Name]'}                    ${data.employeeName || '[Employee Name]'}

By: ${data.companyRepresentative || '[Name]'}              Signature: ________________
Designation: ${data.representativeDesignation || '[Designation]'}
Signature: ________________        Date: ${new Date().toLocaleDateString()}
Date: ${new Date().toLocaleDateString()}

WITNESS 1:                          WITNESS 2:
Name: ${data.witness1Name || '[Name]'}              Name: ${data.witness2Name || '[Name]'}
Signature: ________________        Signature: ________________
`;
  };

  const generateStartupDocuments = (data) => {
    return `
STARTUP LEGAL ESSENTIALS PACKAGE

Company Name: ${data.companyName || '[Company Name]'}
Date of Incorporation: ${data.incorporationDate || '[Date]'}

===== DOCUMENT 1: MEMORANDUM OF ASSOCIATION =====

MEMORANDUM OF ASSOCIATION OF ${data.companyName || '[COMPANY NAME]'} PRIVATE LIMITED

1. NAME CLAUSE:
The name of the Company is "${data.companyName || '[Company Name]'} Private Limited"

2. REGISTERED OFFICE CLAUSE:
The Registered Office of the Company will be situated in the State of ${data.state || '[State]'}

3. OBJECTS CLAUSE:
MAIN OBJECTS:
- ${data.mainObject1 || '[Main business object 1]'}
- ${data.mainObject2 || '[Main business object 2]'}
- ${data.mainObject3 || '[Main business object 3]'}

4. LIABILITY CLAUSE:
The liability of the members is limited by shares.

5. CAPITAL CLAUSE:
The Authorized Share Capital is Rs. ${data.authorizedCapital || '[Amount]'}/- divided into ${data.shares || '[Number]'} equity shares of Rs. ${data.shareValue || '[Value]'}/- each.

===== DOCUMENT 2: ARTICLES OF ASSOCIATION =====

ARTICLES OF ASSOCIATION OF ${data.companyName || '[COMPANY NAME]'} PRIVATE LIMITED

1. SHARE CAPITAL AND VARIATION OF RIGHTS
2. SHARE CERTIFICATES
3. LIEN ON SHARES
4. CALLS ON SHARES
5. TRANSFER OF SHARES
6. TRANSMISSION OF SHARES
7. FORFEITURE OF SHARES
8. CONVERSION OF SHARES INTO STOCK
9. ALTERATION OF CAPITAL
10. GENERAL MEETINGS
11. PROCEEDINGS AT GENERAL MEETINGS
12. VOTES OF MEMBERS
13. DIRECTORS
14. POWERS OF DIRECTORS
15. PROCEEDINGS OF DIRECTORS

===== DOCUMENT 3: FOUNDER'S AGREEMENT =====

FOUNDER'S AGREEMENT

Founders:
1. ${data.founder1Name || '[Founder 1 Name]'} - ${data.founder1Equity || '[Equity %]'}% equity
2. ${data.founder2Name || '[Founder 2 Name]'} - ${data.founder2Equity || '[Equity %]'}% equity
3. ${data.founder3Name || '[Founder 3 Name]'} - ${data.founder3Equity || '[Equity %]'}% equity

ROLES AND RESPONSIBILITIES:
Founder 1: ${data.founder1Role || '[Role and responsibilities]'}
Founder 2: ${data.founder2Role || '[Role and responsibilities]'}
Founder 3: ${data.founder3Role || '[Role and responsibilities]'}

EQUITY DISTRIBUTION:
Total authorized shares: ${data.totalShares || '[Number]'}
Founder shares: ${data.founderShares || '[Number]'}
ESOP pool: ${data.esopPool || '[Percentage]'}%
Reserved for investors: ${data.investorShares || '[Percentage]'}%

VESTING SCHEDULE:
Vesting period: ${data.vestingPeriod || '4 years'}
Cliff period: ${data.cliffPeriod || '1 year'}
Vesting frequency: ${data.vestingFrequency || 'Monthly'}

===== DOCUMENT 4: EMPLOYMENT AGREEMENTS =====

[Employment agreements for each founder/key employee - refer to employment contract template]

===== DOCUMENT 5: NON-DISCLOSURE AGREEMENT =====

NON-DISCLOSURE AGREEMENT

Between: ${data.companyName || '[Company Name]'} and ${data.recipientName || '[Recipient Name]'}

Confidential Information includes:
- Business plans and strategies
- Financial information
- Customer lists and data
- Technical specifications
- Trade secrets
- Any proprietary information

===== DOCUMENT 6: INTELLECTUAL PROPERTY ASSIGNMENT =====

All intellectual property created by founders/employees shall be assigned to the company.

===== DOCUMENT 7: COMPLIANCE CALENDAR =====

Monthly Compliance:
- PF returns filing
- ESI returns filing
- TDS returns filing
- GST returns filing

Quarterly Compliance:
- Form GSTR-1 filing
- Advance tax payment
- Board meeting

Annual Compliance:
- Annual return filing (Form MGT-7)
- Annual financial statements
- Income tax return filing
- Audit requirements

===== DOCUMENT 8: INVESTOR TERM SHEET TEMPLATE =====

TERM SHEET FOR SERIES A FUNDING

Company: ${data.companyName || '[Company Name]'}
Investment Amount: Rs. ${data.investmentAmount || '[Amount]'}
Valuation: Rs. ${data.valuation || '[Amount]'}
Investor Equity: ${data.investorEquity || '[Percentage]'}%

Key Terms:
- Liquidation Preference: ${data.liquidationPreference || '1x Non-participating'}
- Anti-dilution: ${data.antiDilution || 'Weighted average broad-based'}
- Board composition: ${data.boardComposition || '[Details]'}
- Drag-along rights: Yes
- Tag-along rights: Yes
- Right of first refusal: Yes

Note: This is a basic package. Consult qualified legal and financial professionals for detailed documentation and compliance requirements specific to your business and jurisdiction.

Generated on: ${new Date().toLocaleString()}
`;
  };

  const downloadDocument = (format) => {
    if (!generatedDocument) return;
    
    const content = generatedDocument.content;
    const filename = `${generatedDocument.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // For PDF generation, you might want to use a library like jsPDF
      alert('PDF download feature will be implemented with a PDF library');
    }
  };

  const copyToClipboard = () => {
    if (!generatedDocument) return;
    navigator.clipboard.writeText(generatedDocument.content);
    alert('Document copied to clipboard!');
  };

  const openToolDetails = (tool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const startDocumentGeneration = (tool) => {
    setSelectedTool(tool);
    setFormData({});
    setShowGeneratorForm(true);
    setIsModalOpen(false);
  };

  const renderFormFields = (toolTitle) => {
    const commonStyles = {
      input: "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      textarea: "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]",
      label: "block text-sm font-medium mb-2",
      section: "mb-6 p-4 bg-gray-50 rounded-lg"
    };

    switch (toolTitle) {
      case "RTI Application Generator":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Applicant Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Full Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.applicantName || ''} 
                    onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Relationship</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.relationship || ''} 
                    onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="S/o">Son of</option>
                    <option value="D/o">Daughter of</option>
                    <option value="W/o">Wife of</option>
                  </select>
                </div>
                <div>
                  <label className={commonStyles.label}>Guardian/Parent Name</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.guardianName || ''} 
                    onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                    placeholder="Enter guardian/parent name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Mobile Number *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.mobile || ''} 
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Complete Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.address || ''} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter your complete address"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Email Address</label>
                  <input 
                    className={commonStyles.input}
                    type="email"
                    value={formData.email || ''} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>
            
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Department Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Department/Office Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.department || ''} 
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="e.g., Municipal Corporation, Collector Office"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Office Address</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.office || ''} 
                    onChange={(e) => setFormData({...formData, office: e.target.value})}
                    placeholder="Enter office address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Information Sought</h4>
              <div className="space-y-4">
                <div>
                  <label className={commonStyles.label}>Information Required *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.informationSought || ''} 
                    onChange={(e) => setFormData({...formData, informationSought: e.target.value})}
                    placeholder="Clearly specify what information you want to obtain"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Purpose</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.purpose || ''} 
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    placeholder="Purpose for which information is sought"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={commonStyles.label}>From Date</label>
                    <input 
                      className={commonStyles.input}
                      type="date"
                      value={formData.fromDate || ''} 
                      onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={commonStyles.label}>To Date</label>
                    <input 
                      className={commonStyles.input}
                      type="date"
                      value={formData.toDate || ''} 
                      onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Police Complaint Builder":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Complainant Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Full Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.complainantName || ''} 
                    onChange={(e) => setFormData({...formData, complainantName: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Age</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.age || ''} 
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.address || ''} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Incident Details</h4>
              <div className="space-y-4">
                <div>
                  <label className={commonStyles.label}>Type of Incident *</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.incidentType || ''} 
                    onChange={(e) => setFormData({...formData, incidentType: e.target.value})}
                  >
                    <option value="">Select Incident Type</option>
                    <option value="Theft">Theft</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Assault">Assault</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={commonStyles.label}>Date of Incident *</label>
                    <input 
                      className={commonStyles.input}
                      type="date"
                      value={formData.incidentDate || ''} 
                      onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={commonStyles.label}>Time of Incident</label>
                    <input 
                      className={commonStyles.input}
                      type="time"
                      value={formData.incidentTime || ''} 
                      onChange={(e) => setFormData({...formData, incidentTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={commonStyles.label}>Police Station</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.policeStation || ''} 
                      onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
                      placeholder="Police Station Name"
                    />
                  </div>
                </div>
                <div>
                  <label className={commonStyles.label}>Place of Incident *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.incidentPlace || ''} 
                    onChange={(e) => setFormData({...formData, incidentPlace: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Detailed Description of Incident *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.incidentDescription || ''} 
                    onChange={(e) => setFormData({...formData, incidentDescription: e.target.value})}
                    placeholder="Provide detailed description of what happened"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "Consumer Court Assistant":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Complainant Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Full Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.complainantName || ''} 
                    onChange={(e) => setFormData({...formData, complainantName: e.target.value})}
                    placeholder="Enter complainant name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Mobile Number</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.mobile || ''} 
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Complete Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.complainantAddress || ''} 
                    onChange={(e) => setFormData({...formData, complainantAddress: e.target.value})}
                    placeholder="Enter complete address"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Email Address</label>
                  <input 
                    className={commonStyles.input}
                    type="email"
                    value={formData.email || ''} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Seller/Service Provider Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Company/Shop Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.sellerName || ''} 
                    onChange={(e) => setFormData({...formData, sellerName: e.target.value})}
                    placeholder="Enter seller/service provider name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Seller Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.sellerAddress || ''} 
                    onChange={(e) => setFormData({...formData, sellerAddress: e.target.value})}
                    placeholder="Enter seller complete address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Purchase Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Date of Purchase *</label>
                  <input 
                    className={commonStyles.input}
                    type="date"
                    value={formData.purchaseDate || ''} 
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Amount Paid (Rs.) *</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.amountPaid || ''} 
                    onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
                    placeholder="Enter amount paid"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Bill/Receipt Number</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.billNumber || ''} 
                    onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                    placeholder="Enter bill/receipt number"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Forum Level</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.forumLevel || ''} 
                    onChange={(e) => setFormData({...formData, forumLevel: e.target.value})}
                  >
                    <option value="">Select Forum</option>
                    <option value="District">District Consumer Forum</option>
                    <option value="State">State Consumer Commission</option>
                    <option value="National">National Consumer Commission</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Product/Service Details *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.productService || ''} 
                    onChange={(e) => setFormData({...formData, productService: e.target.value})}
                    placeholder="Describe the product or service purchased"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Complaint Details</h4>
              <div className="space-y-4">
                <div>
                  <label className={commonStyles.label}>Defect/Deficiency Description *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.defectDescription || ''} 
                    onChange={(e) => setFormData({...formData, defectDescription: e.target.value})}
                    placeholder="Describe the defect in product or deficiency in service"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Communication with Seller</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.correspondence || ''} 
                    onChange={(e) => setFormData({...formData, correspondence: e.target.value})}
                    placeholder="Describe your attempts to resolve the issue with the seller"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Compensation Amount (Rs.)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.compensationAmount || ''} 
                    onChange={(e) => setFormData({...formData, compensationAmount: e.target.value})}
                    placeholder="Enter compensation amount sought"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "Smart Rental Agreement":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Landlord Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Landlord Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.landlordName || ''} 
                    onChange={(e) => setFormData({...formData, landlordName: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Mobile Number</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.landlordMobile || ''} 
                    onChange={(e) => setFormData({...formData, landlordMobile: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Landlord Address</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.landlordAddress || ''} 
                    onChange={(e) => setFormData({...formData, landlordAddress: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Tenant Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Tenant Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.tenantName || ''} 
                    onChange={(e) => setFormData({...formData, tenantName: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Mobile Number</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.tenantMobile || ''} 
                    onChange={(e) => setFormData({...formData, tenantMobile: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Property Details</h4>
              <div className="space-y-4">
                <div>
                  <label className={commonStyles.label}>Property Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.propertyAddress || ''} 
                    onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={commonStyles.label}>Property Type</label>
                    <select 
                      className={commonStyles.input}
                      value={formData.propertyType || ''} 
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                    >
                      <option value="">Select Type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className={commonStyles.label}>Area (sq.ft.)</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.area || ''} 
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={commonStyles.label}>Furnishing</label>
                    <select 
                      className={commonStyles.input}
                      value={formData.furnishing || ''} 
                      onChange={(e) => setFormData({...formData, furnishing: e.target.value})}
                    >
                      <option value="">Select</option>
                      <option value="Furnished">Furnished</option>
                      <option value="Semi-furnished">Semi-furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Financial Terms</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={commonStyles.label}>Monthly Rent (Rs.) *</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.monthlyRent || ''} 
                    onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Security Deposit (Rs.)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.securityDeposit || ''} 
                    onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Maintenance (Rs.)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.maintenance || ''} 
                    onChange={(e) => setFormData({...formData, maintenance: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "Will & Testament Creator":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Testator Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Full Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.testatorName || ''} 
                    onChange={(e) => setFormData({...formData, testatorName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Age</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.age || ''} 
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Relationship</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.relationship || ''} 
                    onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="S/o">Son of</option>
                    <option value="D/o">Daughter of</option>
                    <option value="W/o">Wife of</option>
                  </select>
                </div>
                <div>
                  <label className={commonStyles.label}>Parent/Spouse Name</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.parentName || ''} 
                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    placeholder="Enter parent/spouse name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Complete Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.address || ''} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Executor Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Executor Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.executorName || ''} 
                    onChange={(e) => setFormData({...formData, executorName: e.target.value})}
                    placeholder="Enter executor name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Relation to You</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.executorRelation || ''} 
                    onChange={(e) => setFormData({...formData, executorRelation: e.target.value})}
                    placeholder="e.g., Son, Brother, Friend"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Executor Address</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.executorAddress || ''} 
                    onChange={(e) => setFormData({...formData, executorAddress: e.target.value})}
                    placeholder="Enter executor's address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Beneficiaries</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={commonStyles.label}>Beneficiary 1 Name</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.beneficiary1Name || ''} 
                      onChange={(e) => setFormData({...formData, beneficiary1Name: e.target.value})}
                      placeholder="Enter beneficiary name"
                    />
                  </div>
                  <div>
                    <label className={commonStyles.label}>Relation</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.beneficiary1Relation || ''} 
                      onChange={(e) => setFormData({...formData, beneficiary1Relation: e.target.value})}
                      placeholder="e.g., Son, Daughter, Wife"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={commonStyles.label}>Beneficiary 2 Name</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.beneficiary2Name || ''} 
                      onChange={(e) => setFormData({...formData, beneficiary2Name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={commonStyles.label}>Relation</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.beneficiary2Relation || ''} 
                      onChange={(e) => setFormData({...formData, beneficiary2Relation: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={commonStyles.label}>Beneficiary 3 Name</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.beneficiary3Name || ''} 
                      onChange={(e) => setFormData({...formData, beneficiary3Name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className={commonStyles.label}>Relation</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.beneficiary3Relation || ''} 
                      onChange={(e) => setFormData({...formData, beneficiary3Relation: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Asset Distribution</h4>
              <div className="space-y-4">
                <div>
                  <label className={commonStyles.label}>Property 1 Description</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.property1Description || ''} 
                    onChange={(e) => setFormData({...formData, property1Description: e.target.value})}
                    placeholder="Describe the property (address, type, etc.)"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={commonStyles.label}>Property 1 Beneficiary</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.property1Beneficiary || ''} 
                      onChange={(e) => setFormData({...formData, property1Beneficiary: e.target.value})}
                      placeholder="Who will inherit this property"
                    />
                  </div>
                  <div>
                    <label className={commonStyles.label}>Share/Percentage</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.property1Share || ''} 
                      onChange={(e) => setFormData({...formData, property1Share: e.target.value})}
                      placeholder="e.g., 100%, 50%, etc."
                    />
                  </div>
                </div>
                <div>
                  <label className={commonStyles.label}>Bank Account Details</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.bankDetails || ''} 
                    onChange={(e) => setFormData({...formData, bankDetails: e.target.value})}
                    placeholder="List your bank accounts with bank names and account numbers"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Bank Accounts Beneficiary</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.bankBeneficiary || ''} 
                    onChange={(e) => setFormData({...formData, bankBeneficiary: e.target.value})}
                    placeholder="Who will inherit bank accounts"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Witnesses</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Witness 1 Name</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.witness1Name || ''} 
                    onChange={(e) => setFormData({...formData, witness1Name: e.target.value})}
                    placeholder="Enter witness 1 name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Witness 1 Address</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.witness1Address || ''} 
                    onChange={(e) => setFormData({...formData, witness1Address: e.target.value})}
                    placeholder="Enter witness 1 address"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Witness 2 Name</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.witness2Name || ''} 
                    onChange={(e) => setFormData({...formData, witness2Name: e.target.value})}
                    placeholder="Enter witness 2 name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Witness 2 Address</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.witness2Address || ''} 
                    onChange={(e) => setFormData({...formData, witness2Address: e.target.value})}
                    placeholder="Enter witness 2 address"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "Legal Notice Generator":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Sender Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Your Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.senderName || ''} 
                    onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Your Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.senderAddress || ''} 
                    onChange={(e) => setFormData({...formData, senderAddress: e.target.value})}
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Recipient Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Recipient Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.recipientName || ''} 
                    onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                    placeholder="Enter recipient name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Recipient Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.recipientAddress || ''} 
                    onChange={(e) => setFormData({...formData, recipientAddress: e.target.value})}
                    placeholder="Enter recipient's complete address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Legal Matter Details</h4>
              <div className="space-y-4">
                <div>
                  <label className={commonStyles.label}>Facts of the Case *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.factOfCase || ''} 
                    onChange={(e) => setFormData({...formData, factOfCase: e.target.value})}
                    placeholder="Describe the detailed facts of your case"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Cause of Action *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.causeOfAction || ''} 
                    onChange={(e) => setFormData({...formData, causeOfAction: e.target.value})}
                    placeholder="Explain what events led to this legal notice"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Legal Position</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.legalPosition || ''} 
                    onChange={(e) => setFormData({...formData, legalPosition: e.target.value})}
                    placeholder="Explain your legal rights and basis"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Demand/Action Required *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.demandAction || ''} 
                    onChange={(e) => setFormData({...formData, demandAction: e.target.value})}
                    placeholder="What specific action do you want the recipient to take?"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={commonStyles.label}>Notice Period (days)</label>
                    <select 
                      className={commonStyles.input}
                      value={formData.noticePeriod || ''} 
                      onChange={(e) => setFormData({...formData, noticePeriod: e.target.value})}
                    >
                      <option value="">Select Period</option>
                      <option value="7">7 days</option>
                      <option value="15">15 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                    </select>
                  </div>
                  <div>
                    <label className={commonStyles.label}>Place</label>
                    <input 
                      className={commonStyles.input}
                      value={formData.place || ''} 
                      onChange={(e) => setFormData({...formData, place: e.target.value})}
                      placeholder="Enter place/city"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Advocate Information (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Advocate Name</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.advocateName || ''} 
                    onChange={(e) => setFormData({...formData, advocateName: e.target.value})}
                    placeholder="Enter advocate name (if applicable)"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Bar Council Number</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.barCouncilNo || ''} 
                    onChange={(e) => setFormData({...formData, barCouncilNo: e.target.value})}
                    placeholder="Enter bar council number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Advocate Address</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.advocateAddress || ''} 
                    onChange={(e) => setFormData({...formData, advocateAddress: e.target.value})}
                    placeholder="Enter advocate's address"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "FIR Copy Application":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Applicant Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Full Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.applicantName || ''} 
                    onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Age</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.age || ''} 
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Mobile Number</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.mobile || ''} 
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Email Address</label>
                  <input 
                    className={commonStyles.input}
                    type="email"
                    value={formData.email || ''} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Complete Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.address || ''} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>FIR Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>FIR Number *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.firNumber || ''} 
                    onChange={(e) => setFormData({...formData, firNumber: e.target.value})}
                    placeholder="Enter FIR number"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Date of FIR *</label>
                  <input 
                    className={commonStyles.input}
                    type="date"
                    value={formData.firDate || ''} 
                    onChange={(e) => setFormData({...formData, firDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Police Station *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.policeStation || ''} 
                    onChange={(e) => setFormData({...formData, policeStation: e.target.value})}
                    placeholder="Enter police station name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>IPC Sections</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.sections || ''} 
                    onChange={(e) => setFormData({...formData, sections: e.target.value})}
                    placeholder="e.g., IPC 379, 420"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Police Station Address</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.policeStationAddress || ''} 
                    onChange={(e) => setFormData({...formData, policeStationAddress: e.target.value})}
                    placeholder="Enter police station address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Case Information</h4>
              <div className="space-y-4">
                <div>
                  <label className={commonStyles.label}>Nature of Case *</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.caseNature || ''} 
                    onChange={(e) => setFormData({...formData, caseNature: e.target.value})}
                  >
                    <option value="">Select Case Type</option>
                    <option value="Theft">Theft</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Assault">Assault</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={commonStyles.label}>Complainant Name</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.complainant || ''} 
                    onChange={(e) => setFormData({...formData, complainant: e.target.value})}
                    placeholder="Enter complainant name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Accused Name (if known)</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.accused || ''} 
                    onChange={(e) => setFormData({...formData, accused: e.target.value})}
                    placeholder="Enter accused name if known"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Purpose for FIR Copy *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.purpose || ''} 
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    placeholder="e.g., Court proceedings, Insurance claim, Legal advice"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Relationship to Case</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.relationToCase || ''} 
                    onChange={(e) => setFormData({...formData, relationToCase: e.target.value})}
                  >
                    <option value="">Select</option>
                    <option value="Complainant">Complainant</option>
                    <option value="Victim">Victim</option>
                    <option value="Legal Heir">Legal Heir of victim</option>
                    <option value="Authorized Representative">Authorized Representative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "Property Due Diligence Kit":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Property Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Property Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.propertyAddress || ''} 
                    onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
                    placeholder="Enter complete property address"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Survey/Plot Number</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.surveyNumber || ''} 
                    onChange={(e) => setFormData({...formData, surveyNumber: e.target.value})}
                    placeholder="Enter survey/plot number"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Area</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.area || ''} 
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    placeholder="Enter area (sq.ft/acres)"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Property Type</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.propertyType || ''} 
                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className={commonStyles.label}>Khata Number</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.khataNumber || ''} 
                    onChange={(e) => setFormData({...formData, khataNumber: e.target.value})}
                    placeholder="Enter khata number"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Current Owner Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Current Owner Name</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.currentOwner || ''} 
                    onChange={(e) => setFormData({...formData, currentOwner: e.target.value})}
                    placeholder="Enter current owner name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Previous Owner 1</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.previousOwner1 || ''} 
                    onChange={(e) => setFormData({...formData, previousOwner1: e.target.value})}
                    placeholder="Enter previous owner name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Previous Owner 2</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.previousOwner2 || ''} 
                    onChange={(e) => setFormData({...formData, previousOwner2: e.target.value})}
                    placeholder="Enter previous owner name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Registration Office</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.regOffice || ''} 
                    onChange={(e) => setFormData({...formData, regOffice: e.target.value})}
                    placeholder="Enter registration office name"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Verification Status</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={commonStyles.label}>Encumbrance Status</label>
                    <select 
                      className={commonStyles.input}
                      value={formData.encumbranceStatus || ''} 
                      onChange={(e) => setFormData({...formData, encumbranceStatus: e.target.value})}
                    >
                      <option value="">Select Status</option>
                      <option value="Clear">Clear</option>
                      <option value="Pending">Pending</option>
                      <option value="Issues Found">Issues Found</option>
                    </select>
                  </div>
                  <div>
                    <label className={commonStyles.label}>Property Tax Status</label>
                    <select 
                      className={commonStyles.input}
                      value={formData.propertyTaxStatus || ''} 
                      onChange={(e) => setFormData({...formData, propertyTaxStatus: e.target.value})}
                    >
                      <option value="">Select Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Arrears">Arrears</option>
                    </select>
                  </div>
                  <div>
                    <label className={commonStyles.label}>Building Approval</label>
                    <select 
                      className={commonStyles.input}
                      value={formData.buildingApproval || ''} 
                      onChange={(e) => setFormData({...formData, buildingApproval: e.target.value})}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className={commonStyles.label}>Litigation Status</label>
                    <select 
                      className={commonStyles.input}
                      value={formData.litigationStatus || ''} 
                      onChange={(e) => setFormData({...formData, litigationStatus: e.target.value})}
                    >
                      <option value="">Select</option>
                      <option value="None">None</option>
                      <option value="Pending Cases">Pending Cases</option>
                      <option value="Cleared">Cleared</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={commonStyles.label}>Verification Notes</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.verificationNotes || ''} 
                    onChange={(e) => setFormData({...formData, verificationNotes: e.target.value})}
                    placeholder="Enter any additional verification notes or observations"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Risk Assessment</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.riskAssessment || ''} 
                    onChange={(e) => setFormData({...formData, riskAssessment: e.target.value})}
                  >
                    <option value="">Select Risk Level</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "Employment Contract Builder":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Company Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Company Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.companyName || ''} 
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Company Representative</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.companyRepresentative || ''} 
                    onChange={(e) => setFormData({...formData, companyRepresentative: e.target.value})}
                    placeholder="Enter representative name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Company Address *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.companyAddress || ''} 
                    onChange={(e) => setFormData({...formData, companyAddress: e.target.value})}
                    placeholder="Enter company address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Employee Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Employee Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.employeeName || ''} 
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                    placeholder="Enter employee name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Contact Number</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.employeeContact || ''} 
                    onChange={(e) => setFormData({...formData, employeeContact: e.target.value})}
                    placeholder="Enter mobile/email"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={commonStyles.label}>Employee Address</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.employeeAddress || ''} 
                    onChange={(e) => setFormData({...formData, employeeAddress: e.target.value})}
                    placeholder="Enter employee address"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Job Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Designation *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.designation || ''} 
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    placeholder="Enter job designation"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Department</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.department || ''} 
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Start Date</label>
                  <input 
                    className={commonStyles.input}
                    type="date"
                    value={formData.startDate || ''} 
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Employment Type</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.employmentType || ''} 
                    onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Probation">Probation</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
                <div>
                  <label className={commonStyles.label}>Working Hours</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.workingHours || ''} 
                    onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                    placeholder="e.g., 8 hours/day, 40 hours/week"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Probation Period</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.probationPeriod || ''} 
                    onChange={(e) => setFormData({...formData, probationPeriod: e.target.value})}
                    placeholder="e.g., 6 months"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Compensation Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={commonStyles.label}>Basic Salary (Rs.)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.basicSalary || ''} 
                    onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                    placeholder="Enter basic salary"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>HRA (Rs.)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.hra || ''} 
                    onChange={(e) => setFormData({...formData, hra: e.target.value})}
                    placeholder="Enter HRA amount"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Total CTC (Rs.)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.totalCTC || ''} 
                    onChange={(e) => setFormData({...formData, totalCTC: e.target.value})}
                    placeholder="Enter total CTC"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className={commonStyles.label}>Other Benefits</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.otherBenefits || ''} 
                    onChange={(e) => setFormData({...formData, otherBenefits: e.target.value})}
                    placeholder="e.g., Medical insurance, PF, Gratuity, etc."
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Leave & Notice Period</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={commonStyles.label}>Annual Leave (days)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.annualLeave || ''} 
                    onChange={(e) => setFormData({...formData, annualLeave: e.target.value})}
                    placeholder="Enter annual leave days"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Sick Leave (days)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.sickLeave || ''} 
                    onChange={(e) => setFormData({...formData, sickLeave: e.target.value})}
                    placeholder="Enter sick leave days"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Notice Period</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.noticePeriod || ''} 
                    onChange={(e) => setFormData({...formData, noticePeriod: e.target.value})}
                    placeholder="e.g., 30 days, 2 months"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "Startup Legal Essentials":
        return (
          <div className="space-y-6">
            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Company Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Company Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.companyName || ''} 
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Date of Incorporation</label>
                  <input 
                    className={commonStyles.input}
                    type="date"
                    value={formData.incorporationDate || ''} 
                    onChange={(e) => setFormData({...formData, incorporationDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>State of Incorporation</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.state || ''} 
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Authorized Capital (Rs.)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.authorizedCapital || ''} 
                    onChange={(e) => setFormData({...formData, authorizedCapital: e.target.value})}
                    placeholder="Enter authorized capital"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Business Objects</h4>
              <div className="space-y-4">
                <div>
                  <label className={commonStyles.label}>Main Business Object 1 *</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.mainObject1 || ''} 
                    onChange={(e) => setFormData({...formData, mainObject1: e.target.value})}
                    placeholder="Describe your primary business activity"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Main Business Object 2</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.mainObject2 || ''} 
                    onChange={(e) => setFormData({...formData, mainObject2: e.target.value})}
                    placeholder="Describe your secondary business activity"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Main Business Object 3</label>
                  <textarea 
                    className={commonStyles.textarea}
                    value={formData.mainObject3 || ''} 
                    onChange={(e) => setFormData({...formData, mainObject3: e.target.value})}
                    placeholder="Describe another business activity"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Founder Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={commonStyles.label}>Founder 1 Name *</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.founder1Name || ''} 
                    onChange={(e) => setFormData({...formData, founder1Name: e.target.value})}
                    placeholder="Enter founder 1 name"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Equity %</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.founder1Equity || ''} 
                    onChange={(e) => setFormData({...formData, founder1Equity: e.target.value})}
                    placeholder="Enter equity percentage"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Role</label>
                  <input 
                    className={commonStyles.input}
                    value={formData.founder1Role || ''} 
                    onChange={(e) => setFormData({...formData, founder1Role: e.target.value})}
                    placeholder="Enter role/designation"
                  />
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Equity & Vesting</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Total Authorized Shares</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.totalShares || ''} 
                    onChange={(e) => setFormData({...formData, totalShares: e.target.value})}
                    placeholder="Enter total shares"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>ESOP Pool (%)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.esopPool || ''} 
                    onChange={(e) => setFormData({...formData, esopPool: e.target.value})}
                    placeholder="Enter ESOP percentage"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Vesting Period</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.vestingPeriod || ''} 
                    onChange={(e) => setFormData({...formData, vestingPeriod: e.target.value})}
                  >
                    <option value="">Select Period</option>
                    <option value="3 years">3 years</option>
                    <option value="4 years">4 years</option>
                    <option value="5 years">5 years</option>
                  </select>
                </div>
                <div>
                  <label className={commonStyles.label}>Cliff Period</label>
                  <select 
                    className={commonStyles.input}
                    value={formData.cliffPeriod || ''} 
                    onChange={(e) => setFormData({...formData, cliffPeriod: e.target.value})}
                  >
                    <option value="">Select Cliff</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={commonStyles.section}>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#1f2839' }}>Investment Details (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={commonStyles.label}>Expected Investment Amount (Rs.)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.investmentAmount || ''} 
                    onChange={(e) => setFormData({...formData, investmentAmount: e.target.value})}
                    placeholder="Enter expected investment"
                  />
                </div>
                <div>
                  <label className={commonStyles.label}>Pre-money Valuation (Rs.)</label>
                  <input 
                    className={commonStyles.input}
                    type="number"
                    value={formData.valuation || ''} 
                    onChange={(e) => setFormData({...formData, valuation: e.target.value})}
                    placeholder="Enter company valuation"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold mb-2">Form Coming Soon</h3>
            <p className="text-gray-600">
              The form for this tool is being developed. Please check back later.
            </p>
          </div>
        );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ⭐
          </span>
        ))}
        <span className="text-xs ml-1" style={{ color: '#6b7280' }}>{rating}</span>
      </div>
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': 
        return 'border font-medium';
      case 'Intermediate': 
        return 'border font-medium';
      case 'Advanced': 
        return 'border font-medium';
      default: 
        return 'border font-medium';
    }
  };

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': 
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          borderColor: 'rgba(16, 185, 129, 0.3)'
        };
      case 'Intermediate': 
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          borderColor: 'rgba(245, 158, 11, 0.3)'
        };
      case 'Advanced': 
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          borderColor: 'rgba(239, 68, 68, 0.3)'
        };
      default: 
        return {
          backgroundColor: 'rgba(182, 157, 116, 0.15)',
          color: '#6b7280',
          borderColor: 'rgba(182, 157, 116, 0.3)'
        };
    }
  };

  return (
    <section 
      className="relative py-24 overflow-hidden"
      style={{ 
        backgroundColor: '#f5f5ef',
        backgroundImage: 'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Enhanced background with legal-themed elements */}
      <div className="absolute inset-0">
        {/* Background overlay for readability */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(245, 245, 239, 0.85)' }}></div>
        
        {/* Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
        
        {/* Animated Background Elements */}
        <div 
          className="absolute top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{
            background: `linear-gradient(135deg, rgba(182, 157, 116, 0.2), rgba(182, 157, 116, 0.1))`
          }}
        ></div>
        <div 
          className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: `linear-gradient(135deg, rgba(182, 157, 116, 0.15), rgba(182, 157, 116, 0.08))`
          }}
        ></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30m-20 0a20 20 0 1 1 40 0a20 20 0 1 1 -40 0'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-6 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div 
            className="inline-flex items-center rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6 border"
            style={{
              background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.15) 0%, rgba(182, 157, 116, 0.25) 100%)',
              borderColor: 'rgba(182, 157, 116, 0.4)',
              color: '#b69d74'
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-sm md:text-base">Professional Legal Tools</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6" style={{ color: '#1f2839' }}>
            Free Legal Document Templates
            <span className="block text-xl md:text-3xl mt-2" style={{ color: '#6b7280' }}>Professional-Grade Legal Solutions</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4" style={{ color: '#6b7280' }}>
            Access our comprehensive collection of legal document templates, guides, and automated generators. 
            Create professional legal documents in minutes with 
            <span style={{ color: '#b69d74', fontWeight: '600' }}>AI-powered assistance</span> and legal compliance verification.
          </p>
        </div>

        {/* Search and Controls */}
        <div 
          className="rounded-2xl p-4 md:p-8 mb-8 shadow-sm border"
          style={{
            background: 'rgba(255, 255, 255, 0.80)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(182, 157, 116, 0.3)',
            boxShadow: '0 6px 25px rgba(31, 40, 57, 0.12)'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 md:gap-6">
            
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2" style={{ color: '#6b7280' }}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search templates, categories, or keywords..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl border transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.60)',
                    borderColor: 'rgba(182, 157, 116, 0.3)',
                    color: '#1f2839'
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.90)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.60)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(182, 157, 116, 0.2)',
                      color: '#6b7280'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.4)';
                      e.target.style.color = '#1f2839';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.2)';
                      e.target.style.color = '#6b7280';
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              
              {/* Sort Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 md:px-4 py-3 rounded-xl border transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.60)',
                  borderColor: 'rgba(182, 157, 116, 0.3)',
                  color: '#1f2839'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.90)';
                  e.target.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.60)';
                  e.target.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                }}
              >
                <option value="default">Sort by Default</option>
                <option value="popularity">Sort by Popularity</option>
                <option value="name">Sort by Name</option>
                <option value="uses">Sort by Usage</option>
                <option value="rating">Sort by Rating</option>
                <option value="newest">Sort by Newest</option>
              </select>
              
              {/* Clear Filters */}
              <button 
                onClick={clearAllFilters}
                className="px-4 md:px-6 py-3 border rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.60)',
                  borderColor: 'rgba(182, 157, 116, 0.3)',
                  color: '#1f2839'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.90)';
                  e.target.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.60)';
                  e.target.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-1V5a1 1 0 100-2V3a2 2 0 00-2-2H6a2 2 0 00-2 2v2z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg font-semibold" style={{ color: '#1f2839' }}>Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'text-white border-transparent shadow-lg'
                    : 'hover:shadow-sm'
                }`}
                style={{
                  background: selectedCategory === category.id
                    ? 'linear-gradient(135deg, #b69d74 0%, #b69d74 100%)'
                    : 'rgba(255, 255, 255, 0.80)',
                  color: selectedCategory === category.id ? '#ffffff' : '#1f2839',
                  borderColor: selectedCategory === category.id ? 'transparent' : 'rgba(182, 157, 116, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.90)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.80)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                  }
                }}
              >
                {category.name}
                {category.id !== "All" && (
                  <span className={`ml-2 text-xs rounded-full px-2 py-1 ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-600'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(182, 157, 116, 0.15)'
                  }}
                  >
                    {templates.filter(tool => tool.categoryId === category.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div style={{ color: '#6b7280' }}>
            {loading ? (
              <span>Loading templates...</span>
            ) : error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <span>
                Showing <span className="font-semibold" style={{ color: '#1f2839' }}>{filteredTools.length}</span> of{' '}
                <span className="font-semibold" style={{ color: '#1f2839' }}>{templates.length}</span> templates
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm" style={{ color: '#6b7280' }}>
              <input
                type="checkbox"
                checked={showOnlyFree}
                onChange={(e) => setShowOnlyFree(e.target.checked)}
                className="rounded border-2 focus:ring-2"
                style={{
                  borderColor: 'rgba(182, 157, 116, 0.4)',
                  accentColor: '#b69d74'
                }}
              />
              Free Templates Only
            </label>
          </div>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center animate-spin" style={{ backgroundColor: 'rgba(182, 157, 116, 0.2)', color: '#b69d74' }}>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 0110 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 3a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm0 8a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold" style={{ color: '#1f2839' }}>Loading Templates...</h3>
          </div>
        ) : error ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: 'rgba(255, 255, 255, 0.80)', backdropFilter: 'blur(10px)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 10 110-16 8 8 0 010 16zm-1-9a1 1 0 00-2 0v2a1 1 0 102 0V9zm0 4a1 1 0 100 2h.01a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#1f2839' }}>Error Loading Templates</h3>
            <p className="mb-8 text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()} // Simple reload to retry
              className="px-8 py-3 rounded-xl transition-all duration-300 border"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.25) 100%)',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #ef4444 100%)';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.25) 100%)';
                e.target.style.color = '#ef4444';
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-2xl p-4 md:p-6 border hover:shadow-md transition-all duration-300 cursor-pointer group shadow-sm"
                onClick={() => openToolDetails(tool)}
                style={{
                  background: 'rgba(255, 255, 255, 0.80)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(182, 157, 116, 0.3)',
                  boxShadow: '0 6px 25px rgba(31, 40, 57, 0.12)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
                  e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(31, 40, 57, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                  e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(31, 40, 57, 0.12)';
                }}
              >
                {/* Tool Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(182, 157, 116, 0.2)',
                          color: '#b69d74'
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {/* Assuming 'isNew' and 'premium' are properties from the API response */}
                      {tool.isNew && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full border font-medium"
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            borderColor: 'rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          New
                        </span>
                      )}
                      {!tool.isFree && ( // Assuming 'premium' means not free
                        <span 
                          className="text-xs px-2 py-1 rounded-full border font-medium"
                          style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                            color: '#f59e0b',
                            borderColor: 'rgba(245, 158, 11, 0.3)'
                          }}
                        >
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:transition-colors" style={{ color: '#1f2839' }}>
                      {tool.title}
                    </h3>
                    <p className="text-xs md:text-sm mb-1" style={{ color: '#b69d74' }}>{tool.category ? tool.category.name : 'N/A'}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm mb-4 line-clamp-3" style={{ color: '#6b7280' }}>
                  {tool.description}
                </p>

                {/* Metadata */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span 
                      className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(tool.difficulty)}`}
                      style={getDifficultyStyle(tool.difficulty)}
                    >
                      {tool.difficulty}
                    </span>
                    {renderStarRating(tool.rating)}
                  </div>

                  <div className="flex items-center justify-between text-xs" style={{ color: '#6b7280' }}>
                    <span>{tool.completionTimeMin ? `${tool.completionTimeMin} min` : 'N/A'}</span>
                    <span>{tool.successRatePct ? `${tool.successRatePct}% success` : 'N/A'}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(182, 157, 116, 0.3)' }}>
                  <button 
                    onClick={() => startDocumentGeneration(tool)}
                    className="w-full py-3 rounded-xl transition-all duration-300 font-semibold border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.15) 0%, rgba(182, 157, 116, 0.25) 100%)',
                      color: '#1f2839',
                      borderColor: 'rgba(182, 157, 116, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #b69d74 0%, #b69d74 100%)';
                      e.target.style.color = '#ffffff';
                      e.target.style.boxShadow = '0 6px 20px rgba(182, 157, 116, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(182, 157, 116, 0.15) 0%, rgba(182, 157, 116, 0.25) 100%)';
                      e.target.style.color = '#1f2839';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Generate Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredTools.length === 0 && !loading && !error && (
          <div 
            className="text-center py-16 rounded-2xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.80)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(182, 157, 116, 0.3)'
            }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(182, 157, 116, 0.2)' }}>
              <svg className="w-8 h-8" style={{ color: '#b69d74' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#1f2839' }}>No Templates Found</h3>
            <p className="mb-8" style={{ color: '#6b7280' }}>
              Try adjusting your search criteria or browse our categories.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-8 py-3 rounded-xl transition-all duration-300 border"
              style={{
                background: 'linear-gradient(135deg, rgba(182, 157, 116, 0.15) 0%, rgba(182, 157, 116, 0.25) 100%)',
                color: '#1f2839',
                borderColor: 'rgba(182, 157, 116, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #b69d74 0%, #b69d74 100%)';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(182, 157, 116, 0.15) 0%, rgba(182, 157, 116, 0.25) 100%)';
                e.target.style.color = '#1f2839';
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Call to Action removed per request */}
      </div>

      {/* Modal */}
      {isModalOpen && selectedTool && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(31, 40, 57, 0.6)' }}>
          <div 
            className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl border"
            style={{
              background: 'rgba(245, 245, 239, 0.95)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(182, 157, 116, 0.4)',
              boxShadow: '0 25px 50px rgba(31, 40, 57, 0.25)'
            }}
          >
            <div className="p-6 md:p-8">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#1f2839' }}>{selectedTool.title}</h2>
                  <p style={{ color: '#b69d74' }}>{selectedTool.label}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-2xl p-2 rounded-full transition-all duration-200 flex-shrink-0"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.15)';
                    e.target.style.color = '#1f2839';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3" style={{ color: '#1f2839' }}>Description</h3>
                  <p className="text-sm md:text-base" style={{ color: '#6b7280' }}>{selectedTool.description}</p>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3" style={{ color: '#1f2839' }}>Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedTool.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm md:text-base" style={{ color: '#6b7280' }}>
                        <span className="mr-2 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div 
                    className="rounded-xl p-4 border"
                    style={{
                      background: 'rgba(255, 255, 255, 0.60)',
                      borderColor: 'rgba(182, 157, 116, 0.3)'
                    }}
                  >
                    <div className="text-xl md:text-2xl font-bold" style={{ color: '#1f2839' }}>{selectedTool.timeEstimate}</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>Completion Time</div>
                  </div>
                  <div 
                    className="rounded-xl p-4 border"
                    style={{
                      background: 'rgba(255, 255, 255, 0.60)',
                      borderColor: 'rgba(182, 157, 116, 0.3)'
                    }}
                  >
                    <div className="text-xl md:text-2xl font-bold" style={{ color: '#10b981' }}>{selectedTool.successRate}%</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>Success Rate</div>
                  </div>
                  <div 
                    className="rounded-xl p-4 border"
                    style={{
                      background: 'rgba(255, 255, 255, 0.60)',
                      borderColor: 'rgba(182, 157, 116, 0.3)'
                    }}
                  >
                    <div className="text-xl md:text-2xl font-bold" style={{ color: '#1f2839' }}>{selectedTool.uses.toLocaleString()}</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>Total Uses</div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button 
                    onClick={() => startDocumentGeneration(selectedTool)}
                    className="flex-1 py-3 md:py-4 rounded-xl font-semibold transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #b69d74 0%, #b69d74 100%)',
                      color: '#ffffff',
                      boxShadow: '0 6px 20px rgba(182, 157, 116, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 30px rgba(182, 157, 116, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(182, 157, 116, 0.4)';
                    }}
                  >
                    Start Creating Document
                  </button>
                  <button 
                    onClick={closeModal}
                    className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold border transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.60)',
                      color: '#1f2839',
                      borderColor: 'rgba(182, 157, 116, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.90)';
                      e.target.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.60)';
                      e.target.style.borderColor = 'rgba(182, 157, 116, 0.4)';
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Generator Form Modal */}
      {showGeneratorForm && selectedTool && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(31, 40, 57, 0.6)' }}>
          <div 
            className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl border"
            style={{
              background: 'rgba(245, 245, 239, 0.95)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(182, 157, 116, 0.4)',
              boxShadow: '0 25px 50px rgba(31, 40, 57, 0.25)'
            }}
          >
            <div className="p-6 md:p-8">
              {/* Form Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#1f2839' }}>
                    Generate {selectedTool.title}
                  </h2>
                  <p style={{ color: '#b69d74' }}>Fill in the details to generate your customized document</p>
                </div>
                <button
                  onClick={() => setShowGeneratorForm(false)}
                  className="text-2xl p-2 rounded-full transition-all duration-200 flex-shrink-0"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.15)';
                    e.target.style.color = '#1f2839';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Dynamic Form */}
              <div className="mb-8">
                {renderFormFields(selectedTool.title)}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t" style={{ borderColor: 'rgba(182, 157, 116, 0.3)' }}>
                <button 
                  onClick={() => generateDocument(selectedTool.id, formData)}
                  disabled={isGenerating}
                  className="flex-1 py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #b69d74 0%, #b69d74 100%)',
                    color: '#ffffff',
                    boxShadow: '0 6px 20px rgba(182, 157, 116, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isGenerating) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 30px rgba(182, 157, 116, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isGenerating) {
                      e.target.style.transform = 'translateY(0px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(182, 157, 116, 0.4)';
                    }
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Document'}
                </button>
                <button 
                  onClick={() => setShowGeneratorForm(false)}
                  className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold border transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.60)',
                    color: '#1f2839',
                    borderColor: 'rgba(182, 157, 116, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.90)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.60)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.4)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {generatedDocument && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(31, 40, 57, 0.6)' }}>
          <div 
            className="rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-xl border"
            style={{
              background: 'rgba(245, 245, 239, 0.95)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(182, 157, 116, 0.4)',
              boxShadow: '0 25px 50px rgba(31, 40, 57, 0.25)'
            }}
          >
            <div className="p-6 md:p-8">
              {/* Preview Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#1f2839' }}>
                    {generatedDocument.title}
                  </h2>
                  <p style={{ color: '#b69d74' }}>Generated on {generatedDocument.generatedAt}</p>
                </div>
                <button
                  onClick={() => setGeneratedDocument(null)}
                  className="text-2xl p-2 rounded-full transition-all duration-200 flex-shrink-0"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(182, 157, 116, 0.15)';
                    e.target.style.color = '#1f2839';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Document Content */}
              <div 
                className="bg-white rounded-lg p-6 mb-6 max-h-[50vh] overflow-y-auto border"
                style={{ 
                  borderColor: 'rgba(182, 157, 116, 0.3)',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}
              >
                {generatedDocument.content}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-6 border-t" style={{ borderColor: 'rgba(182, 157, 116, 0.3)' }}>
                <button 
                  onClick={copyToClipboard}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 border"
                  style={{
                    background: 'rgba(255, 255, 255, 0.60)',
                    color: '#1f2839',
                    borderColor: 'rgba(182, 157, 116, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.90)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.60)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.4)';
                  }}
                >
                  📋 Copy to Clipboard
                </button>
                <button 
                  onClick={() => downloadDocument('txt')}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #b69d74 0%, #b69d74 100%)',
                    color: '#ffffff',
                    boxShadow: '0 6px 20px rgba(182, 157, 116, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 30px rgba(182, 157, 116, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(182, 157, 116, 0.4)';
                  }}
                >
                  📄 Download as Text
                </button>
                <button 
                  onClick={() => {
                    setGeneratedDocument(null);
                    setSelectedTool(null);
                    setFormData({});
                  }}
                  className="px-6 py-3 rounded-xl font-semibold border transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.60)',
                    color: '#1f2839',
                    borderColor: 'rgba(182, 157, 116, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.90)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.60)';
                    e.target.style.borderColor = 'rgba(182, 157, 116, 0.4)';
                  }}
                >
                  Create Another Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FreeTools;
