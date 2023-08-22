const DualCalculator = require("./DualCalculator");

/**
 * Tests for the CertificateService
 */
describe("CertificateService tests", () => {
  // define the service before the tests
  let calculator;

  beforeAll(() => {
    calculator = new DualCalculator(
      { year: 2023, month: 5 },
      { year: 2024, month: 6 },
      1,
      5,
      2_000_000,
      30,
      200_000
    );
  });

  // getSalaryCost tests
  describe("getSalaryCost", () => {
    it("should calculate the salary cost", async () => {
      // when
      const result = await calculator.getSalaryCost();

      // then
      expect(result).toEqual(14_000_000);
    });
  });

  // _getMonthsDifference tests
  describe("_getMonthsDifference", () => {
    it("should calculate the month difference", async () => {
      // when
      const result = await calculator._getMonthsDifference();

      // then
      expect(result).toEqual(14);
    });
  });

  // getTaxRefund tests
  describe("getTaxRefund", () => {
    it("should return the tax refund", async () => {
      // given
      const certificateService = {
        getAllCertificates: jest.fn().mockReturnValue([]),
        getCertificateById: jest
          .fn()
          .mockReturnValue({ sector: { id: 1, multiplier: 2.5 } }),
      };

      // when
      const result = await calculator.getTaxRefund(certificateService);

      // then
      expect(result).toEqual(3_000_000);
    });

    it("should return the tax refund", async () => {
      // given
      const certificateService = {
        getAllCertificates: jest.fn().mockReturnValue([]),
        getCertificateById: jest.fn().mockReturnValue(),
      };

      // then
      expect(() =>
        calculator.getTaxRefund(certificateService)
      ).rejects.toThrow();
    });
  });
});
