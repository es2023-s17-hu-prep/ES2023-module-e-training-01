class DualCalculator {
    constructor(startingDate, endingDate, certificateId, numberOfStudent, baseAmount, numberOfWorkingDay, monthlySalary) {
        this.startingDate = startingDate;
        this.endingDate = endingDate;
        this.certificateId = certificateId;
        this.numberOfStudent = numberOfStudent;
        this.baseAmount = baseAmount;
        this.numberOfWorkingDay = numberOfWorkingDay;
        this.monthlySalary = monthlySalary;
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

        const multiplier = certificate.sector.multiplier;
        return (this.baseAmount * multiplier) / 250 * this.numberOfWorkingDay * this.numberOfStudent;
    }

    getSalaryCost() {
        const months = this._getMonthsDifference();
        return months * this.monthlySalary * this.numberOfStudent;
    }
}

module.exports = DualCalculator;


