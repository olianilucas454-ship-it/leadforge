import { RawBusinessData } from '../providers/types';

export class DuplicateDetectionService {
  private normalizeString(str: string): string {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  private normalizePhone(phone?: string | null): string | null {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');
    return digits.length > 0 ? digits : null;
  }

  // Haversine formula
  private getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = this.normalizeString(str1);
    const s2 = this.normalizeString(str2);
    
    if (s1 === s2) return 100;
    if (s1.includes(s2) || s2.includes(s1)) return 90;
    
    return 0; // Simplified for MVP
  }

  private getCompletenessScore(b: RawBusinessData): number {
    let score = 0;
    if (b.phone) score++;
    if (b.whatsapp) score++;
    if (b.website) score++;
    if (b.instagram) score++;
    if (b.facebook) score++;
    if (b.openingHours) score++;
    if (b.rating) score++;
    if (b.reviewCount) score++;
    return score;
  }

  public removeDuplicates(businesses: RawBusinessData[]): RawBusinessData[] {
    const uniqueList: RawBusinessData[] = [];

    for (const biz of businesses) {
      let isDuplicate = false;
      let duplicateIndex = -1;

      for (let i = 0; i < uniqueList.length; i++) {
        const existing = uniqueList[i];
        
        const samePhone = this.normalizePhone(biz.phone) && this.normalizePhone(biz.phone) === this.normalizePhone(existing.phone);
        const sameDomain = biz.website && existing.website && this.normalizeString(biz.website) === this.normalizeString(existing.website);
        
        const dist = this.getDistanceInMeters(biz.lat, biz.lon, existing.lat, existing.lon);
        const isNearby = dist < 50;
        
        const simScore = this.calculateSimilarity(biz.name, existing.name);
        const sameNameAndNearby = simScore >= 85 && isNearby;

        if (samePhone || sameDomain || sameNameAndNearby) {
          isDuplicate = true;
          duplicateIndex = i;
          break;
        }
      }

      if (isDuplicate && duplicateIndex > -1) {
        const existing = uniqueList[duplicateIndex];
        const bizScore = this.getCompletenessScore(biz);
        const existingScore = this.getCompletenessScore(existing);
        
        if (bizScore > existingScore) {
          uniqueList[duplicateIndex] = biz;
        }
      } else {
        uniqueList.push(biz);
      }
    }

    return uniqueList;
  }
}
