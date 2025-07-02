import React, { useState } from "react";

export default function Signup({ onBackToLogin }) {
  const [form, setForm] = useState({
    name: "",
    hospitalName: "",
    hospitalAddress: "",
    licenseNumber: "",
    licenseFile: null,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // 동의 사항 및 법조항 표시 상태
  const [agreements, setAgreements] = useState({
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
    all: false,
  });
  const [showLaw, setShowLaw] = useState({
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
  });

  // 병원 주소 찾기 팝업 상태
  const [showAddressPopup, setShowAddressPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "licenseFile") {
      setForm((f) => ({ ...f, licenseFile: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    // 변경 시 기존 에러 삭제
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  // 동의 체크박스 토글
  const toggleAgreement = (key) => {
    if (key === "all") {
      // 전체 동의 체크/해제
      const newVal = !agreements.all;
      setAgreements({
        terms1: newVal,
        terms2: newVal,
        terms3: newVal,
        terms4: newVal,
        all: newVal,
      });
    } else {
      const newAgreements = { ...agreements, [key]: !agreements[key] };
      // 전체 동의는 개별 동의가 모두 true일 때만 true
      const allChecked = ["terms1", "terms2", "terms3", "terms4"].every((k) => newAgreements[k]);
      setAgreements({ ...newAgreements, all: allChecked });
    }
  };

  const toggleShowLaw = (key) => {
    setShowLaw((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 유효성 검사
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "성명을 입력해주세요.";
    if (!form.hospitalName.trim()) newErrors.hospitalName = "병원명을 입력해주세요.";
    if (!form.hospitalAddress.trim()) newErrors.hospitalAddress = "병원 주소를 입력해주세요.";
    if (!form.licenseNumber.trim()) newErrors.licenseNumber = "의사 면허 번호를 입력해주세요.";
    if (!form.licenseFile) newErrors.licenseFile = "면허증 사진을 업로드 해주세요.";
    if (!form.password) newErrors.password = "비밀번호를 입력해주세요.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    // 필수 동의 체크
    ["terms1", "terms2", "terms3", "terms4"].forEach((key) => {
      if (!agreements[key]) newErrors[key] = "필수 동의 사항에 체크해주세요.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // 실제 회원가입 로직 처리
    alert("회원가입이 완료되었습니다.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Noto Sans KR', sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 10,
          width: 420,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>회원 가입</h2>

        <div style={{ backgroundColor: "#bdf0f9", padding: 20, borderRadius: 10 }}>
          <Input
            label="성명"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="소속 병원명"
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            error={errors.hospitalName}
          />
          <InputWithButton
            label="병원 주소"
            name="hospitalAddress"
            value={form.hospitalAddress}
            onChange={handleChange}
            buttonText="주소 찾기"
            onButtonClick={() => setShowAddressPopup(true)}
            error={errors.hospitalAddress}
          />
          {/* 주소 찾기 팝업 */}
          {showAddressPopup && (
            <AddressPopup
              onClose={() => setShowAddressPopup(false)}
              onSelectAddress={(addr) => {
                setForm((f) => ({ ...f, hospitalAddress: addr }));
                setShowAddressPopup(false);
                setErrors((e) => ({ ...e, hospitalAddress: "" }));
              }}
            />
          )}

          <Input
            label="의사 면허 번호"
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
            error={errors.licenseNumber}
          />

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 4 }}>
              면허증 사진 업로드 (필수)
            </label>
            <input
              type="file"
              name="licenseFile"
              accept="image/*"
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            {errors.licenseFile && (
              <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.licenseFile}</div>
            )}
          </div>
             <Input
    label="아이디"
    name="userId"
    value={form.userId}
    onChange={handleChange}
    error={errors.userId}
          />
          <Input
            label="비밀번호"
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            error={errors.password}
          />
          <Input
            label="비밀번호 확인"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            type="password"
            error={errors.confirmPassword}
          />
        </div>

        {/* 동의 체크박스 */}
        <div style={{ marginTop: 20 }}>
          <CheckboxWithLaw
            label="개인 정보 수집 및 이용에 관한 동의 (필수)"
            checked={agreements.terms1}
            onChange={() => toggleAgreement("terms1")}
            onLabelClick={() => toggleShowLaw("terms1")}
            showLaw={showLaw.terms1}
            lawText="관련 법 조항: 개인정보 보호법 제15조 등"
            error={errors.terms1}
          />
          <CheckboxWithLaw
            label="의사 면허 등록 및 자격 검증 동의 (필수)"
            checked={agreements.terms2}
            onChange={() => toggleAgreement("terms2")}
            onLabelClick={() => toggleShowLaw("terms2")}
            showLaw={showLaw.terms2}
            lawText="관련 법 조항: 의료법 제24조 등"
            error={errors.terms2}
          />
          <CheckboxWithLaw
            label="정보 저장 및 활용 동의 (필수)"
            checked={agreements.terms3}
            onChange={() => toggleAgreement("terms3")}
            onLabelClick={() => toggleShowLaw("terms3")}
            showLaw={showLaw.terms3}
            lawText="관련 법 조항: 정보통신망법 제22조 등"
            error={errors.terms3}
          />
          <CheckboxWithLaw
            label="컨텐츠/기록 유관 이용 목적에 대한 사전 고지 (필수)"
            checked={agreements.terms4}
            onChange={() => toggleAgreement("terms4")}
            onLabelClick={() => toggleShowLaw("terms4")}
            showLaw={showLaw.terms4}
            lawText="관련 법 조항: 저작권법 제35조 등"
            error={errors.terms4}
          />

          <div style={{ marginTop: 8 }}>
            <label style={{ cursor: "pointer", userSelect: "none" }}>
              <input
                type="checkbox"
                checked={agreements.all}
                onChange={() => toggleAgreement("all")}
                style={{ marginRight: 8 }}
              />
              전체 동의
            </label>
          </div>
        </div>

        <button
          style={{
            marginTop: 20,
            width: "100%",
            backgroundColor: "#2cb1e5",
            color: "white",
            padding: 12,
            fontSize: 16,
            fontWeight: "bold",
            border: "none",
            borderRadius: 8,
            cursor:
              Object.keys(errors).length === 0 &&
              form.name &&
              form.hospitalName &&
              form.hospitalAddress &&
              form.licenseNumber &&
              form.licenseFile &&
              form.password &&
              form.password === form.confirmPassword &&
              ["terms1", "terms2", "terms3", "terms4"].every((k) => agreements[k])
                ? "pointer"
                : "not-allowed",
            opacity:
              Object.keys(errors).length === 0 &&
              form.name &&
              form.hospitalName &&
              form.hospitalAddress &&
              form.licenseNumber &&
              form.licenseFile &&
              form.password &&
              form.password === form.confirmPassword &&
              ["terms1", "terms2", "terms3", "terms4"].every((k) => agreements[k])
                ? 1
                : 0.6,
          }}
          disabled={
            !(
              form.name &&
              form.hospitalName &&
              form.hospitalAddress &&
              form.licenseNumber &&
              form.licenseFile &&
              form.password &&
              form.password === form.confirmPassword &&
              ["terms1", "terms2", "terms3", "terms4"].every((k) => agreements[k])
            )
          }
          onClick={handleSubmit}
        >
          회원 가입
        </button>

        <button
          onClick={onBackToLogin}
          style={{
            marginTop: 10,
            width: "100%",
            backgroundColor: "transparent",
            color: "#666",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", error }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontWeight: "bold", display: "block", marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: error ? "1.5px solid red" : "1px solid #ccc",
        }}
      />
      {error && (
        <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  );
}

function InputWithButton({ label, name, value, onChange, buttonText, onButtonClick, error }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontWeight: "bold", display: "block", marginBottom: 4 }}>{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: error ? "1.5px solid red" : "1px solid #ccc",
          }}
        />
        <button
          type="button"
          onClick={onButtonClick}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #999",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {buttonText}
        </button>
      </div>
      {error && (
        <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  );
}

function CheckboxWithLaw({ label, checked, onChange, onLabelClick, showLaw, lawText, error }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ marginRight: 8 }}
        />
        <span onClick={onLabelClick} style={{ textDecoration: "underline", color: "#007bff" }}>
          {label}
        </span>
      </label>
      {showLaw && (
        <div
          style={{
            backgroundColor: "#eef6fc",
            padding: 8,
            marginTop: 4,
            fontSize: 12,
            borderRadius: 6,
            color: "#333",
            whiteSpace: "pre-wrap",
          }}
        >
          {lawText}
        </div>
      )}
      {error && (
        <div style={{ color: "red", fontSize: 12, marginTop: 2 }}>
          {error}
        </div>
      )}
    </div>
  );
}

// 간단 주소찾기 팝업 예시
function AddressPopup({ onClose, onSelectAddress }) {
  const sampleAddresses = [
    "서울특별시 강남구 테헤란로 123",
    "경기도 성남시 분당구 판교역로 456",
    "부산광역시 해운대구 해운대로 789",
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: 20,
          width: 320,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>병원 주소 찾기</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {sampleAddresses.map((addr, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              <button
                type="button"
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  background: "#f9f9f9",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onClick={() => onSelectAddress(addr)}
              >
                {addr}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "none",
            background: "#ccc",
            cursor: "pointer",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

