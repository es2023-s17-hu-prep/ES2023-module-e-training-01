const CertificateService = require("./CertificateService");

jest.mock("./SectorService");

/**
 * Tests for the CertificateService
 */
describe("CertificateService tests", () => {
  // define the service before the tests
  let service;
  let sectorService;

  beforeAll(() => {
    sectorService = { getSectorById: jest.fn() };
    service = new CertificateService(sectorService);
  });

  // empty the certificates array before every test
  beforeEach(() => {
    service.certificates = [];
  });

  // fetchCertificatesFromAPI tests
  describe("fetchCertificatesFromAPI", () => {
    it("should fetch the certificates", async () => {
      // given
      const certificates = [
        {
          id: "1",
          name: "Bányaipari technikus",
          sectorId: "1",
        },
        {
          id: "2",
          name: "Bányaművelő",
          sectorId: "1",
        },
      ];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(certificates),
      });

      // when
      const result = await service.fetchCertificatesFromAPI();

      // then
      expect(result).toEqual(certificates);
    });

    it("should catch the fetch error", async () => {
      // given
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      const consoleError = jest.spyOn(console, "error").mockImplementation();

      // when
      await service.fetchCertificatesFromAPI();

      // then
      expect(consoleError).toHaveBeenCalled();
    });
  });

  // getAllCertificates tests
  describe("getAllCertificates", () => {
    it("should return the certificates", () => {
      // given
      const certificates = [
        {
          id: "1",
          name: "Bányaipari technikus",
          sectorId: "1",
        },
        {
          id: "2",
          name: "Bányaművelő",
          sectorId: "1",
        },
      ];
      service.certificates = certificates;

      // when
      const res = service.getAllCertificates();

      // then
      expect(res).toEqual(certificates);
    });
  });

  // getCertificateById tests
  describe("getCertificateById", () => {
    it("should return a certificate by id", () => {
      // given
      const certificate = {
        id: "1",
        name: "Bányaipari technikus",
        sectorId: "1",
      };
      service.certificates = [certificate];

      // when
      const res = service.getCertificateById(1);

      // then
      expect(res).toEqual(certificate);
    });

    it("should use the getSectorById function", () => {
      // given
      const certificate = {
        id: "1",
        name: "Bányaipari technikus",
        sectorId: 1,
      };
      const sector = { id: 1, name: "Hello", multiplier: 2.2 };

      service.certificates = [certificate];
      sectorService.getSectorById.mockReturnValue(sector);

      // when
      const res = service.getCertificateById(1);

      // then
      expect(res.sector).toEqual(sector);
    });

    it("should return undefined when the certificates not found", () => {
      // given
      service.certificates = [];

      // when
      const res = service.getCertificateById(13232);

      // then
      expect(res).toBeUndefined();
    });
  });
});
