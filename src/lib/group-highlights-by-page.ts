import { GhostHighlight, Highlight } from '../types';

type GroupedHighlights = {
  [pageNumber: number]: Array<Highlight | GhostHighlight>;
};

const groupHighlightsByPage = (highlights: Array<Highlight | GhostHighlight | null>): GroupedHighlights =>
  highlights.reduce<GroupedHighlights>((acc, highlight) => {
    if (!highlight) {
      return acc;
    }
    const pageNumbers = [highlight.position.boundingRect.pageNumber, ...highlight.position.rects.map((rect) => rect.pageNumber || 0)];

    pageNumbers.forEach((pageNumber) => {
      acc[pageNumber] ||= [];
      const pageSpecificHighlight = {
        ...highlight,
        position: {
          ...highlight.position,
          rects: highlight.position.rects.filter((rect) => pageNumber === rect.pageNumber),
        },
      };
      acc[pageNumber].push(pageSpecificHighlight);
    });

    return acc;
  }, {});

export default groupHighlightsByPage;
