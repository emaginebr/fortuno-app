import { createContext, useCallback, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { lotteryImageService } from '@/Services/lotteryImageService';
import type {
  LotteryImageInfo,
  LotteryImageInsertInfo,
  LotteryImageUpdateInfo,
} from '@/types/lotteryImage';

export interface LotteryImageContextType {
  images: LotteryImageInfo[];
  loading: boolean;
  error: string | null;
  loadByLottery: (lotteryId: number) => Promise<void>;
  create: (payload: LotteryImageInsertInfo) => Promise<LotteryImageInfo | null>;
  update: (payload: LotteryImageUpdateInfo) => Promise<LotteryImageInfo | null>;
  remove: (lotteryImageId: number) => Promise<boolean>;
  clearError: () => void;
}

const LotteryImageContext = createContext<LotteryImageContextType | undefined>(undefined);

export const LotteryImageProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [images, setImages] = useState<LotteryImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = useCallback((err: unknown, msg: string) => {
    toast.error(msg);
    setError(err instanceof Error ? err.message : msg);
  }, []);

  const loadByLottery = useCallback(
    async (lotteryId: number): Promise<void> => {
      setLoading(true);
      try {
        const list = await lotteryImageService.listByLottery(lotteryId);
        setImages([...list].sort((a, b) => a.displayOrder - b.displayOrder));
        setError(null);
      } catch (err) {
        fail(err, 'Falha ao carregar imagens.');
      } finally {
        setLoading(false);
      }
    },
    [fail],
  );

  const create = useCallback(
    async (payload: LotteryImageInsertInfo): Promise<LotteryImageInfo | null> => {
      try {
        const created = await lotteryImageService.create(payload);
        setImages((prev) => [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder));
        toast.success('Imagem adicionada.');
        return created;
      } catch (err) {
        fail(err, 'Falha ao adicionar imagem.');
        return null;
      }
    },
    [fail],
  );

  const update = useCallback(
    async (payload: LotteryImageUpdateInfo): Promise<LotteryImageInfo | null> => {
      try {
        const updated = await lotteryImageService.update(payload);
        setImages((prev) =>
          prev
            .map((i) => (i.lotteryImageId === updated.lotteryImageId ? updated : i))
            .sort((a, b) => a.displayOrder - b.displayOrder),
        );
        return updated;
      } catch (err) {
        fail(err, 'Falha ao atualizar imagem.');
        return null;
      }
    },
    [fail],
  );

  const remove = useCallback(
    async (lotteryImageId: number): Promise<boolean> => {
      try {
        await lotteryImageService.remove(lotteryImageId);
        setImages((prev) => prev.filter((i) => i.lotteryImageId !== lotteryImageId));
        return true;
      } catch (err) {
        fail(err, 'Falha ao remover imagem.');
        return false;
      }
    },
    [fail],
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <LotteryImageContext.Provider
      value={{ images, loading, error, loadByLottery, create, update, remove, clearError }}
    >
      {children}
    </LotteryImageContext.Provider>
  );
};

export default LotteryImageContext;
