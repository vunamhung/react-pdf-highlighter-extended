import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import CommentForm from './CommentForm';
import ContextMenu, { ContextMenuProps } from './ContextMenu';
import ExpandableTip from './ExpandableTip';
import HighlightContainer from './HighlightContainer';
import { GhostHighlight, Highlight, PdfHighlighter, PdfHighlighterUtils, PdfLoader, Tip, ViewportHighlight } from './react-pdf-highlighter-extended';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import './style/App.css';
import { testHighlights as _testHighlights } from './test-highlights';
import { CommentedHighlight } from './types';

const TEST_HIGHLIGHTS = _testHighlights;
const PRIMARY_PDF_URL = 'http://localhost:3000/react-pdf-highlighter-extended/example-app/sample.pdf';
const SECONDARY_PDF_URL = 'https://arxiv.org/pdf/1604.02480';
const LONG_LOADING_PDF_URL = 'https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK';

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  return document.location.hash.slice('#highlight-'.length);
};

const resetHash = () => {
  document.location.hash = '';
};

const App = () => {
  const [url, setUrl] = useState(PRIMARY_PDF_URL);
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>([
    {
      content: { text: '{"x1": 93.8688, "x2": 471.78239999999994, "y1": 103.2672, "y2": 180.1248, "width": 816.0, "height": 1056.0, "pageNumber":10}' },
      position: {
        boundingRect: { x1: 93.8688, x2: 471.78239999999994, y1: 103.2672, y2: 180.1248, width: 816.0, height: 1056.0, pageNumber: 1 },
        rects: [
          { x1: 93.8688, x2: 471.78239999999994, y1: 103.2672, y2: 180.1248, width: 816.0, height: 1056.0, pageNumber: 1 },
          { x1: 93.7728, x2: 721.248, y1: 203.9616, y2: 420.288, width: 816.0, height: 1056.0, pageNumber: 1 },
        ],
      },
      comment: '{"x1": 93.8688, "x2": 471.78239999999994, "y1": 103.2672, "y2": 180.1248, "width": 816.0, "height": 1056.0, "pageNumber":10}',
      id: '6806537e-05f6-4cf7-d6a4-67439590640d',
    },
    {
      content: { text: '{"x1": 94.00319999999999, "x2": 720.6336, "y1": 443.664, "y2": 601.6416, "width": 816.0, "height": 1056.0, "pageNumber":10}' },
      position: {
        boundingRect: { x1: 94.00319999999999, x2: 720.6336, y1: 443.664, y2: 601.6416, width: 816.0, height: 1056.0, pageNumber: 1 },
        rects: [{ x1: 94.00319999999999, x2: 720.6336, y1: 443.664, y2: 601.6416, width: 816.0, height: 1056.0, pageNumber: 1 }],
      },
      comment: '{"x1": 94.00319999999999, "x2": 720.6336, "y1": 443.664, "y2": 601.6416, "width": 816.0, "height": 1056.0, "pageNumber":10}',
      id: '18cdbf3e-761e-6308-908c-7924a3f41d2a',
    },
    {
      content: { text: '{"x1": 94.0992, "x2": 721.0944, "y1": 623.7888, "y2": 801.2736, "width": 816.0, "height": 1056.0, "pageNumber":10}' },
      position: {
        boundingRect: { x1: 94.0992, x2: 721.0944, y1: 623.7888, y2: 801.2736, width: 816.0, height: 1056.0, pageNumber: 1 },
        rects: [{ x1: 94.0992, x2: 721.0944, y1: 623.7888, y2: 801.2736, width: 816.0, height: 1056.0, pageNumber: 1 }],
      },
      comment: '{"x1": 94.0992, "x2": 721.0944, "y1": 623.7888, "y2": 801.2736, "width": 816.0, "height": 1056.0, "pageNumber":10}',
      id: 'a204dda1-b93e-fc63-c7ce-4b64ec929e4f',
    },
    {
      content: { text: '{"x1": 94.43520000000001, "x2": 720.6432, "y1": 823.6224, "y2": 940.9632, "width": 816.0, "height": 1056.0, "pageNumber":10}' },
      position: {
        boundingRect: { x1: 94.43520000000001, x2: 720.6432, y1: 823.6224, y2: 940.9632, width: 816.0, height: 1056.0, pageNumber: 1 },
        rects: [{ x1: 94.43520000000001, x2: 720.6432, y1: 823.6224, y2: 940.9632, width: 816.0, height: 1056.0, pageNumber: 1 }],
      },
      comment: '{"x1": 94.43520000000001, "x2": 720.6432, "y1": 823.6224, "y2": 940.9632, "width": 816.0, "height": 1056.0, "pageNumber":10}',
      id: '61c52eaa-a032-6b25-f5f9-fe74cae392ca',
    },
  ]);
  const currentPdfIndexRef = useRef(0);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
  const [pdfScaleValue, setPdfScaleValue] = useState<number | undefined>(undefined);

  // Refs for PdfHighlighter utilities
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>();

  const toggleDocument = () => {
    const urls = [PRIMARY_PDF_URL, SECONDARY_PDF_URL, LONG_LOADING_PDF_URL];
    currentPdfIndexRef.current = (currentPdfIndexRef.current + 1) % urls.length;
    setUrl(urls[currentPdfIndexRef.current]);
    setHighlights(TEST_HIGHLIGHTS[urls[currentPdfIndexRef.current]] ?? []);
  };

  // Click listeners for context menu
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu]);

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>, highlight: ViewportHighlight) => {
    event.preventDefault();

    setContextMenu({
      xPos: event.clientX,
      yPos: event.clientY,
      deleteHighlight: () => deleteHighlight(highlight),
      editComment: () => editComment(highlight),
    });
  };

  const addHighlight = (highlight: GhostHighlight, comment: string) => {
    console.log('Saving highlight', highlight);
    setHighlights([{ ...highlight, comment, id: getNextId() }, ...highlights]);
  };

  const deleteHighlight = (highlight: ViewportHighlight | Highlight) => {
    console.log('Deleting highlight', highlight);
    setHighlights(highlights.filter((h) => h.id != highlight.id));
  };

  const editHighlight = (idToUpdate: string, edit: Partial<CommentedHighlight>) => {
    console.log(`Editing highlight ${idToUpdate} with `, edit);
    setHighlights(highlights.map((highlight) => (highlight.id === idToUpdate ? { ...highlight, ...edit } : highlight)));
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  // Open comment tip and update highlight with new user input
  const editComment = (highlight: ViewportHighlight<CommentedHighlight>) => {
    if (!highlighterUtilsRef.current) return;

    const editCommentTip: Tip = {
      position: highlight.position,
      content: (
        <CommentForm
          placeHolder={highlight.comment}
          onSubmit={(input) => {
            editHighlight(highlight.id, { comment: input });
            highlighterUtilsRef.current!.setTip(null);
            highlighterUtilsRef.current!.toggleEditInProgress(false);
          }}
        ></CommentForm>
      ),
    };

    highlighterUtilsRef.current.setTip(editCommentTip);
    highlighterUtilsRef.current.toggleEditInProgress(true);
  };

  // Scroll to highlight based on hash in the URL
  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight && highlighterUtilsRef.current) {
      highlighterUtilsRef.current.scrollToHighlight(highlight);
    }
  };

  // Hash listeners for autoscrolling to highlights
  useEffect(() => {
    window.addEventListener('hashchange', scrollToHighlightFromHash);

    return () => {
      window.removeEventListener('hashchange', scrollToHighlightFromHash);
    };
  }, [scrollToHighlightFromHash]);

  return (
    <div className="App" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar highlights={highlights} resetHighlights={resetHighlights} toggleDocument={toggleDocument} />
      <div
        style={{
          height: '100vh',
          width: '75vw',
          overflow: 'hidden',
          position: 'relative',
          flexGrow: 1,
        }}
      >
        <Toolbar setPdfScaleValue={(value) => setPdfScaleValue(value)} />
        <PdfLoader document={url}>
          {(pdfDocument) => (
            <PdfHighlighter
              enableAreaSelection={(event) => event.altKey}
              pdfDocument={pdfDocument}
              onScrollAway={resetHash}
              utilsRef={(_pdfHighlighterUtils) => {
                highlighterUtilsRef.current = _pdfHighlighterUtils;
              }}
              pdfScaleValue={pdfScaleValue}
              selectionTip={<ExpandableTip addHighlight={addHighlight} />}
              highlights={highlights}
              style={{
                height: 'calc(100% - 41px)',
              }}
            >
              <HighlightContainer editHighlight={editHighlight} onContextMenu={handleContextMenu} />
            </PdfHighlighter>
          )}
        </PdfLoader>
      </div>

      {contextMenu && <ContextMenu {...contextMenu} />}
    </div>
  );
};

export default App;
