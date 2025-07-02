import React, { useRef, useState } from 'react';
import 'survey-core/survey-core.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import SignatureCanvas from 'react-signature-canvas';

export default function SurveyDrawing() {
  const surveyJson = {
    title: "치매 검사 질문",
    pages: [{
      elements: [
        { type: "radiogroup", name: "오늘기분", title: "오늘 기분은 어떠세요?", choices: ["좋음","보통","나쁨"] },
        { type: "radiogroup", name: "요일", title: "오늘은 무슨 요일입니까?", choices: ["월","화","수","목","금","토","일"] },
        { type: "text", name: "장소", title: "현재 계신 장소는 어디입니까?" },
        { type: "text", name: "물건기억", title: "세 개 물건을 말씀해 주세요 (예: 나무, 자동차, 모자)" }
      ]
    }]
  };

  const survey = new Model(surveyJson);
  const sigRef = useRef();
  const [surveyResult, setSurveyResult] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  const handleComplete = (sender) => {
    setSurveyResult(sender.data);
  };

  const clearSig = () => sigRef.current.clear();
  const saveSig = () => {
    const data = sigRef.current.toDataURL();
    setSignatureData(data);
  };

  return (
    <div style={{maxWidth:600, margin:'0 auto', padding:20}}>
      <Survey model={survey} onComplete={handleComplete} />
      {surveyResult && (
        <div style={{marginTop:20}}>
          <h3>손으로 그림 또는 서명 해주세요</h3>
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{width:500, height:300, style:{border:'1px solid #999'}}}
          />
          <div style={{marginTop:10}}>
            <button onClick={clearSig}>지우기</button>
            <button onClick={saveSig}>저장</button>
          </div>
          {signatureData && (
            <div style={{marginTop:10}}>
              <h4>미리보기:</h4>
              <img src={signatureData} alt="서명 미리보기" style={{border:'1px solid #555'}}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
