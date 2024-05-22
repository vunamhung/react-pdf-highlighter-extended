import type { Highlight } from './react-pdf-highlighter-extended';
import React from 'react';
import './style/Sidebar.css';
import { CommentedHighlight } from './types';

interface SidebarProps {
  highlights: Array<CommentedHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
}

const updateHash = (highlight: Highlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

declare const APP_VERSION: string;

const Sidebar = ({ highlights, toggleDocument, resetHighlights }: SidebarProps) => {
  return (
    <div className="sidebar" style={{ width: '25vw', maxWidth: '500px' }}>
      {/* Description section */}
      <div className="description" style={{ padding: '1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>react-pdf-highlighter-extended {APP_VERSION}</h2>

        <p style={{ fontSize: '0.7rem' }}>
          <a href="https://github.com/DanielArnould/react-pdf-highlighter-extended">Open in GitHub</a>
        </p>

        <p>
          <small>To create an area highlight hold ⌥ Option key (Alt), then click and drag.</small>
        </p>
      </div>

      {/* Highlights list */}
      {highlights && (
        <ul className="sidebar__highlights">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="sidebar__highlight"
              onClick={() => {
                updateHash(highlight);
              }}
            >
              <div>
                {/* Highlight comment and text */}
                <strong>{highlight.comment}</strong>
                {highlight.content.text && <blockquote style={{ marginTop: '0.5rem' }}>{`${highlight.content.text.slice(0, 90).trim()}…`}</blockquote>}

                {/* Highlight image */}
                {highlight.content.image && (
                  <div className="highlight__image__container" style={{ marginTop: '0.5rem' }}>
                    <img src={highlight.content.image} alt={'Screenshot'} className="highlight__image" />
                  </div>
                )}
              </div>

              {/* Highlight page number */}
              <div className="highlight__location">Page {highlight.position.boundingRect.pageNumber}</div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ padding: '0.5rem' }}>
        <button onClick={toggleDocument} className="sidebar__toggle">
          Toggle PDF document
        </button>
      </div>

      {highlights && highlights.length > 0 && (
        <div style={{ padding: '0.5rem' }}>
          <button onClick={resetHighlights} className="sidebar__reset">
            Reset highlights
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
