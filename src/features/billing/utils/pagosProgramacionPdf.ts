import { formatCurrency } from './payroll.utils';

export interface PagosProgramacionPdfRow {
  RowNumber: number;
  SubName: string;
  LoteNumber: string;
  NAME: string;
  Company: string;
  InitialDate: string;
  Valor: number;
}

export interface PagosProgramacionPdfInput {
  invoiceNumber: string;
  fullName: string;
  iniDate: string;
  finDate: string;
  rows: PagosProgramacionPdfRow[];
}

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 36;
const HEADER_TOP = 34;
const META_TOP = 128;
const FIRST_PAGE_TABLE_TOP = 184;
const NEXT_PAGE_TABLE_TOP = 42;
const TABLE_ROW_HEIGHT = 24;
const TABLE_LINE_HEIGHT = 10;
const TABLE_ROW_VERTICAL_PADDING = 8;
const FOOTER_TOP = 768;
const TABLE_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

const COLORS = {
  brand:  [9, 39, 84]    as [number, number, number],
  accent: [25, 118, 210] as [number, number, number],
  soft:   [240, 244, 248] as [number, number, number],
  line:   [213, 220, 229] as [number, number, number],
  text:   [33, 37, 41]   as [number, number, number],
  muted:  [107, 114, 128] as [number, number, number],
  white:  [255, 255, 255] as [number, number, number],
};

const sanitize = (v: string | null | undefined) =>
  (v ?? '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
const toPdfY = (top: number) => PAGE_HEIGHT - top;
const setFill = ([r, g, b]: [number, number, number]) =>
  `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} rg`;
const setStroke = ([r, g, b]: [number, number, number]) =>
  `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} RG`;

const rect = (x: number, top: number, w: number, h: number, color: [number, number, number]) =>
  `${setFill(color)}\n${x} ${toPdfY(top + h)} ${w} ${h} re f`;

const line = (x1: number, y1: number, x2: number, y2: number, color: [number, number, number]) =>
  `${setStroke(color)}\n0.8 w\n${x1} ${toPdfY(y1)} m ${x2} ${toPdfY(y2)} l S`;

const text = (
  value: string,
  x: number,
  top: number,
  opts: { font?: 'F1' | 'F2'; size?: number; color?: [number, number, number] } = {}
) => {
  const { font = 'F1', size = 10, color = COLORS.text } = opts;
  const safe = sanitize(value);
  const hex = Array.from(safe)
    .map((c) => {
      const code = c.codePointAt(0) ?? 32;
      return (code <= 255 ? code : 63).toString(16).padStart(2, '0').toUpperCase();
    })
    .join('');
  return `${setFill(color)}\nBT /${font} ${size} Tf 1 0 0 1 ${x} ${toPdfY(top)} Tm <${hex}> Tj ET`;
};

const textRight = (
  value: string,
  rightX: number,
  top: number,
  opts: { font?: 'F1' | 'F2'; size?: number; color?: [number, number, number] } = {}
) => {
  const size = opts.size ?? 10;
  const estimated = sanitize(value).length * size * 0.52;
  return text(value, Math.max(PAGE_MARGIN, rightX - estimated), top, opts);
};

const wrap = (value: string, maxChars: number): string[] => {
  const safe = sanitize(value);
  if (!safe) return [''];
  const words = safe.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (word.length > maxChars) {
      if (current) { lines.push(current); current = ''; }
      for (let i = 0; i < word.length; i += maxChars) lines.push(word.slice(i, i + maxChars));
      continue;
    }
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) { current = next; continue; }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
};

const charsPerLine = (width: number) => Math.max(8, Math.floor((width - 10) / 5));

const formatDateShort = (iso: string | null | undefined) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(d);
};

// Column widths (no Company column)
const COL_NO    = 28;
const COL_VALOR = 90;
const FLEX      = TABLE_WIDTH - COL_NO - COL_VALOR;
const COL_SUB   = Math.floor(FLEX * 0.28);
const COL_LOTE  = Math.floor(FLEX * 0.12);
const COL_WORK  = Math.floor(FLEX * 0.38);
const COL_DATE  = FLEX - COL_SUB - COL_LOTE - COL_WORK;

const X_NO          = PAGE_MARGIN + 4;
const X_SUB         = PAGE_MARGIN + COL_NO + 4;
const X_LOTE        = X_SUB + COL_SUB;
const X_WORK        = X_LOTE + COL_LOTE;
const X_DATE        = X_WORK + COL_WORK;
const X_VALOR_RIGHT = PAGE_WIDTH - PAGE_MARGIN - 4;

interface PreparedRow {
  row: PagosProgramacionPdfRow;
  subLines: string[];
  loteLines: string[];
  workLines: string[];
  dateLines: string[];
  valorText: string;
  height: number;
}

const prepareRow = (row: PagosProgramacionPdfRow): PreparedRow => {
  const subLines  = wrap(row.SubName    ?? '', charsPerLine(COL_SUB));
  const loteLines = wrap(row.LoteNumber ?? '', charsPerLine(COL_LOTE));
  const workLines = wrap(row.NAME       ?? '', charsPerLine(COL_WORK));
  const dateLines = wrap(formatDateShort(row.InitialDate), charsPerLine(COL_DATE));
  const lineCount = Math.max(subLines.length, loteLines.length, workLines.length, dateLines.length, 1);
  return {
    row,
    subLines, loteLines, workLines, dateLines,
    valorText: formatCurrency(row.Valor),
    height: Math.max(TABLE_ROW_HEIGHT, TABLE_ROW_VERTICAL_PADDING * 2 + lineCount * TABLE_LINE_HEIGHT),
  };
};

const buildPages = (rows: PagosProgramacionPdfRow[]): PreparedRow[][] => {
  const prepared = rows.map(prepareRow);
  const pages: PreparedRow[][] = [];
  let page: PreparedRow[] = [];
  let top = FIRST_PAGE_TABLE_TOP + TABLE_ROW_HEIGHT;
  const limit = (isLast: boolean) => FOOTER_TOP - (isLast ? 78 : 24);

  if (!prepared.length) return [[]];

  prepared.forEach((r, i) => {
    const isLast = i === prepared.length - 1;
    if (page.length > 0 && top + r.height > limit(isLast)) {
      pages.push(page);
      page = [];
      top = NEXT_PAGE_TABLE_TOP + TABLE_ROW_HEIGHT;
    }
    page.push(r);
    top += r.height;
  });
  if (page.length) pages.push(page);
  return pages;
};

const buildPage = (
  input: PagosProgramacionPdfInput,
  pageRows: PreparedRow[],
  pageIndex: number,
  pageCount: number
): string => {
  const cmds: string[] = [];
  const tableTop = pageIndex === 0 ? FIRST_PAGE_TABLE_TOP : NEXT_PAGE_TABLE_TOP;

  // Header (first page only)
  if (pageIndex === 0) {
    cmds.push(text('RAINBOW PAINTING LLC', PAGE_MARGIN, HEADER_TOP, { font: 'F2', size: 20, color: COLORS.brand }));
    cmds.push(text('Orden de Pago - Programacion', PAGE_MARGIN, HEADER_TOP + 18, { size: 10, color: COLORS.muted }));
    cmds.push(textRight(`Pag. ${pageIndex + 1} de ${pageCount}`, PAGE_WIDTH - PAGE_MARGIN, HEADER_TOP + 18, { size: 9, color: COLORS.muted }));
    cmds.push(line(PAGE_MARGIN, HEADER_TOP + 34, PAGE_WIDTH - PAGE_MARGIN, HEADER_TOP + 34, COLORS.line));

    cmds.push(text('PARA', PAGE_MARGIN, META_TOP, { font: 'F2', size: 8, color: COLORS.muted }));
    cmds.push(text(sanitize(input.fullName ?? '').slice(0, 40), PAGE_MARGIN, META_TOP + 16, { font: 'F2', size: 12, color: COLORS.text }));

    cmds.push(text('No. FACTURA', PAGE_WIDTH - 170, META_TOP, { font: 'F2', size: 8, color: COLORS.muted }));
    cmds.push(text(`#${input.invoiceNumber}`, PAGE_WIDTH - 106, META_TOP, { font: 'F2', size: 12, color: COLORS.accent }));
    cmds.push(text(`Fecha: ${formatDateShort(new Date().toISOString())}`, PAGE_WIDTH - 170, META_TOP + 18, { size: 10, color: COLORS.text }));
    cmds.push(text(`Semana: ${formatDateShort(input.iniDate)}  al  ${formatDateShort(input.finDate)}`, PAGE_WIDTH - 170, META_TOP + 34, { size: 9, color: COLORS.muted }));
  } else {
    cmds.push(textRight(`Pag. ${pageIndex + 1} de ${pageCount}`, PAGE_WIDTH - PAGE_MARGIN, NEXT_PAGE_TABLE_TOP - 10, { size: 9, color: COLORS.muted }));
  }

  // Table header row
  cmds.push(rect(PAGE_MARGIN, tableTop, TABLE_WIDTH, TABLE_ROW_HEIGHT, COLORS.brand));
  cmds.push(text('#',            X_NO,   tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));
  cmds.push(text('Subdivision',  X_SUB,  tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));
  cmds.push(text('Lote',         X_LOTE, tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));
  cmds.push(text('Trabajo',      X_WORK, tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));
  cmds.push(text('Fecha',        X_DATE, tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));
  cmds.push(textRight('Valor',   X_VALOR_RIGHT, tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));

  // Rows
  let currentTop = tableTop + TABLE_ROW_HEIGHT;
  pageRows.forEach((pr, i) => {
    const rowTop = currentTop;
    const textTop = rowTop + TABLE_ROW_VERTICAL_PADDING + 8;
    if (i % 2 === 1) cmds.push(rect(PAGE_MARGIN, rowTop, TABLE_WIDTH, pr.height, COLORS.soft));
    cmds.push(line(PAGE_MARGIN, rowTop + pr.height, PAGE_WIDTH - PAGE_MARGIN, rowTop + pr.height, COLORS.line));

    cmds.push(text(String(pr.row.RowNumber), X_NO, textTop, { size: 9, color: COLORS.muted }));
    pr.subLines.forEach((l, j)  => cmds.push(text(l, X_SUB,  textTop + j * TABLE_LINE_HEIGHT, { size: 9, color: COLORS.text })));
    pr.loteLines.forEach((l, j) => cmds.push(text(l, X_LOTE, textTop + j * TABLE_LINE_HEIGHT, { size: 9, color: COLORS.text })));
    pr.workLines.forEach((l, j) => cmds.push(text(l, X_WORK, textTop + j * TABLE_LINE_HEIGHT, { size: 9, color: COLORS.text })));
    pr.dateLines.forEach((l, j) => cmds.push(text(l, X_DATE, textTop + j * TABLE_LINE_HEIGHT, { size: 9, color: COLORS.muted })));
    cmds.push(textRight(pr.valorText, X_VALOR_RIGHT, textTop, { font: 'F2', size: 9, color: COLORS.brand }));

    currentTop += pr.height;
  });

  // Totals on last page
  if (pageIndex === pageCount - 1) {
    const grandTotal = input.rows.reduce((s, r) => s + r.Valor, 0);
    const subtotalTop = FOOTER_TOP - 30;
    cmds.push(line(PAGE_WIDTH - 220, subtotalTop, PAGE_WIDTH - PAGE_MARGIN, subtotalTop, COLORS.line));
    cmds.push(text('Subtotal', PAGE_WIDTH - 170, subtotalTop + 20, { size: 10, color: COLORS.text }));
    cmds.push(textRight(formatCurrency(grandTotal), PAGE_WIDTH - PAGE_MARGIN, subtotalTop + 20, { size: 10, color: COLORS.text }));
    cmds.push(text('Total a Pagar', PAGE_WIDTH - 170, subtotalTop + 42, { font: 'F2', size: 11, color: COLORS.brand }));
    cmds.push(textRight(formatCurrency(grandTotal), PAGE_WIDTH - PAGE_MARGIN, subtotalTop + 42, { font: 'F2', size: 11, color: COLORS.brand }));
  }

  // Footer
  if (pageIndex === 0 || pageIndex === pageCount - 1) {
    cmds.push(line(PAGE_MARGIN, FOOTER_TOP + 28, PAGE_WIDTH - PAGE_MARGIN, FOOTER_TOP + 28, COLORS.line));
    cmds.push(text('Gracias. Este documento refleja el pago de programacion aprobado procesado por Rainbow Painting LLC.', PAGE_MARGIN, FOOTER_TOP + 48, { size: 8, color: COLORS.muted }));
  }

  return cmds.join('\n');
};

export const buildPagosProgramacionPdf = (input: PagosProgramacionPdfInput): Blob => {
  const pages = buildPages(input.rows);
  const objects: string[] = [];
  const pageNums: number[] = [];

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

  pages.forEach((pageRows, i) => {
    const pageObj = 5 + i * 2;
    const contentObj = pageObj + 1;
    const stream = buildPage(input, pageRows, i, pages.length);
    pageNums.push(pageObj);
    objects[pageObj] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObj} 0 R >>`;
    objects[contentObj] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objects[2] = `<< /Type /Pages /Count ${pageNums.length} /Kids [${pageNums.map((n) => `${n} 0 R`).join(' ')}] >>`;

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let i = 1; i < objects.length; i++) {
    if (!objects[i]) continue;
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < objects.length; i++) {
    pdf += `${(offsets[i] ?? 0).toString().padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
};
