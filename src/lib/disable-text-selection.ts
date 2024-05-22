import { PDFViewer } from 'pdfjs-dist/legacy/web/pdf_viewer';

export const disableTextSelection = (viewer: PDFViewer, flag: boolean) => {
  viewer.viewer?.classList.toggle('PdfHighlighter--disable-selection', flag);
};
