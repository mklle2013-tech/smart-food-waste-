import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import type {
  FoodWasteLog,
  CompostBin,
  FermentationBatch,
  FertilizerOutput,
  UserProfile,
} from '../types';

export const INITIAL_BINS: CompostBin[] = [
  {
    id: 'bin-01',
    name: 'เครื่องย่อยชีวภาพอัตโนมัติ Unit 01 (Aerobic Fast Reactor)',
    model: 'EcoBio-500 Pro',
    capacityKg: 150,
    currentWeightKg: 85.5,
    status: 'processing',
    temperatureC: 58.2,
    moisturePct: 54,
    phLevel: 6.8,
    aerationActive: true,
    heatingActive: true,
    currentBatchId: 'batch-101',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bin-02',
    name: 'ถังหมักเติมอากาศควบคุมอุณหภูมิ Unit 02',
    model: 'ThermoDigester-300',
    capacityKg: 100,
    currentWeightKg: 42.0,
    status: 'processing',
    temperatureC: 62.5,
    moisturePct: 58,
    phLevel: 7.1,
    aerationActive: true,
    heatingActive: false,
    currentBatchId: 'batch-102',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bin-03',
    name: 'ถังบ่มปุ๋ยชีวภาพและลดความชื้น Unit 03 (Curing Drum)',
    model: 'DryCompost-Cure 200',
    capacityKg: 200,
    currentWeightKg: 120.0,
    status: 'curing',
    temperatureC: 38.0,
    moisturePct: 28,
    phLevel: 6.5,
    aerationActive: false,
    heatingActive: true,
    currentBatchId: 'batch-103',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bin-04',
    name: 'ถังหมักจุลินทรีย์ EM เข้มข้น Unit 04 (Liquid Bio-Extract)',
    model: 'AquaBio Extract Tank',
    capacityKg: 120,
    currentWeightKg: 15.0,
    status: 'idle',
    temperatureC: 29.5,
    moisturePct: 65,
    phLevel: 6.2,
    aerationActive: false,
    heatingActive: false,
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_BATCHES: FermentationBatch[] = [
  {
    id: 'batch-101',
    binId: 'bin-01',
    binName: 'เครื่องย่อยชีวภาพอัตโนมัติ Unit 01 (Aerobic Fast Reactor)',
    inputWeightKg: 85.5,
    inoculantType: 'หัวเชื้อจุลินทรีย์ทนร้อน Thermophilic Bio-Culture (TB-04)',
    carbonNitrogenRatio: '25:1 (รำข้าว + เปลือกกาแฟ)',
    status: 'thermophilic',
    progressPct: 68,
    startedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    estimatedEndAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    expectedYieldKg: 17.1,
    operatorUid: 'system',
    operatorName: 'ระบบอัตโนมัติ IoT',
  },
  {
    id: 'batch-102',
    binId: 'bin-02',
    binName: 'ถังหมักเติมอากาศควบคุมอุณหภูมิ Unit 02',
    inputWeightKg: 42.0,
    inoculantType: 'เอนไซม์ย่อยสลายเซลลูโลส + สปอร์ Trichoderma',
    carbonNitrogenRatio: '28:1',
    status: 'thermophilic',
    progressPct: 45,
    startedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    estimatedEndAt: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
    expectedYieldKg: 8.4,
    operatorUid: 'system',
    operatorName: 'ผู้ดูแลระบบ',
  },
  {
    id: 'batch-103',
    binId: 'bin-03',
    binName: 'ถังบ่มปุ๋ยชีวภาพและลดความชื้น Unit 03 (Curing Drum)',
    inputWeightKg: 120.0,
    inoculantType: 'จุลินทรีย์สังเคราะห์แสง (PSB) + ขี้เถ้าชีวมวล',
    carbonNitrogenRatio: '20:1',
    status: 'curing',
    progressPct: 88,
    startedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    estimatedEndAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    expectedYieldKg: 24.0,
    operatorUid: 'system',
    operatorName: 'ผู้ดูแลระบบ',
  },
];

export const INITIAL_LOGS: FoodWasteLog[] = [
  {
    id: 'log-001',
    category: 'vegetable_fruit',
    weightKg: 24.5,
    moistureEstimate: 60,
    sourceLocation: 'โรงอาหารกลาง (Central Cafeteria)',
    targetBinId: 'bin-01',
    recordedByUid: 'demo-user',
    recordedByEmail: '68113833@dpu.ac.th',
    recordedByName: 'เจ้าหน้าที่จุดคัดแยก',
    carbonOffsetKg: 46.55,
    notes: 'เศษผักกาด เปลือกส้ม แตงโม สับละเอียดก่อนเท',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-002',
    category: 'grains_bakery',
    weightKg: 18.2,
    moistureEstimate: 45,
    sourceLocation: 'ร้านเบเกอรี่และคาเฟ่ อาคาร 3',
    targetBinId: 'bin-01',
    recordedByUid: 'demo-user',
    recordedByEmail: '68113833@dpu.ac.th',
    recordedByName: 'เจ้าหน้าที่จุดคัดแยก',
    carbonOffsetKg: 34.58,
    notes: 'เศษขนมปังเหลือและข้าวสวย คาร์บอนสูงช่วยปรับสมดุล C:N',
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-003',
    category: 'coffee_eggshell',
    weightKg: 12.0,
    moistureEstimate: 35,
    sourceLocation: 'ร้านกาแฟ Green Cafe',
    targetBinId: 'bin-02',
    recordedByUid: 'demo-user',
    recordedByEmail: '68113833@dpu.ac.th',
    recordedByName: 'พนักงานบาริสต้า',
    carbonOffsetKg: 22.8,
    notes: 'กากกาแฟคั่วบดและเปลือกไข่ล้างสะอาด ช่วยเพิ่มแคลเซียมและไนโตรเจน',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-004',
    category: 'meat_protein',
    weightKg: 14.8,
    moistureEstimate: 55,
    sourceLocation: 'ครัวร้านอาหารตามสั่ง',
    targetBinId: 'bin-02',
    recordedByUid: 'demo-user',
    recordedByEmail: '68113833@dpu.ac.th',
    recordedByName: 'เจ้าหน้าที่จุดคัดแยก',
    carbonOffsetKg: 28.12,
    notes: 'เศษเนื้อและกระดูกอ่อนเล็ก เติมจุลินทรีย์ย่อยสลายไขมันเพิ่ม 50g',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-005',
    category: 'mixed_scraps',
    weightKg: 31.0,
    moistureEstimate: 58,
    sourceLocation: 'จุดคัดแยกขยะอาคารกิจกรรม',
    targetBinId: 'bin-03',
    recordedByUid: 'demo-user',
    recordedByEmail: '68113833@dpu.ac.th',
    recordedByName: 'เจ้าหน้าที่จุดคัดแยก',
    carbonOffsetKg: 58.9,
    notes: 'เศษอาหารรวมคัดแยกพลาสติกออกหมดแล้ว',
    createdAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
  },
];

export const INITIAL_OUTPUTS: FertilizerOutput[] = [
  {
    id: 'fert-001',
    batchId: 'batch-098',
    type: 'pellet',
    quantityKg: 35.0,
    npkRating: '4 - 3 - 2 + Ca 2.5%',
    moisturePct: 12,
    qualityGrade: 'premium',
    destination: 'campus_farm',
    harvestDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString().split('T')[0],
    notes: 'ปุ๋ยอัดเม็ดไร้กลิ่น อุดมด้วยธาตุอาหาร เหมาะสำหรับพืชผักสวนครัวและแปลงสาธิต',
    recordedByUid: 'system',
  },
  {
    id: 'fert-002',
    batchId: 'batch-099',
    type: 'powder',
    quantityKg: 28.5,
    npkRating: '3 - 2 - 3',
    moisturePct: 15,
    qualityGrade: 'standard',
    destination: 'community_garden',
    harvestDate: new Date(Date.now() - 96 * 3600 * 1000).toISOString().split('T')[0],
    notes: 'ปุ๋ยหมักแห้งเนื้อละเอียด แจกจ่ายให้ชุมชนรอบข้างสำหรับปรับปรุงดิน',
    recordedByUid: 'system',
  },
  {
    id: 'fert-003',
    batchId: 'batch-097',
    type: 'liquid_bio',
    quantityKg: 18.0,
    npkRating: 'Bio-Extract EM 10x',
    moisturePct: 90,
    qualityGrade: 'premium',
    destination: 'distribution_sale',
    harvestDate: new Date(Date.now() - 140 * 3600 * 1000).toISOString().split('T')[0],
    notes: 'น้ำหมักชีวภาพเข้มข้นเจือจาง 1:500 สำหรับฉีดพ่นทางใบ',
    recordedByUid: 'system',
  },
];

export async function checkAndSeedInitialData() {
  try {
    const binsSnap = await getDocs(collection(db, 'compostBins'));
    if (binsSnap.empty) {
      for (const bin of INITIAL_BINS) {
        await setDoc(doc(db, 'compostBins', bin.id), bin);
      }
    }

    const batchesSnap = await getDocs(collection(db, 'batches'));
    if (batchesSnap.empty) {
      for (const batch of INITIAL_BATCHES) {
        await setDoc(doc(db, 'batches', batch.id), batch);
      }
    }

    const logsSnap = await getDocs(collection(db, 'wasteLogs'));
    if (logsSnap.empty) {
      for (const log of INITIAL_LOGS) {
        await setDoc(doc(db, 'wasteLogs', log.id), log);
      }
    }

    const outputsSnap = await getDocs(collection(db, 'fertilizerOutputs'));
    if (outputsSnap.empty) {
      for (const out of INITIAL_OUTPUTS) {
        await setDoc(doc(db, 'fertilizerOutputs', out.id), out);
      }
    }
  } catch (error) {
    console.warn('Initial seed check notice:', error);
  }
}

export function subscribeCompostBins(onData: (bins: CompostBin[]) => void) {
  const path = 'compostBins';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: CompostBin[] = [];
      snapshot.forEach((d) => items.push({ ...d.data(), id: d.id } as CompostBin));
      onData(items.length > 0 ? items : INITIAL_BINS);
    },
    (error) => {
      console.error('Bins subscription warning:', error);
      onData(INITIAL_BINS);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeWasteLogs(onData: (logs: FoodWasteLog[]) => void) {
  const path = 'wasteLogs';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: FoodWasteLog[] = [];
      snapshot.forEach((d) => items.push({ ...d.data(), id: d.id } as FoodWasteLog));
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onData(items.length > 0 ? items : INITIAL_LOGS);
    },
    (error) => {
      console.error('WasteLogs subscription warning:', error);
      onData(INITIAL_LOGS);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeBatches(onData: (batches: FermentationBatch[]) => void) {
  const path = 'batches';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: FermentationBatch[] = [];
      snapshot.forEach((d) => items.push({ ...d.data(), id: d.id } as FermentationBatch));
      onData(items.length > 0 ? items : INITIAL_BATCHES);
    },
    (error) => {
      console.error('Batches subscription warning:', error);
      onData(INITIAL_BATCHES);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeFertilizerOutputs(onData: (outputs: FertilizerOutput[]) => void) {
  const path = 'fertilizerOutputs';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: FertilizerOutput[] = [];
      snapshot.forEach((d) => items.push({ ...d.data(), id: d.id } as FertilizerOutput));
      items.sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime());
      onData(items.length > 0 ? items : INITIAL_OUTPUTS);
    },
    (error) => {
      console.error('Outputs subscription warning:', error);
      onData(INITIAL_OUTPUTS);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function addFoodWasteLog(log: Omit<FoodWasteLog, 'id' | 'carbonOffsetKg' | 'createdAt'>) {
  const path = 'wasteLogs';
  const id = `log-${Date.now()}`;
  // 1 kg of food waste averted from landfill saves roughly 1.90 kg CO2 equivalent
  const carbonOffsetKg = Number((log.weightKg * 1.9).toFixed(2));
  const fullLog: FoodWasteLog = {
    ...log,
    id,
    carbonOffsetKg,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, path, id), fullLog);
    // If targeted to a bin, update that bin's current weight
    if (log.targetBinId) {
      const binRef = doc(db, 'compostBins', log.targetBinId);
      await updateDoc(binRef, {
        currentWeightKg: Number((log.weightKg).toFixed(1)),
        updatedAt: new Date().toISOString(),
      });
    }
    return fullLog;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteFoodWasteLog(logId: string) {
  const path = 'wasteLogs';
  try {
    await deleteDoc(doc(db, path, logId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateBinSensors(
  binId: string,
  updates: Partial<CompostBin>
) {
  const path = 'compostBins';
  try {
    const binRef = doc(db, path, binId);
    await updateDoc(binRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function createNewBatch(batch: Omit<FermentationBatch, 'id' | 'startedAt' | 'progressPct'>) {
  const path = 'batches';
  const id = `batch-${Date.now()}`;
  const newBatch: FermentationBatch = {
    ...batch,
    id,
    startedAt: new Date().toISOString(),
    progressPct: 5,
  };

  try {
    await setDoc(doc(db, path, id), newBatch);
    // Link bin to this batch
    const binRef = doc(db, 'compostBins', batch.binId);
    await updateDoc(binRef, {
      currentBatchId: id,
      status: 'processing',
      currentWeightKg: batch.inputWeightKg,
      aerationActive: true,
      updatedAt: new Date().toISOString(),
    });
    return newBatch;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBatchProgress(batchId: string, progressPct: number, status: FermentationBatch['status']) {
  const path = 'batches';
  try {
    const batchRef = doc(db, path, batchId);
    await updateDoc(batchRef, {
      progressPct,
      status,
      ...(progressPct >= 100 ? { completedAt: new Date().toISOString() } : {}),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function harvestFertilizer(output: Omit<FertilizerOutput, 'id'>) {
  const path = 'fertilizerOutputs';
  const id = `fert-${Date.now()}`;
  const fullOutput: FertilizerOutput = {
    ...output,
    id,
  };

  try {
    await setDoc(doc(db, path, id), fullOutput);
    // Update batch to completed
    const batchRef = doc(db, 'batches', output.batchId);
    await updateDoc(batchRef, {
      status: 'completed',
      progressPct: 100,
      actualYieldKg: output.quantityKg,
      completedAt: new Date().toISOString(),
    });
    return fullOutput;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveUserProfile(user: UserProfile) {
  const path = 'users';
  try {
    await setDoc(doc(db, path, user.uid), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
