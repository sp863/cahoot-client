import { useRef, useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import styled from "styled-components";
import html2canvas from "html2canvas";

//TODO: zoom in and zoom out feature
//TODO: change page feature
const PDFViewer = ({ pdfFile, addPdfImage }) => {
  const [pageCount, setPageCount] = useState(null);
  const documentRef = useRef();
  const pageRef = useRef();
  const [isLoading, setIsLoading] = useState(false); //TODO: loading when changing pages

  const loadedDocumentHandler = ({ numPages }) => {
    setPageCount(numPages);
  };

  const confirmDocumentHandler = async () => {
    for (const page of documentRef.current.pages) {
      const capturedCanvas = await html2canvas(page); //TODO: control quality
      const base64Image = capturedCanvas.toDataURL("image/png");

      addPdfImage((previous) => [...previous, base64Image]);
    }
  };

  return (
    <ViewerContainer>
      <PageContainer
        file={pdfFile}
        ref={documentRef}
        onLoadSuccess={loadedDocumentHandler}
      >
        {Array.from(new Array(pageCount), (value, index) => (
          <Page
            key={`page_${index + 1}`}
            width={600}
            pageNumber={index + 1}
            ref={pageRef}
          />
        ))}
      </PageContainer>
      <PageControlContainer>
        <PageNumber>{pageCount} pages</PageNumber>
        <button onClick={confirmDocumentHandler}>Confirm Document</button>
      </PageControlContainer>
    </ViewerContainer>
  );
};

const ViewerContainer = styled.div`
  width: 95%;
  height: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const PageContainer = styled(Document)`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: 5px;
  background-color: #343a40;
`;

const PageControlContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const PageNumber = styled.div`
  background-color: white;
  padding: 7px;
  border-radius: 5px;
`;

export default PDFViewer;
