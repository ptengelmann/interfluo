import PDFDocument from 'pdfkit';

export type Block =
  | { kind: 'h1'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'kv'; key: string; value: string }
  | { kind: 'qa'; q: string; a: string }
  | { kind: 'bullet'; text: string }
  | { kind: 'rule' }
  | { kind: 'page-break' }
  | { kind: 'space'; height: number };

export interface PdfMeta {
  title: string;
  author?: string;
  subject?: string;
}

export async function buildPdf(meta: PdfMeta, blocks: Block[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 56,
      info: {
        Title: meta.title,
        Author: meta.author ?? 'Interfluo Fixtures',
        Subject: meta.subject ?? '',
      },
    });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('regular', 'Helvetica');
    doc.registerFont('bold', 'Helvetica-Bold');
    doc.registerFont('italic', 'Helvetica-Oblique');

    for (const b of blocks) renderBlock(doc, b);
    doc.end();
  });
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  const remaining = doc.page.height - doc.page.margins.bottom - doc.y;
  if (remaining < needed) doc.addPage();
}

function renderBlock(doc: PDFKit.PDFDocument, b: Block) {
  switch (b.kind) {
    case 'h1':
      ensureSpace(doc, 40);
      doc.font('bold').fontSize(18).fillColor('#17181c').text(b.text, { paragraphGap: 12 });
      break;
    case 'h2':
      ensureSpace(doc, 30);
      doc.moveDown(0.5);
      doc.font('bold').fontSize(13).fillColor('#17181c').text(b.text, { paragraphGap: 6 });
      break;
    case 'h3':
      ensureSpace(doc, 20);
      doc.font('bold').fontSize(11).fillColor('#4a4842').text(b.text, { paragraphGap: 4 });
      break;
    case 'p':
      ensureSpace(doc, 20);
      doc.font('regular').fontSize(10.5).fillColor('#17181c').text(b.text, {
        align: 'left',
        paragraphGap: 6,
        lineGap: 2,
      });
      break;
    case 'kv':
      ensureSpace(doc, 16);
      doc.font('bold').fontSize(10).fillColor('#4a4842').text(`${b.key}: `, { continued: true });
      doc.font('regular').fillColor('#17181c').text(b.value, { paragraphGap: 4 });
      break;
    case 'qa':
      ensureSpace(doc, 30);
      doc.font('bold').fontSize(10).fillColor('#4a4842').text(b.q, { paragraphGap: 2 });
      doc
        .font('regular')
        .fontSize(10.5)
        .fillColor('#17181c')
        .text(b.a, { paragraphGap: 8, lineGap: 1.5 });
      break;
    case 'bullet':
      ensureSpace(doc, 14);
      doc.font('regular').fontSize(10.5).fillColor('#17181c').text(`•  ${b.text}`, {
        paragraphGap: 3,
        indent: 12,
      });
      break;
    case 'rule':
      ensureSpace(doc, 10);
      doc
        .moveTo(56, doc.y)
        .lineTo(doc.page.width - 56, doc.y)
        .strokeColor('#c9c2b2')
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(0.5);
      break;
    case 'page-break':
      doc.addPage();
      break;
    case 'space':
      doc.moveDown(b.height / 12);
      break;
  }
}
