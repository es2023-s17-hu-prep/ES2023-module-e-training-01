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
        const url = "http://localhost/sectors.json";
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            this.sectors = data.map(sector => new Sector(sector.id, sector.name, sector.multiplier));
            return this.sectors;

        } catch (error) {
            console.error('There was a problem fetching the sectors:', error);
        }
    }

    getSectorById(id) {
        return this.sectors.find(s => s.id == id);
    }
}

module.exports = SectorService;