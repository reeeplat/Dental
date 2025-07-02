import React, { useState } from "react";

export default function FindAccount({ onBackToLogin }) {
  const [form, setForm] = useState({
    userIdOrEmail: "",
  });

  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ userIdOrEmail: e.target.value });
    setError("");
    setInfoMessage("");
  };

  const handleSubmit = () => {
    if (!form.userIdOrEmail.trim()) {
      setError("아이디 또는 이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");

    // TODO: 서버 API 호출하여 아이디/비밀번호 찾기 로직 처리
    setTimeout(() => {
      setLoading(false);
      // 예시 결과 메시지
      setInfoMessage(
        `입력하신 정보로 인증번호가 발송되었습니다. 이메일 또는 휴대폰을 확인해주세요.`
      );
    }, 1500);
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
          width: 400,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>아이디/비밀번호 찾기</h2>

        <div style={{ backgroundColor: "#bdf0f9", padding: 20, borderRadius: 10 }}>
          <label
            htmlFor="userIdOrEmail"
            style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
          >
            아이디 또는 이메일
          </label>
          <input
            id="userIdOrEmail"
            type="text"
            name="userIdOrEmail"
            value={form.userIdOrEmail}
            onChange={handleChange}
            placeholder="아이디 또는 이메일을 입력하세요"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: error ? "1.5px solid red" : "1px solid #ccc",
              marginBottom: 8,
              fontSize: 16,
            }}
          />
          {error && (
            <div style={{ color: "red", fontSize: 12, marginBottom: 12 }}>{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#2cb1e5",
              color: "white",
              padding: 12,
              fontSize: 16,
              fontWeight: "bold",
              border: "none",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "처리 중..." : "인증번호 발송"}
          </button>

          {infoMessage && (
            <div
              style={{
                marginTop: 20,
                backgroundColor: "#e0f0ff",
                padding: 12,
                borderRadius: 6,
                fontSize: 14,
                color: "#007bff",
              }}
            >
              {infoMessage}
            </div>
          )}
        </div>

        <button
          onClick={onBackToLogin}
          style={{
            marginTop: 16,
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
