export class ClaimStatsDto {
  pending!: number;
  underReview!: number;
  approved!: number;
  rejected!: number;

  constructor(dto: Partial<ClaimStatsDto>) {
    Object.assign(this, dto);
  }
}
