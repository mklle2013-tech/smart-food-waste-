/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  auth,
  testConnection,
  signInWithGoogle,
  signOutUser,
  onAuthStateChanged,
  type User,
} from './firebase';
import {
  subscribeCompostBins,
  subscribeWasteLogs,
  subscribeBatches,
  subscribeFertilizerOutputs,
  checkAndSeedInitialData,
  addFoodWasteLog,
  deleteFoodWasteLog,
  updateBinSensors,
  createNewBatch,
  updateBatchProgress,
  harvestFertilizer,
  saveUserProfile,
} from './services/dataService';
import type {
  FoodWasteLog,
  CompostBin,
  FermentationBatch,
  FertilizerOutput,
  WasteCategory,
  FertilizerType,
  QualityGrade,
  FertilizerDestination,
} from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { WasteLogsView } from './components/WasteLogsView';
import { CompostBinsView } from './components/CompostBinsView';
import { BatchesView } from './components/BatchesView';
import { FertilizerView } from './components/FertilizerView';
import { WasteLogModal } from './components/WasteLogModal';
import { NewBatchModal } from './components/NewBatchModal';
import { HarvestModal } from './components/HarvestModal';
import {
  CheckCircle2,
  AlertCircle,
  Sprout,
  Heart,
  Globe,
  Database,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Firestore Data State
  const [wasteLogs, setWasteLogs] = useState<FoodWasteLog[]>([]);
  const [compostBins, setCompostBins] = useState<CompostBin[]>([]);
  const [batches, setBatches] = useState<FermentationBatch[]>([]);
  const [fertilizerOutputs, setFertilizerOutputs] = useState<FertilizerOutput[]>([]);

  // Modals State
  const [isWasteModalOpen, setIsWasteModalOpen] = useState<boolean>(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState<boolean>(false);
  const [preselectedBinId, setPreselectedBinId] = useState<string | undefined>(undefined);
  const [selectedBatchForHarvest, setSelectedBatchForHarvest] = useState<FermentationBatch | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Check Firestore Connection on boot
  useEffect(() => {
    testConnection();
    checkAndSeedInitialData();
  }, []);

  // 2. Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Save/Sync user profile
        await saveUserProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'ผู้ใช้งาน',
          photoURL: user.photoURL || undefined,
          role: user.email === '68113833@dpu.ac.th' ? 'admin' : 'operator',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. Real-time Subscriptions
  useEffect(() => {
    const unsubBins = subscribeCompostBins((data) => setCompostBins(data));
    const unsubLogs = subscribeWasteLogs((data) => setWasteLogs(data));
    const unsubBatches = subscribeBatches((data) => setBatches(data));
    const unsubOutputs = subscribeFertilizerOutputs((data) => setFertilizerOutputs(data));

    return () => {
      unsubBins();
      unsubLogs();
      unsubBatches();
      unsubOutputs();
    };
  }, []);

  // Google Sign-In Handler
  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const user = await signInWithGoogle();
      showToast(`เข้าสู่ระบบสำเร็จ: ยินดีต้อนรับคุณ ${user.displayName || user.email}`, 'success');
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google', 'error');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google Sign-Out Handler
  const handleSignOut = async () => {
    try {
      await signOutUser();
      showToast('ออกจากระบบเรียบร้อยแล้ว', 'success');
    } catch (err) {
      console.error(err);
      showToast('ไม่สามารถออกจากระบบได้', 'error');
    }
  };

  // Submit Waste Log
  const handleAddWasteLog = async (data: {
    category: WasteCategory;
    weightKg: number;
    moistureEstimate: number;
    sourceLocation: string;
    targetBinId?: string;
    notes?: string;
  }) => {
    try {
      await addFoodWasteLog({
        ...data,
        recordedByUid: currentUser?.uid || 'guest-operator',
        recordedByEmail: currentUser?.email || '68113833@dpu.ac.th',
        recordedByName: currentUser?.displayName || 'เจ้าหน้าที่จุดคัดแยก',
      });
      showToast(`บันทึกเศษอาหาร ${data.weightKg} กก. เข้าสู่ถังสำเร็จแล้ว`, 'success');
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
  };

  // Delete Waste Log
  const handleDeleteWasteLog = async (id: string) => {
    try {
      await deleteFoodWasteLog(id);
      showToast('ลบรายการบันทึกเรียบร้อย', 'success');
    } catch (err) {
      console.error(err);
      showToast('ไม่สามารถลบรายการได้', 'error');
    }
  };

  // Update Compost Bin Telemetry
  const handleUpdateBin = async (binId: string, updates: Partial<CompostBin>) => {
    try {
      await updateBinSensors(binId, updates);
      showToast('อัปเดตสถานะเซนเซอร์และระบบกลไกเรียบร้อย', 'success');
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการอัปเดตเซนเซอร์', 'error');
    }
  };

  // Create Batch
  const handleCreateBatch = async (data: {
    binId: string;
    binName: string;
    inputWeightKg: number;
    inoculantType: string;
    carbonNitrogenRatio: string;
    expectedYieldKg: number;
  }) => {
    try {
      await createNewBatch({
        ...data,
        status: 'thermophilic',
        operatorUid: currentUser?.uid || 'operator',
        operatorName: currentUser?.displayName || 'ผู้ดูแลระบบ',
      });
      showToast(`เริ่มรอบการหมักในเครื่อง ${data.binName} สำเร็จ`, 'success');
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเริ่มรอบการหมัก', 'error');
    }
  };

  // Advance Batch Progress
  const handleAdvanceBatch = async (batchId: string, currentPct: number, currentStatus: FermentationBatch['status']) => {
    try {
      await updateBatchProgress(batchId, currentPct, currentStatus);
      showToast(`ปรับความคืบหน้ารอบการหมักเป็น ${currentPct}% แล้ว`, 'success');
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการปรับสถานะ', 'error');
    }
  };

  // Harvest Fertilizer
  const handleHarvestFertilizer = async (data: {
    batchId: string;
    type: FertilizerType;
    quantityKg: number;
    npkRating: string;
    moisturePct: number;
    qualityGrade: QualityGrade;
    destination: FertilizerDestination;
    harvestDate: string;
    notes?: string;
  }) => {
    try {
      await harvestFertilizer({
        ...data,
        recordedByUid: currentUser?.uid || 'operator',
      });
      showToast(`บันทึกเก็บเกี่ยวผลผลิตปุ๋ย ${data.quantityKg} กก. เข้าสู่คลังเรียบร้อยแล้ว`, 'success');
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเก็บเกี่ยวปุ๋ย', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1310] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-medium border ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-rose-500 text-rose-300'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        isLoggingIn={isLoggingIn}
        onOpenWasteModal={() => setIsWasteModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Not Logged In Callout Banner if user hasn't signed in yet */}
        {!currentUser && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  เข้าสู่ระบบด้วย Gmail เพื่อบันทึกข้อมูลแบบเรียลไทม์
                </p>
                <p className="text-xs text-slate-400">
                  โครงการเชื่อมต่อกับฐานข้อมูล Firebase: <span className="font-mono text-emerald-300">smart food waste-to-fertilizer system</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>{isLoggingIn ? 'กำลังเชื่อมต่อ...' : 'เข้าสู่ระบบด้วย Gmail ทันที'}</span>
            </button>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardView
            wasteLogs={wasteLogs}
            compostBins={compostBins}
            batches={batches}
            fertilizerOutputs={fertilizerOutputs}
            onOpenWasteModal={() => setIsWasteModalOpen(true)}
            onOpenBatchModal={() => {
              setPreselectedBinId(undefined);
              setIsBatchModalOpen(true);
            }}
            onOpenHarvestModal={() => {
              setSelectedBatchForHarvest(null);
              setIsHarvestModalOpen(true);
            }}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'wasteLogs' && (
          <WasteLogsView
            logs={wasteLogs}
            onOpenModal={() => setIsWasteModalOpen(true)}
            onDeleteLog={handleDeleteWasteLog}
            currentUserEmail={currentUser?.email}
          />
        )}

        {activeTab === 'compostBins' && (
          <CompostBinsView
            bins={compostBins}
            onUpdateBin={handleUpdateBin}
            onOpenBatchModal={(binId) => {
              setPreselectedBinId(binId);
              setIsBatchModalOpen(true);
            }}
          />
        )}

        {activeTab === 'batches' && (
          <BatchesView
            batches={batches}
            onOpenBatchModal={() => {
              setPreselectedBinId(undefined);
              setIsBatchModalOpen(true);
            }}
            onOpenHarvestModal={(batch) => {
              setSelectedBatchForHarvest(batch);
              setIsHarvestModalOpen(true);
            }}
            onAdvanceProgress={handleAdvanceBatch}
          />
        )}

        {activeTab === 'fertilizer' && (
          <FertilizerView
            outputs={fertilizerOutputs}
            onOpenHarvestModal={() => {
              setSelectedBatchForHarvest(null);
              setIsHarvestModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Modals */}
      <WasteLogModal
        isOpen={isWasteModalOpen}
        onClose={() => setIsWasteModalOpen(false)}
        onSubmit={handleAddWasteLog}
        bins={compostBins}
      />

      <NewBatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSubmit={handleCreateBatch}
        bins={compostBins}
        preselectedBinId={preselectedBinId}
      />

      <HarvestModal
        isOpen={isHarvestModalOpen}
        onClose={() => setIsHarvestModalOpen(false)}
        onSubmit={handleHarvestFertilizer}
        batches={batches}
        selectedBatch={selectedBatchForHarvest}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-400">Smart Food Waste-to-Fertilizer System</span>
            <span>• Circular Bio-Economy</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Firebase Firestore & Auth Active</span>
            <span>•</span>
            <span>Zero-Waste Initiative</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
