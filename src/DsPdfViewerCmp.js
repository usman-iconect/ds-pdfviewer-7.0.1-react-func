import React, { useEffect, useRef } from 'react';
import { DsPdfViewer } from '@mescius/dspdfviewer';
import "@mescius/dspdfviewer/dspdfviewer.worker"

export default function DsPdfViewerComponent(props) {
  const containerRef = useRef(null);

  let viewer;
  useEffect(() => {
    return () => {
      if (!viewer) {
        createViewer(containerRef.current)
      }
    };
  }, []);

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}

async function createViewer(host) {
  var viewer;
  viewer = new DsPdfViewer(host, {
  });
  viewer.addDefaultPanels();
  var afterOpenPromise = new Promise((resolve) => { viewer.onAfterOpen.register(() => { resolve(); }); });

  // viewer.applyToolbarLayout();  
  await viewer.open("/test.pdf");
  await afterOpenPromise;
  // viewer.addFormEditorPanel();
  viewer.layoutMode = 2;

  const findOptions = { Text: "9", MatchCase: false, HighlightAll: false };
  const searchIterator = await viewer.searcher.search(findOptions);
  let resultsCount = 0;
  let searchResult;
  console.log("Search Starting", new Date().toLocaleTimeString())
  do {
    searchResult = await searchIterator.next();
    if (searchResult.value) {
      // this could be either result or progress message (ItemIndex < 0)
      if (searchResult.value.ItemIndex >= 0) {
        console.log('next search result:');
        console.log(searchResult.value);
        resultsCount++;
      }
    }
    else {
      console.log("Search completed", new Date().toLocaleTimeString());
      break;
    }
  }
  while (!searchResult.done);
  console.log('Total results count is ' + resultsCount);

  // searcher.highlight(searchResult.value);
  return viewer;
}
