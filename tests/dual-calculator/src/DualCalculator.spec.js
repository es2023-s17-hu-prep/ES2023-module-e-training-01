const DualCalculator = require('./DualCalculator')
const {mock} = require('node:test')

describe('DualCalculator', () => {
    describe('getMonthsDifference', () => {
        it('should return the difference between 2020-06 and 2022-07', () => {
            // Given I have two dates
            const staring = {year: 2020, month: 6};
            const ending = {year: 2020, month: 7};
            const calculator = new DualCalculator(staring, ending, 0, 0, 0, 0, 0);

            // When I call the getMonthsDifference method
            const diff = calculator._getMonthsDifference();

            // Then I should get back the difference
            expect(diff).toBe(2);
        });
    });

    describe('getSalaryCost', () => {
        it('should return the correct salary cost', () => {
            // Given I have the details for the salary calculation
            const staring = {year: 2020, month: 6};
            const ending = {year: 2020, month: 7};
            const calculator = new DualCalculator(staring, ending, 0, 8, 0, 0, 50000);

            // Then I call the getSalaryCost
            const salary = calculator.getSalaryCost();

            // Then I should get the correct value
            expect(salary).toBe(50000 * 8 * 2)
        });
    });

    describe('getTaxRefund', function () {
        it('should calculate the tax refund', async () => {
            // Given I have the details for the salary calculation
            const staring = {year: 2020, month: 6};
            const ending = {year: 2020, month: 7};
            const calculator = new DualCalculator(staring, ending, 1, 8, 37800, 10, 50000);
            const certificateServiceMock = {
                getAllCertificates: jest.fn().mockReturnValue([]),
                getCertificateById: jest.fn().mockReturnValue({sector: {multiplier: 1.67}})
            };

            // When I call the getTaxRefund
            const refund = await calculator.getTaxRefund(certificateServiceMock);

            // Then it should return the correct amount
            expect(refund).toBe(20200.32)
        });

        it('should throw an error if certificate is not found', async () => {
            // Given I have the details for the salary calculation
            const staring = {year: 2020, month: 6};
            const ending = {year: 2020, month: 7};
            const calculator = new DualCalculator(staring, ending, 0, 8, 0, 0, 50000);
            const certificateServiceMock = {
                getAllCertificates: jest.fn().mockReturnValue([]),
                getCertificateById: jest.fn().mockReturnValue(null)
            }

            // When I call the getTaxRefund
            const call = () => calculator.getTaxRefund(certificateServiceMock);

            // Then it should throw an error
            await expect(call).rejects.toThrow("Certificate or its sector not found.")
        });
    });
});