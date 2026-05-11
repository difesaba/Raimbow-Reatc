import type {
  WarrantyInvoice,
  WarrantyInvoiceLogWithDetails,
  WarrantyProcessPdfRow,
} from '../interfaces/warranty.interfaces';
import { formatCurrency } from './payroll.utils';

interface WarrantyPdfInput {
  invoice: WarrantyInvoice | null;
  savedLog: WarrantyInvoiceLogWithDetails;
  rows: WarrantyProcessPdfRow[];
}

interface PreparedWarrantyPdfRow {
  row: WarrantyProcessPdfRow;
  subdivisionLines: string[];
  addressLines: string[];
  descriptionLines: string[];
  amountText: string;
  height: number;
}

interface WarrantyPdfTableLayout {
  subdivisionWidth: number;
  addressWidth: number;
  descriptionWidth: number;
  totalWidth: number;
  subdivisionX: number;
  addressX: number;
  descriptionX: number;
  totalRightX: number;
  subdivisionCharsPerLine: number;
  addressCharsPerLine: number;
  descriptionCharsPerLine: number;
}

interface PdfTextOptions {
  font?: 'F1' | 'F2';
  size?: number;
  color?: [number, number, number];
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
const TABLE_COLUMN_GAP = 10;
const MIN_TOTAL_COLUMN_WIDTH = 92;
const MIN_SUBDIVISION_COLUMN_WIDTH = 90;
const MIN_ADDRESS_COLUMN_WIDTH = 140;
const MIN_DESCRIPTION_COLUMN_WIDTH = 140;
const COLORS = {
  brand: [9, 39, 84] as [number, number, number],
  accent: [25, 118, 210] as [number, number, number],
  soft: [240, 244, 248] as [number, number, number],
  line: [213, 220, 229] as [number, number, number],
  text: [33, 37, 41] as [number, number, number],
  muted: [107, 114, 128] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const COMPANY_NAME = 'RAINBOW PAINTING LLC';
const DOCUMENT_TITLE = 'INVOICE';
const DOCUMENT_SUBTITLE = 'Professional Warranty Painting Services';

const sanitizePdfText = (value: string): string =>
  value
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const formatDate = (value?: string): string => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

const truncate = (value: string, maxLength: number): string =>
  sanitizePdfText(value).slice(0, Math.max(0, maxLength));

const toPdfY = (top: number) => PAGE_HEIGHT - top;

const setFillColor = ([r, g, b]: [number, number, number]) =>
  `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} rg`;

const setStrokeColor = ([r, g, b]: [number, number, number]) =>
  `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} RG`;

const drawFilledRect = (
  x: number,
  top: number,
  width: number,
  height: number,
  color: [number, number, number]
) => `${setFillColor(color)}\n${x} ${toPdfY(top + height)} ${width} ${height} re f`;

const drawText = (
  value: string,
  x: number,
  top: number,
  options: PdfTextOptions = {}
) => {
  const safeText = sanitizePdfText(value);
  const { font = 'F1', size = 10, color = COLORS.text } = options;
  const encodedText = Array.from(safeText)
    .map((character) => {
      const charCode = character.codePointAt(0) ?? 32;
      return (charCode <= 255 ? charCode : 63).toString(16).padStart(2, '0').toUpperCase();
    })
    .join('');

  return `${setFillColor(color)}\nBT /${font} ${size} Tf 1 0 0 1 ${x} ${toPdfY(top)} Tm <${encodedText}> Tj ET`;
};

const drawRightAlignedText = (
  value: string,
  rightX: number,
  top: number,
  options: PdfTextOptions = {}
) => {
  const safeText = sanitizePdfText(value);
  const textSize = options.size ?? 10;
  const estimatedWidth = safeText.length * textSize * 0.52;

  return drawText(value, Math.max(PAGE_MARGIN, rightX - estimatedWidth), top, options);
};

const wrapPdfText = (value: string, maxCharactersPerLine: number): string[] => {
  const safeValue = sanitizePdfText(value);

  if (!safeValue) {
    return [''];
  }

  const words = safeValue.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if (word.length > maxCharactersPerLine) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }

      for (let index = 0; index < word.length; index += maxCharactersPerLine) {
        lines.push(word.slice(index, index + maxCharactersPerLine));
      }

      return;
    }

    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxCharactersPerLine) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [''];
};

const getCharactersPerLine = (columnWidth: number) =>
  Math.max(8, Math.floor((columnWidth - TABLE_COLUMN_GAP) / 5));

const buildTableLayout = (rows: WarrantyProcessPdfRow[]): WarrantyPdfTableLayout => {
  const subdivisionDemand = Math.max(...rows.map((row) => sanitizePdfText(row.SubName || 'N/A').length), 12);
  const addressDemand = Math.max(...rows.map((row) => sanitizePdfText(row.Address || 'N/A').length), 18);
  const descriptionDemand = Math.max(
    ...rows.map((row) => sanitizePdfText(row.Observation || 'Warranty service line item').length),
    18
  );
  const minimumFlexibleWidth =
    MIN_SUBDIVISION_COLUMN_WIDTH + MIN_ADDRESS_COLUMN_WIDTH + MIN_DESCRIPTION_COLUMN_WIDTH;
  const extraWidth = Math.max(0, TABLE_WIDTH - MIN_TOTAL_COLUMN_WIDTH - minimumFlexibleWidth);
  const weightSum = subdivisionDemand + addressDemand + descriptionDemand;
  const subdivisionExtra = weightSum > 0 ? (extraWidth * subdivisionDemand) / weightSum : 0;
  const addressExtra = weightSum > 0 ? (extraWidth * addressDemand) / weightSum : 0;
  const subdivisionWidth = MIN_SUBDIVISION_COLUMN_WIDTH + subdivisionExtra;
  const addressWidth = MIN_ADDRESS_COLUMN_WIDTH + addressExtra;
  const descriptionWidth =
    TABLE_WIDTH - MIN_TOTAL_COLUMN_WIDTH - subdivisionWidth - addressWidth;
  const subdivisionX = PAGE_MARGIN + TABLE_COLUMN_GAP;
  const addressX = PAGE_MARGIN + subdivisionWidth + TABLE_COLUMN_GAP;
  const descriptionX = PAGE_MARGIN + subdivisionWidth + addressWidth + TABLE_COLUMN_GAP;
  const totalRightX = PAGE_WIDTH - PAGE_MARGIN - TABLE_COLUMN_GAP;

  return {
    subdivisionWidth,
    addressWidth,
    descriptionWidth,
    totalWidth: MIN_TOTAL_COLUMN_WIDTH,
    subdivisionX,
    addressX,
    descriptionX,
    totalRightX,
    subdivisionCharsPerLine: getCharactersPerLine(subdivisionWidth),
    addressCharsPerLine: getCharactersPerLine(addressWidth),
    descriptionCharsPerLine: getCharactersPerLine(descriptionWidth),
  };
};

const preparePdfRow = (
  row: WarrantyProcessPdfRow,
  layout: WarrantyPdfTableLayout
): PreparedWarrantyPdfRow => {
  const subdivisionLines = wrapPdfText(row.SubName || 'N/A', layout.subdivisionCharsPerLine);
  const addressLines = wrapPdfText(row.Address || 'N/A', layout.addressCharsPerLine);
  const descriptionLines = wrapPdfText(
    row.Observation || 'Warranty service line item',
    layout.descriptionCharsPerLine
  );
  const lineCount = Math.max(subdivisionLines.length, addressLines.length, descriptionLines.length, 1);

  return {
    row,
    subdivisionLines,
    addressLines,
    descriptionLines,
    amountText: formatCurrency(row.Value),
    height: Math.max(TABLE_ROW_HEIGHT, TABLE_ROW_VERTICAL_PADDING * 2 + lineCount * TABLE_LINE_HEIGHT),
  };
};

const drawLine = (
  x1: number,
  top1: number,
  x2: number,
  top2: number,
  color: [number, number, number]
) => `${setStrokeColor(color)}\n0.8 w\n${x1} ${toPdfY(top1)} m ${x2} ${toPdfY(top2)} l S`;

const getPageBottomLimit = (isLastPage: boolean) => FOOTER_TOP - (isLastPage ? 78 : 24);

const buildRowPages = (rows: WarrantyProcessPdfRow[], layout: WarrantyPdfTableLayout) => {
  const preparedRows = rows.map((row) => preparePdfRow(row, layout));
  const pages: PreparedWarrantyPdfRow[][] = [];
  let currentPage: PreparedWarrantyPdfRow[] = [];
  let currentPageTop = FIRST_PAGE_TABLE_TOP;
  let currentContentTop = currentPageTop + TABLE_ROW_HEIGHT;

  if (preparedRows.length === 0) {
    return [[]];
  }

  preparedRows.forEach((preparedRow, index) => {
    const isLastPreparedRow = index === preparedRows.length - 1;
    const pageBottomLimit = getPageBottomLimit(isLastPreparedRow);

    if (
      currentPage.length > 0 &&
      currentContentTop + preparedRow.height > pageBottomLimit
    ) {
      pages.push(currentPage);
      currentPage = [];
      currentPageTop = NEXT_PAGE_TABLE_TOP;
      currentContentTop = currentPageTop + TABLE_ROW_HEIGHT;
    }

    currentPage.push(preparedRow);
    currentContentTop += preparedRow.height;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

const drawHeader = (commands: string[], input: WarrantyPdfInput, pageIndex: number, pageCount: number) => {
  commands.push(drawText(COMPANY_NAME, PAGE_MARGIN, HEADER_TOP, { font: 'F2', size: 20, color: COLORS.brand }));
  commands.push(drawText(DOCUMENT_SUBTITLE, PAGE_MARGIN, HEADER_TOP + 18, { size: 10, color: COLORS.muted }));
  commands.push(drawRightAlignedText(DOCUMENT_TITLE, PAGE_WIDTH - PAGE_MARGIN, HEADER_TOP, { font: 'F2', size: 18, color: COLORS.brand }));
  commands.push(
    drawRightAlignedText(`Page ${pageIndex + 1} of ${pageCount}`, PAGE_WIDTH - PAGE_MARGIN, HEADER_TOP + 18, {
      size: 9,
      color: COLORS.muted,
    })
  );

  commands.push(drawLine(PAGE_MARGIN, HEADER_TOP + 34, PAGE_WIDTH - PAGE_MARGIN, HEADER_TOP + 34, COLORS.line));

  commands.push(drawText('TO', PAGE_MARGIN, META_TOP, { font: 'F2', size: 8, color: COLORS.muted }));
  commands.push(drawText(invoiceRecipient(input), PAGE_MARGIN, META_TOP + 16, { font: 'F2', size: 12, color: COLORS.text }));

  commands.push(drawText('INVOICE NO.', PAGE_WIDTH - 170, META_TOP, { font: 'F2', size: 8, color: COLORS.muted }));
  commands.push(drawText(`#${input.savedLog.InvoiceNumber}`, PAGE_WIDTH - 106, META_TOP, { font: 'F2', size: 12, color: COLORS.accent }));
  commands.push(drawText(`Date: ${formatDate(input.savedLog.CreatedAt || input.savedLog.InvoiceDate)}`, PAGE_WIDTH - 170, META_TOP + 18, { size: 10, color: COLORS.text }));
};

const invoiceRecipient = (input: WarrantyPdfInput) =>
  truncate(input.invoice?.Nombre || 'Client', 34);

const drawTableHeader = (commands: string[], tableTop: number, layout: WarrantyPdfTableLayout) => {
  commands.push(drawFilledRect(PAGE_MARGIN, tableTop, TABLE_WIDTH, TABLE_ROW_HEIGHT, COLORS.brand));
  commands.push(drawText('Subdivision', layout.subdivisionX, tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));
  commands.push(drawText('Dirección', layout.addressX, tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));
  commands.push(drawText('Descripción', layout.descriptionX, tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));
  commands.push(drawRightAlignedText('Total', layout.totalRightX, tableTop + 16, { font: 'F2', size: 9, color: COLORS.white }));
};

const drawTableRows = (
  commands: string[],
  rows: PreparedWarrantyPdfRow[],
  tableTop: number,
  layout: WarrantyPdfTableLayout
) => {
  let currentTop = tableTop + TABLE_ROW_HEIGHT;

  rows.forEach((preparedRow, index) => {
    const top = currentTop;
    const textTop = top + TABLE_ROW_VERTICAL_PADDING + 8;

    if (index % 2 === 1) {
      commands.push(drawFilledRect(PAGE_MARGIN, top, TABLE_WIDTH, preparedRow.height, COLORS.soft));
    }

    commands.push(drawLine(PAGE_MARGIN, top + preparedRow.height, PAGE_WIDTH - PAGE_MARGIN, top + preparedRow.height, COLORS.line));

    preparedRow.subdivisionLines.forEach((line, lineIndex) => {
      commands.push(drawText(line, layout.subdivisionX, textTop + lineIndex * TABLE_LINE_HEIGHT, { size: 9, color: COLORS.text }));
    });

    preparedRow.addressLines.forEach((line, lineIndex) => {
      commands.push(drawText(line, layout.addressX, textTop + lineIndex * TABLE_LINE_HEIGHT, { size: 9, color: COLORS.text }));
    });

    preparedRow.descriptionLines.forEach((line, lineIndex) => {
      commands.push(drawText(line, layout.descriptionX, textTop + lineIndex * TABLE_LINE_HEIGHT, { size: 9, color: COLORS.text }));
    });

    commands.push(drawRightAlignedText(preparedRow.amountText, layout.totalRightX, textTop, { font: 'F2', size: 9, color: COLORS.brand }));
    currentTop += preparedRow.height;
  });
};

const drawTotals = (commands: string[], rows: WarrantyProcessPdfRow[]) => {
  const grandTotal = rows.reduce((sum, row) => sum + row.Value, 0);
  const subtotalTop = FOOTER_TOP - 30;

  commands.push(drawLine(PAGE_WIDTH - 220, subtotalTop, PAGE_WIDTH - PAGE_MARGIN, subtotalTop, COLORS.line));
  commands.push(drawText('Subtotal', PAGE_WIDTH - 170, subtotalTop + 20, { size: 10, color: COLORS.text }));
  commands.push(drawRightAlignedText(formatCurrency(grandTotal), PAGE_WIDTH - PAGE_MARGIN, subtotalTop + 20, { size: 10, color: COLORS.text }));
  commands.push(drawText('Total', PAGE_WIDTH - 170, subtotalTop + 42, { font: 'F2', size: 11, color: COLORS.brand }));
  commands.push(drawRightAlignedText(formatCurrency(grandTotal), PAGE_WIDTH - PAGE_MARGIN, subtotalTop + 42, { font: 'F2', size: 11, color: COLORS.brand }));
};

const drawFooter = (commands: string[]) => {
  commands.push(drawLine(PAGE_MARGIN, FOOTER_TOP + 28, PAGE_WIDTH - PAGE_MARGIN, FOOTER_TOP + 28, COLORS.line));
  commands.push(
    drawText(
      'Thank you for your business. This invoice reflects approved warranty work processed by Rainbow Painting LLC.',
      PAGE_MARGIN,
      FOOTER_TOP + 48,
      { size: 8, color: COLORS.muted }
    )
  );
};

const buildPageCommands = (
  input: WarrantyPdfInput,
  pageRows: PreparedWarrantyPdfRow[],
  pageIndex: number,
  pageCount: number,
  layout: WarrantyPdfTableLayout
) => {
  const commands: string[] = [];
  const tableTop = pageIndex === 0 ? FIRST_PAGE_TABLE_TOP : NEXT_PAGE_TABLE_TOP;

  if (pageIndex === 0) {
    drawHeader(commands, input, pageIndex, pageCount);
  }

  drawTableHeader(commands, tableTop, layout);
  drawTableRows(commands, pageRows, tableTop, layout);

  if (pageIndex === pageCount - 1) {
    drawTotals(commands, input.rows);
  }

  if (pageIndex === 0 || pageIndex === pageCount - 1) {
    drawFooter(commands);
  }

  return commands.join('\n');
};

export const buildWarrantyInvoicePdf = (input: WarrantyPdfInput): Blob => {
  const tableLayout = buildTableLayout(input.rows);
  const rowPages = buildRowPages(input.rows, tableLayout);
  const objects: string[] = [];
  const pageObjectNumbers: number[] = [];

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

  rowPages.forEach((pageRows, index) => {
    const pageObjectNumber = 5 + index * 2;
    const contentObjectNumber = pageObjectNumber + 1;
    const contentStream = buildPageCommands(input, pageRows, index, rowPages.length, tableLayout);

    pageObjectNumbers.push(pageObjectNumber);

    objects[pageObjectNumber] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`;
    objects[contentObjectNumber] =
      `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`;
  });

  objects[2] = `<< /Type /Pages /Count ${pageObjectNumbers.length} /Kids [${pageObjectNumbers
    .map((pageObjectNumber) => `${pageObjectNumber} 0 R`)
    .join(' ')}] >>`;

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];

  for (let index = 1; index < objects.length; index += 1) {
    if (!objects[index]) {
      continue;
    }

    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += '0000000000 65535 f \n';

  for (let index = 1; index < objects.length; index += 1) {
    const offset = offsets[index] ?? 0;
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
};
