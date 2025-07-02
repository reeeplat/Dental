import React, { useState } from "react";

// 임시 컴포넌트들 (나중에 별도 파일로 분리하세요)
function PatientDetail({ patientId }) {
  return <div>환자 상세 화면 (patientId: {patientId})</div>;
}
function Prescription() {
  return <div>처방전 발급 화면</div>;
}
function Schedule() {
  return <div>진료 예약 화면</div>;
}
function Calendar() {
  return <div>진료 캘린더 화면</div>;
}

// 예시: 비대면 진료 목록 임시 데이터 및 컴포넌트
function TelemedicineList({ onSelectPatient }) {
  const dummyData = [
    { id: 1, patientName: "홍길동", aiSummary: "충치 의심", doctor: "김철수", status: "신청됨" },
    { id: 2, patientName: "이영희", aiSummary: "잇몸 염증", doctor: null, status: "대기중" },
  ];

  return (
    <div>
      <h3>비대면 진료 신청 목록</h3>
      {dummyData.map((item) => (
        <div
          key={item.id}
          style={{
            padding: 10,
            marginBottom: 8,
            border: "1px solid #ccc",
            borderRadius: 6,
            cursor: "pointer",
          }}
          onClick={() => onSelectPatient(item.id)}
        >
          <div><b>{item.patientName}</b> - {item.aiSummary}</div>
          <div>담당의: {item.doctor || "미지정"}</div>
          <div>상태: {item.status}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("telemedicineList");
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const handleSelectPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveTab("patientDetail");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 좌측 사이드바 */}
      <nav
        style={{
          width: 220,
          backgroundColor: "#2cb1e5",
          color: "#fff",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h2 style={{ margin: "0 0 20px 0", fontWeight: "bold" }}>대시보드</h2>
        <TabButton active={activeTab === "telemedicineList"} onClick={() => setActiveTab("telemedicineList")}>
          비대면 진료 신청
        </TabButton>
        <TabButton active={activeTab === "patientDetail"} onClick={() => setActiveTab("patientDetail")} disabled={!selectedPatientId}>
          환자 상세
        </TabButton>
        <TabButton active={activeTab === "prescription"} onClick={() => setActiveTab("prescription")}>
          처방전 발급
        </TabButton>
        <TabButton active={activeTab === "schedule"} onClick={() => setActiveTab("schedule")}>
          진료 예약
        </TabButton>
        <TabButton active={activeTab === "calendar"} onClick={() => setActiveTab("calendar")}>
          진료 캘린더
        </TabButton>
      </nav>

      {/* 메인 콘텐츠 */}
      <main style={{ flex: 1, padding: 20, backgroundColor: "#f5f7fa" }}>
        {activeTab === "telemedicineList" && (
          <TelemedicineList onSelectPatient={handleSelectPatient} />
        )}
        {activeTab === "patientDetail" && selectedPatientId && (
          <PatientDetail patientId={selectedPatientId} />
        )}
        {activeTab === "prescription" && <Prescription />}
        {activeTab === "schedule" && <Schedule />}
        {activeTab === "calendar" && <Calendar />}
      </main>
    </div>
  );
}

function TabButton({ active, disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: active ? "#1976d2" : "transparent",
        border: "none",
        color: disabled ? "#aaa" : "#fff",
        padding: "10px 15px",
        borderRadius: 6,
        cursor: disabled ? "default" : "pointer",
        fontWeight: active ? "bold" : "normal",
        textAlign: "left",
      }}
    >
      {children}
    </button>
  );
}
