class Sector {
    constructor(id, name, multiplier) {
        this.id = id;
        this.name = name;
        this.multiplier = multiplier;
    }
}

class SectorService {
    constructor() {
        this.sectors = [];
    }

    async fetchSectorsFromAPI() {
        const url = "http://localhost/sectors";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            this.sectors = data.sectors.map(sector => new Sector(sector.id, sector.name, sector.multiplier));
            return this.sectors;

        } catch (error) {
            console.error('There was a problem fetching the sectors:', error);
        }
    }

    getSectorById(id) {
        return this.sectors.find(s => s.id == id);
    }
}

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
        const url = "http://localhost/certificates";
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            this.certificates = data.certificates.map(cert => {
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

    getCertificateMultiplierById(id) {
        const certificate = this.getCertificateById(id);
        return certificate.sector.multiplier;
    }
}

class DualCalculator {
    constructor(startingDate, endingDate, certificateId, numberOfStudent, numberOfWorkingDay, monthlySalary) {
        this.startingDate = startingDate;
        this.endingDate = endingDate;
        this.certificateId = certificateId;
        this.numberOfStudent = numberOfStudent;
        this.baseAmount = 0;
        this.numberOfWorkingDay = numberOfWorkingDay;
        this.monthlySalary = monthlySalary;
    }

    async fetchBaseAmount() {
        const url = "http://localhost/base-amount";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.baseAmount;
        } catch (error) {
            console.error('There was a problem fetching the base amount:', error);
        }
    }

    // Helper function to get number of months between starting and ending dates
    _getMonthsDifference() {
        const endinMonths = this.endingDate.year * 12 + this.endingDate.month;
        const startingMonths = this.startingDate.year * 12 + this.startingDate.month;
        const monthDiff = endinMonths - startingMonths + 1;
        return monthDiff;
    }

    async getTaxRefund(certificateService) {
        const certificates = certificateService.getAllCertificates();
        const certificate = certificateService.getCertificateById(this.certificateId);
        if (!certificate || !certificate.sector) {
            throw new Error('Certificate or its sector not found.');
        }
        this.baseAmount = await this.fetchBaseAmount();
        console.log(this.baseAmount);
        const multiplier = certificate.sector.multiplier;
        return (this.baseAmount * multiplier) / 250 * this.numberOfWorkingDay * this.numberOfStudent;
    }

    getSalaryCost() {
        const months = this._getMonthsDifference();
        return months * this.monthlySalary * this.numberOfStudent;
    }


}


