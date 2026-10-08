export type UserRole = 'admin' | 'operator' | 'contributor';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export type WasteCategory =
  | 'vegetable_fruit'
  | 'meat_protein'
  | 'grains_bakery'
  | 'coffee_eggshell'
  | 'mixed_scraps';

export interface FoodWasteLog {
  id: string;
  category: WasteCategory;
  weightKg: number;
  moistureEstimate?: number;
  sourceLocation: string;
  targetBinId?: string;
  recordedByUid: string;
  recordedByEmail?: string;
  recordedByName?: string;
  carbonOffsetKg: number;
  notes?: string;
  createdAt: string;
}

export type BinStatus = 'idle' | 'processing' | 'curing' | 'maintenance';

export interface CompostBin {
  id: string;
  name: string;
  model: string;
  capacityKg: number;
  currentWeightKg: number;
  status: BinStatus;
  temperatureC: number;
  moisturePct: number;
  phLevel: number;
  aerationActive: boolean;
  heatingActive: boolean;
  currentBatchId?: string;
  updatedAt: string;
}

export type BatchStatus = 'loading' | 'thermophilic' | 'curing' | 'completed' | 'failed';

export interface FermentationBatch {
  id: string;
  binId: string;
  binName: string;
  inputWeightKg: number;
  inoculantType: string;
  carbonNitrogenRatio: string;
  status: BatchStatus;
  progressPct: number;
  startedAt: string;
  estimatedEndAt?: string;
  completedAt?: string;
  expectedYieldKg: number;
  actualYieldKg?: number;
  operatorUid?: string;
  operatorName?: string;
}

export type FertilizerType = 'pellet' | 'powder' | 'liquid_bio';
export type QualityGrade = 'premium' | 'standard' | 'utility';
export type FertilizerDestination = 'community_garden' | 'campus_farm' | 'distribution_sale' | 'storage';

export interface FertilizerOutput {
  id: string;
  batchId: string;
  type: FertilizerType;
  quantityKg: number;
  npkRating?: string;
  moisturePct?: number;
  qualityGrade: QualityGrade;
  destination: FertilizerDestination;
  harvestDate: string;
  notes?: string;
  recordedByUid: string;
}
