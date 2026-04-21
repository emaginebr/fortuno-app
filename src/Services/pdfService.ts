import jsPDF from 'jspdf';

const stripMarkdown = (md: string): string[] => {
  return md
    .split('\n')
    .map((line) =>
      line
        .replace(/^#{1,6}\s*/, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/^-\s+/, '• ')
        .replace(/^\d+\.\s+/, (m) => m),
    )
    .flatMap((line) => line.match(/.{1,90}(\s|$)/g) ?? [line]);
};

/**
 * Gera um PDF simples a partir de markdown e dispara download.
 * Implementação minimal para entregar Regras e Política de Privacidade
 * quando o backend ainda não expõe endpoint de PDF.
 */
export const downloadMarkdownAsPdf = (
  markdown: string,
  filename: string,
  title?: string,
): void => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 48;
  let y = 56;

  if (title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, marginX, y);
    y += 24;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const lines = stripMarkdown(markdown);
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line) {
      y += 10;
      continue;
    }
    if (y > 780) {
      doc.addPage();
      y = 56;
    }
    doc.text(line, marginX, y);
    y += 15;
  }

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
};
