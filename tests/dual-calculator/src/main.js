const SectorService = require("./SectorService");
const CertificateService = require("./CertificateService");
const DualCalculator = require("./DualCalculator");

const sectorService = new SectorService();
let certificateService;  

async function fetchData() {
    await sectorService.fetchSectorsFromAPI();

    // Initialize the certificateService after fetching sectors
    certificateService = new CertificateService(sectorService);
    await certificateService.fetchCertificatesFromAPI();
}

async function main() {
    await fetchData();
    const calculator = new DualCalculator(
        {year: 2023, month: 6},
        {year: 2024, month: 2},
        2, 
        3, 
        2000000, 
        250, 
        100000
    );
    const taxRefund = await calculator.getTaxRefund(certificateService);
    console.log(`Tax Refund: ${taxRefund}`);

    const salaryCost = calculator.getSalaryCost();
    console.log(`Salary Cost: ${salaryCost}`);
}

main();

