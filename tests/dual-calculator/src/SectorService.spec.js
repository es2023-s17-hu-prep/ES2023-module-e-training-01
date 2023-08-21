const SectorService = require('./SectorService')
const {mock} = require('node:test')

describe('SectorService', () => {
    let service;
    beforeEach(() => {
        // Create a new instance of the sector service
        service = new SectorService()
    })

    describe('fetch sectors', () => {
        it('should fetch sectors', async () => {
            // Given I have a list of certifications
            const sectors = [
                {id: 1, name: 'sector 1', multiplier: 10},
                {id: 2, name: 'sector 2', multiplier: 20},
                {id: 3, name: 'sector 3', multiplier: 30},
            ];
            mock.method(global, 'fetch', () => ({json: () => sectors, status: 200, ok: true}))

            // When I call the fetchSectorsFromAPI
            const result = await service.fetchSectorsFromAPI();

            // Then it should return the list of sectors
            expect(result).toEqual(sectors);
        });

        it('should handle network errors', async () => {
            // Given the fetch request fails
            mock.method(global, 'fetch', () => ({ok: false, status: 456}))
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            // When I call the fetchSectorsFromAPI
            await service.fetchSectorsFromAPI();

            // Then it should log an error
            expect(consoleSpy).toHaveBeenCalledWith( "There was a problem fetching the sectors:", expect.anything())
        });
    });

    describe('getSectorById', () => {
        it('should return undefined if sector not found', async () => {
            // Given I have no certifications
            service.sectors = [];

            // When I call the getSectorById method
            const result = await service.getSectorById(999);

            // Then I should get back undefined
            expect(result).toBeUndefined();
        });

        it('should return sectors', async () => {
            // Given I have a certificate
            const sector = {id: 1, name: 'test', sectorId: 10, sector: {id: 10}};
            service.sectors = [sector];

            // When I call the getSectorById method
            const result = await service.getSectorById(1);

            // Then I should get back the sector
            expect(result).toBe(sector);
        });
    });
});