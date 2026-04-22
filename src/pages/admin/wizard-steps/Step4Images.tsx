import { useEffect, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import { UploadCloud, GripVertical, Trash2, Star } from 'lucide-react';
import { useLotteryImage } from '@/hooks/useLotteryImage';
import type { LotteryImageInfo } from '@/types/lotteryImage';

interface Step4Props {
  lotteryId: number;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_PREFIX = 'image/';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const Step4Images = ({ lotteryId }: Step4Props): JSX.Element => {
  const { images, loadByLottery, create, update, remove } = useLotteryImage();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadByLottery(lotteryId);
  }, [lotteryId, loadByLottery]);

  const nextDisplayOrder = (): number =>
    images.length === 0 ? 0 : Math.max(...images.map((i) => i.displayOrder)) + 1;

  const uploadFiles = async (files: FileList | File[]): Promise<void> => {
    const list = Array.from(files).filter((f) => f.type.startsWith(ACCEPTED_PREFIX));
    if (list.length === 0) {
      toast.error('Selecione arquivos de imagem.');
      return;
    }
    setUploading(true);
    try {
      let order = nextDisplayOrder();
      for (const file of list) {
        if (file.size > MAX_FILE_BYTES) {
          toast.error(`${file.name} excede 5 MB — ignorado.`);
          continue;
        }
        const imageBase64 = await fileToBase64(file);
        await create({
          lotteryId,
          imageBase64,
          description: file.name.replace(/\.[^.]+$/, ''),
          displayOrder: order,
        });
        order += 1;
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.length) void uploadFiles(e.target.files);
  };

  const reorder = async (sourceId: number, targetId: number): Promise<void> => {
    if (sourceId === targetId) return;
    const sorted = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
    const sourceIdx = sorted.findIndex((i) => i.lotteryImageId === sourceId);
    const targetIdx = sorted.findIndex((i) => i.lotteryImageId === targetId);
    if (sourceIdx < 0 || targetIdx < 0) return;
    const [moved] = sorted.splice(sourceIdx, 1);
    sorted.splice(targetIdx, 0, moved);
    await Promise.all(
      sorted.map((img, idx) =>
        img.displayOrder === idx
          ? Promise.resolve(null)
          : update({
              lotteryImageId: img.lotteryImageId,
              description: img.description,
              displayOrder: idx,
            }),
      ),
    );
    await loadByLottery(lotteryId);
  };

  const sortedImages: LotteryImageInfo[] = [...images].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="space-y-6">
      <div
        role="button"
        tabIndex={0}
        aria-label="Arraste imagens ou clique para selecionar"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition',
          dragOver
            ? 'border-fortuno-gold-intense bg-fortuno-gold-intense/10'
            : 'border-fortuno-offwhite/20 hover:border-fortuno-gold-soft/60 hover:bg-fortuno-offwhite/5',
        ].join(' ')}
      >
        <UploadCloud className="h-10 w-10 text-fortuno-gold-soft" aria-hidden="true" />
        <div>
          <p className="font-display text-lg text-fortuno-offwhite">
            {uploading ? 'Enviando...' : 'Arraste imagens ou clique para selecionar'}
          </p>
          <p className="mt-1 text-xs text-fortuno-offwhite/55">
            PNG, JPG, WebP · até 5 MB cada · múltiplos arquivos aceitos
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handleFileInput}
        />
      </div>

      {sortedImages.length === 0 ? (
        <p className="text-center text-sm text-fortuno-offwhite/60">
          Nenhuma imagem cadastrada ainda. A primeira imagem enviada será a capa do sorteio.
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {sortedImages.map((img, idx) => {
            const isCover = idx === 0;
            const isDragging = draggedId === img.lotteryImageId;
            return (
              <li
                key={img.lotteryImageId}
                draggable
                onDragStart={() => setDraggedId(img.lotteryImageId)}
                onDragEnd={() => setDraggedId(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedId !== null) void reorder(draggedId, img.lotteryImageId);
                }}
                className={[
                  'relative flex gap-3 rounded-xl border p-3 transition',
                  isCover
                    ? 'border-fortuno-gold-intense/60 bg-fortuno-gold-intense/5'
                    : 'border-fortuno-offwhite/10 bg-fortuno-offwhite/[0.03]',
                  isDragging ? 'opacity-50' : '',
                ].join(' ')}
              >
                <GripVertical
                  className="mt-1 h-5 w-5 shrink-0 cursor-grab text-fortuno-offwhite/40"
                  aria-hidden="true"
                />
                <img
                  src={img.imageUrl}
                  alt={img.description}
                  className="h-20 w-28 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-fortuno-offwhite">
                      {img.description || 'Sem legenda'}
                    </p>
                    {isCover && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-fortuno-gold-intense px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fortuno-black">
                        <Star className="h-3 w-3" aria-hidden="true" />
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-fortuno-offwhite/50">
                    Posição {idx + 1} · arraste para reordenar
                  </p>
                  <button
                    type="button"
                    onClick={() => void remove(img.lotteryImageId)}
                    className="mt-2 inline-flex items-center gap-1 rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                    Remover
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
