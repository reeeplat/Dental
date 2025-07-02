import React, { useState, useEffect } from "react";

const dummyData = [
  {
    id: 1,
    patientName: "홍길동",
    thumbnail: "https://via.placeholder.com/60",
    aiSummary: "충치 의심, 초기 치료 필요",
    doctor: "김철수",
    status: "신청됨",
  },
  {
    id: 2,
    patientName: "이영희",
    thumbnail: "https://via.placeholder.com/60",
    aiSummary: "잇몸 염증 관찰됨",
    doctor: null,
    status: "대기중",
  },
  {
    id: 3,
    patientName: "박민수",
    thumbnail: "https://via.placeholder.com/60",
    aiSummary: "치아 마모 심함",
    doctor: "최지은",
    status: "답변완료",
  },
];

const statusColors = {
  "신청됨": "#1976d2",
  "대기중": "#fbc02d",
  "답변완료": "#388e3c",
};

export default function TelemedicineList({ onSelectPatient }) {
  const [filterStatus, setFilterStatus] = useState("");
  const [searchFields, setSearchFields] = useState({
    patientName: false,
    date: false,
    symptom: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(dummyData);

  useEffect(() => {
    let filtered = dummyData;

    if (filterStatus) {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((item) => {
        const matchesPatientName = searchFields.patientName && item.patientName.includes(searchTerm);
        // date, symptom 검색은 데이터가 없으니 예시로 false 처리
        const matchesDate = false;
        const matchesSymptom = false;
        return matchesPatientName || matchesDate || matchesSymptom;
      });
    }

    setFilteredData(filtered);
  }, [filterStatus, searchTerm, searchFields]);

  const toggleSearchField = (key) => {
    setSearchFields({ ...searchFields, [key]: !searchFields[key] });
  };

  return (
    <div>
      <h3>비대면 진료 신청 목록</h3>

      {/* 상태별 필터 */}
      <div style={{ marginBottom: 12 }}>
        <button
          style={{ marginRight: 8, padding: "6px 12px", backgroundColor: filterStatus === "" ? "#1976d2" : "#eee", color: filterStatus === "" ? "#fff" : "#333", borderRadius: 6, border: "none", cursor: "pointer" }}
          onClick={() => setFilterStatus("")}
        >
          전체
        </button>
        {Object.keys(statusColors).map((status) => (
          <button
            key={status}
            style={{
              marginRight: 8,
              padding: "6px 12px",
              backgroundColor: filterStatus === status ? statusColors[status] : "#eee",
              color: filterStatus === status ? "#fff" : "#333",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 검색 체크박스 */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            checked={searchFields.patientName}
            onChange={() => toggleSearchField("patientName")}
          /> 환자 이름
        </label>
        <label style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            checked={searchFields.date}
            onChange={() => toggleSearchField("date")}
          /> 날짜
        </label>
        <label style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            checked={searchFields.symptom}
            onChange={() => toggleSearchField("symptom")}
          /> 증상 키워드
        </label>
      </div>

      {/* 검색 입력 */}
      <input
        type="text"
        placeholder="검색어 입력"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginBottom: 12 }}
        disabled={!Object.values(searchFields).some(Boolean)}
      />

      {/* 목록 카드 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredData.length === 0 && <p>검색 결과가 없습니다.</p>}
        {filteredData.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: 12,
              borderRadius: 8,
              backgroundColor: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
              borderLeft: `5px solid ${statusColors[item.status] || "#ccc"}`,
            }}
            onClick={() => onSelectPatient(item.id)}
          >
            <img
              src={item.thumbnail}
              alt="썸네일"
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, marginRight: 16 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 16 }}>{item.patientName}</div>
              <div style={{ fontSize: 14, color: "#555" }}>{item.aiSummary}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: "#888" }}>
                담당의: {item.doctor || "미지정"}
              </div>
            </div>
            <button
              style={{
                backgroundColor: "#2cb1e5",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPatient(item.id);
              }}
            >
              수락
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
