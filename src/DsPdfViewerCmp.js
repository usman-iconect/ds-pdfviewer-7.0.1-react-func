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

  const searcher = viewer.searcher;
  const findOptions = { Text: "9", MatchCase: false, HighlightAll: true };
  const searchIterator = await viewer.searcher.search(findOptions);
  
  const searchResult = await searchIterator.next();
  // searcher.cancel();
  console.log(searchResult)
  console.log(await searchIterator.next())
  console.log(await searchIterator.next())
  console.log(await searchIterator.next())


  searcher.highlight(searchResult.value);

  return viewer;
}
