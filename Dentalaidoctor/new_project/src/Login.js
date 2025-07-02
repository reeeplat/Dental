import React, { useState } from "react";

const API_BASE_URL = "http://localhost:8000";

export default function Login({ onLogin, onSignupClick, onFindAccountClick }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [keepLogin, setKeepLogin] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email) return setErr("아이디를 입력해주세요.");
    if (!pwd) return setErr("비밀번호를 입력해주세요.");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/doctor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password: pwd }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErr(data.detail || "로그인에 실패했습니다.");
      } else {
        alert("로그인 성공");
        onLogin(data.access_token, keepLogin); // 로그인 성공 시 상위에 알림
      }
    } catch {
      setErr("서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#d7e2f1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 40,
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      {/* 상단 치아 이미지 */}
      <img
        src="/images/tooth_character.png"
        alt="Tooth Character"
        style={{ width: 160, marginBottom: 40 }}
      />

      {/* 입력 폼 박스 */}
      <form
        onSubmit={submit}
        style={{
          backgroundColor: "#e2ebf5",
          borderRadius: 8,
          padding: "30px 40px",
          width: 320,
          boxSizing: "border-box",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label
          htmlFor="email"
          style={{ fontSize: 14, marginBottom: 6, fontWeight: "bold" }}
        >
          아이디
        </label>
        <input
          id="email"
          type="email"
          placeholder="ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            marginBottom: 16,
            fontSize: 16,
          }}
        />

        <label
          htmlFor="pwd"
          style={{ fontSize: 14, marginBottom: 6, fontWeight: "bold" }}
        >
          비밀번호
        </label>
        <input
          id="pwd"
          type="password"
          placeholder="비밀번호"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            marginBottom: 16,
            fontSize: 16,
          }}
        />

        {/* 로그인 상태 유지 */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 14,
            marginBottom: 24,
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={keepLogin}
            onChange={() => setKeepLogin(!keepLogin)}
            style={{ marginRight: 8, width: 18, height: 18 }}
          />
          로그인 상태 유지
        </label>

        {err && (
          <div
            style={{
              color: "red",
              marginBottom: 16,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#4c72b9",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: 12,
            fontSize: 18,
            fontWeight: "bold",
            cursor: loading ? "default" : "pointer",
            marginBottom: 20,
          }}
        >
          {loading ? "로그인 중..." : "Login"}
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            color: "#444",
          }}
        >
          <button
            type="button"
            onClick={onFindAccountClick}
            style={{
              background: "none",
              border: "none",
              color: "#333",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            아이디/비밀번호 찾기
          </button>

          <button
            type="button"
            onClick={onSignupClick}
            style={{
              background: "none",
              border: "none",
              color: "#333",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            회원 가입
          </button>
        </div>
      </form>
    </div>
  );
}
