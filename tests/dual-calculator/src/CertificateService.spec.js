const CertificateService = require('./CertificateService')
const {mock} = require('node:test')

describe('CertificateService', () => {
    let service;
    let sectorServiceMock;
    beforeEach(() => {
        // Mock the sector service
        sectorServiceMock = {getSectorById: jest.fn()}

        // Create a new instance of the certificate service
        service = new CertificateService(sectorServiceMock)
    })

    describe('fetch certifications', () => {
        it('should fetch certifications', async () => {
            // Given I have a list of certifications
            const certificates = [
                {id: 1, name: 'certification 1', sectorId: 10},
                {id: 2, name: 'certification 2', sectorId: 20},
                {id: 3, name: 'certification 3', sectorId: 30},
            ];
            mock.method(global, 'fetch', () => ({json: () => certificates, status: 200, ok: true}))

            // When I call the fetchCertificatesFromAPI
            const result = await service.fetchCertificatesFromAPI();

            // Then it should return the list of certifications and call getSectorById
            expect(result).toEqual(certificates);
            expect(sectorServiceMock.getSectorById).toHaveBeenCalledWith(10)
            expect(sectorServiceMock.getSectorById).toHaveBeenCalledWith(20)
            expect(sectorServiceMock.getSectorById).toHaveBeenCalledWith(30)
        });

        it('should handle network errors', async () => {
            // Given the fetch request fails
            mock.method(global, 'fetch', () => ({ok: false, status: 456}))
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            // When I call the fetchCertificatesFromAPI
            await service.fetchCertificatesFromAPI();

            // Then it should log an error
            expect(consoleSpy).toHaveBeenCalledWith( "There was a problem fetching the certificates:", expect.anything())
        });
    });

    describe('getCertificateById', () => {
        it('should return undefined if certificate not found', async () => {
            // Given I have no certifications
            service.certificates = [];

            // When I call the getCertificateById method
            const result = await service.getCertificateById(999);

            // Then I should get back undefined
            expect(result).toBeUndefined();
        });

        it('should return certificates', async () => {
            // Given I have a certificate
            const certificate = {id: 1, name: 'test', sectorId: 10, sector: {id: 10}};
            service.certificates = [certificate];

            // When I call the getCertificateById method
            const result = await service.getCertificateById(1);

            // Then I should get back the certificate
            expect(result).toBe(certificate);
        });

        it('should call the sector service if the certificate does not have a sector', async () => {
            // Given I have a certificate without a sector
            const certificate = {id: 1, name: 'test', sectorId: 10};
            const mockedSector = {id: 10, name: 'mocked'};
            service.certificates = [certificate];
            sectorServiceMock.getSectorById.mockImplementation(() => mockedSector)

            // When I call the getCertificateById method
            const result = await service.getCertificateById(1);

            // Then it should call the sector service
            expect(sectorServiceMock.getSectorById).toHaveBeenCalledWith(10);
            expect(result.sector).toEqual(mockedSector);
        });
    });

    describe('getAllCertificates', () => {
        it('should return an empty array if there are no certificates', async () => {
            // Given I do not have any certificates
            service.certificates = [];

            // When I call the getAllCertificates
            const result = service.getAllCertificates();

            // Then I should get an empty array
            expect(result).toEqual([])
        });

        it('should list all certificates', async () => {
            // Give I have a list of certificates
            const certificates = [
                {id: 1, name: 'certification 1', sectorId: 10},
                {id: 2, name: 'certification 2', sectorId: 20},
                {id: 3, name: 'certification 3', sectorId: 30},
            ];
            service.certificates = certificates;

            // When I call the getAllCertificates
            const result = service.getAllCertificates();

            // Then I should get the certificates
            expect(result).toEqual(certificates);
        });
    });
});