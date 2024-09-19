import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationService {
  public getDistance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number,
  ): number {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    const dLat = this.radians(latitude2 - latitude1);
    const dLon = this.radians(longitude2 - longitude1);
    const lat1 = this.radians(latitude1);
    const lat2 = this.radians(latitude2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    return distance;
  }

  private radians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
