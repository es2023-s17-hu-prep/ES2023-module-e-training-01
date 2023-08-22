const SectorService = require("./SectorService");

/**
 * Tests for the SectorService
 */
describe("SectorService tests", () => {
  // define the service before the tests
  let service;
  beforeAll(() => (service = new SectorService()));

  // empty the sectors array before every test
  beforeEach(() => {
    service.sectors = [];
  });

  // fetchSectorsFromAPI tests
  describe("fetchSectorsFromAPI", () => {
    it("should fetch the sectors", async () => {
      // given
      const sectors = [{ id: 1, name: "Hello", multiplier: 2.2 }];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(sectors),
      });

      // when
      const result = await service.fetchSectorsFromAPI();

      // then
      expect(result).toEqual(sectors);
    });

    it("should catch the fetch error", async () => {
      // given
      global.fetch = jest.fn().mockRejectedValue({
        ok: false,
        status: 500,
      });
      const consoleError = jest.spyOn(console, "error").mockImplementation();

      // when
      await service.fetchSectorsFromAPI();

      // then
      expect(consoleError).toHaveBeenCalled();
    });

    it("should throw the not ok exception", async () => {
      // given
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve([]),
      });

      // when
      let error = null;

      try {
        await service.fetchSectorsFromAPI();
      } catch (e) {
        error = e;
      }

      // then
      expect(error).toBeDefined();
    });
  });

  // getSectorById tests
  describe("getSectorById", () => {
    it("should return a sector by id", () => {
      // given
      const sector = { id: 1, name: "Hello", multiplier: 2.2 };
      service.sectors = [sector];

      // when
      const res = service.getSectorById(1);

      // then
      expect(res).toEqual(sector);
    });

    it("should return undefined when the sector not found", () => {
      // given
      service.sectors = [];

      // when
      const res = service.getSectorById(13232);

      // then
      expect(res).toBeUndefined();
    });
  });
});
