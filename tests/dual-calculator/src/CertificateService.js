class Certificate {
    constructor(id, name, sectorId) {
        this.id = id;
        this.name = name;
        this.sectorId = sectorId;
        this.sector = null;
    }
}

class CertificateService {
    constructor(sectorService) {
        this.certificates = [];
        this.sectorService = sectorService;
    }

    async fetchCertificatesFromAPI() {
        const url = "http://localhost/certificates.json";
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            this.certificates = data.map(cert => {
                const certificate = new Certificate(cert.id, cert.name, cert.sectorId);
                certificate.sector = this.sectorService.getSectorById(cert.sectorId);
                return certificate;
            });

            return this.certificates;

        } catch (error) {
            console.error('There was a problem fetching the certificates:', error);
        }
    }

    getCertificateById(id) {
        const certificate = this.certificates.find(c => c.id == id);
        if (certificate && !certificate.sector) {
            certificate.sector = this.sectorService.getSectorById(certificate.sectorId);
        }
        return certificate;
    }

    getAllCertificates() {
        return this.certificates;
    }

}
module.exports = CertificateService;