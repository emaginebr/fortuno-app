import { useEffect, useState } from 'react';
import { useLotteryImage } from '@/hooks/useLotteryImage';

interface Step4Props {
  lotteryId: number;
}

export const Step4Images = ({ lotteryId }: Step4Props): JSX.Element => {
  const { images, loadByLottery, create, update, remove } = useLotteryImage();
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    void loadByLottery(lotteryId);
  }, [lotteryId, loadByLottery]);

  const handleAdd = async (): Promise<void> => {
    if (!url.trim()) return;
    await create({
      lotteryId,
      imageUrl: url.trim(),
      description: description.trim(),
      order: images.length + 1,
    });
    setUrl('');
    setDescription('');
  };

  const move = async (imageId: number, direction: -1 | 1): Promise<void> => {
    const current = images.find((i) => i.lotteryImageId === imageId);
    if (!current) return;
    const newOrder = current.order + direction;
    const swap = images.find((i) => i.order === newOrder);
    if (swap) {
      await update({ ...swap, order: current.order });
    }
    await update({ ...current, order: newOrder });
    await loadByLottery(lotteryId);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-dashed border-fortuno-gold-intense/30 p-4">
        <h3 className="font-semibold">Adicionar imagem</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL da imagem (https://...)"
            className="rounded-md border border-fortuno-black/20 px-3 py-2"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Legenda (opcional)"
            className="rounded-md border border-fortuno-black/20 px-3 py-2"
          />
        </div>
        <button type="button" onClick={() => void handleAdd()} className="btn-primary mt-3">
          Adicionar imagem
        </button>
      </div>

      {images.length === 0 ? (
        <p className="text-center text-fortuno-black/60">Nenhuma imagem cadastrada ainda.</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {images.map((img) => (
            <li
              key={img.lotteryImageId}
              className="flex gap-3 rounded-lg border bg-white p-3 shadow-sm"
            >
              <img
                src={img.imageUrl}
                alt={img.description}
                className="h-20 w-28 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">{img.description || 'Sem legenda'}</p>
                <p className="text-xs text-fortuno-black/50">Ordem: {img.order}</p>
                <div className="mt-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => void move(img.lotteryImageId, -1)}
                    className="rounded border px-2 py-0.5 text-xs"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(img.lotteryImageId, 1)}
                    className="rounded border px-2 py-0.5 text-xs"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(img.lotteryImageId)}
                    className="rounded border border-red-600 px-2 py-0.5 text-xs text-red-700"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
