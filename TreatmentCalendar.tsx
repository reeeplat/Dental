import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ScheduleType = '종일진료' | '오전진료' | '오후진료';

interface ScheduleItem {
  name: string;
  time: string;
  purpose: string;
  status: '신청중' | '대기중' | '답변완료' | string;
}

const scheduleColors: Record<ScheduleType, string> = {
  종일진료: '#4A90E2',
  오전진료: '#7ED321',
  오후진료: '#D0021B',
};

const detailedSchedules: Record<string, ScheduleItem[]> = {
  '2025-07-02': [{ name: '홍길동', time: '09:30 - 10:00', purpose: '정기 검진', status: '신청중' }],
  '2025-07-09': [
    { name: '김철수', time: '10:30 - 11:00', purpose: '충치 치료', status: '대기중' },
    { name: '이영희', time: '13:30 - 14:00', purpose: '임플란트 상담', status: '답변완료' },
  ],
  '2025-07-15': [{ name: '박예은', time: '11:00 - 11:30', purpose: '사랑니 치료', status: '신청중' }],
};

export default function CalendarWithDetails() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(7);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [availableDate, setAvailableDate] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [availableType, setAvailableType] = useState<ScheduleType>('종일진료');

  const navigate = useNavigate();

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const firstDayWeekday = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setMonth((prev) => (prev === 1 ? 12 : prev - 1));
    setYear((prev) => (month === 1 ? prev - 1 : prev));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setMonth((prev) => (prev === 12 ? 1 : prev + 1));
    setYear((prev) => (month === 12 ? prev + 1 : prev));
    setSelectedDay(null);
  };

  const daySchedules: Record<number, ScheduleType> = {
    2: '종일진료',
    5: '종일진료',
    9: '오전진료',
    15: '오후진료',
    18: '오전진료',
    20: '오후진료',
    25: '오후진료',
  };

  const blanks = Array(firstDayWeekday).fill(null);
  const days = Array.from({ length: lastDate }, (_, i) => i + 1);

  const selectedDateStr = selectedDay
    ? `${year}-${month.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
    : null;

  const selectedSchedules = selectedDateStr ? detailedSchedules[selectedDateStr] || [] : [];

  const handleRegisterAvailable = () => {
    if (!availableDate || !availableTime) {
      alert('날짜와 시간을 모두 선택해주세요.');
      return;
    }
    alert(`진료 가능일 등록됨\n날짜: ${availableDate}\n시간: ${availableTime}\n진료 유형: ${availableType}`);
    setAvailableDate('');
    setAvailableTime('');
    setAvailableType('종일진료');
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 40,
        fontFamily: 'Arial, sans-serif',
        padding: 24,
        backgroundColor: '#f5f7fa',
        boxSizing: 'border-box',
        alignItems: 'flex-start',
      }}
    >
      {/* 달력 영역 */}
      <div
        style={{
          width: 400,
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 24,
          backgroundColor: 'white',
          userSelect: 'none',
          boxShadow: '0 0 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16, borderBottom: '1px solid #ccc', paddingBottom: 12 }}>
          🔘 날짜/시간 선택
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 12, fontSize: 18, fontWeight: 'bold' }}>
          <button onClick={prevMonth} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>◀</button>
          <div>{year}년 {month.toString().padStart(2, '0')}월</div>
          <button onClick={nextMonth} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>▶</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
          {weekdays.map((d) => <div key={d}>{d}</div>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, minHeight: 260 }}>
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map((date) => {
            const scheduleType = daySchedules[date] || null;
            const bgColor = scheduleType ? scheduleColors[scheduleType] : 'transparent';
            const isSelected = selectedDay === date;

            return (
              <div
                key={date}
                onClick={() => setSelectedDay(date)}
                style={{
                  borderRadius: 6,
                  padding: '10px 0',
                  backgroundColor: isSelected ? '#333' : bgColor,
                  color: isSelected ? 'white' : scheduleType ? 'white' : 'black',
                  cursor: 'pointer',
                  boxShadow: scheduleType && !isSelected ? '0 0 8px rgba(0,0,0,0.2)' : undefined,
                  fontWeight: '600',
                  fontSize: 14,
                  textAlign: 'center',
                }}
                title={scheduleType || '진료 없음'}
              >
                {date.toString().padStart(2, '0')}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, borderTop: '1px solid #ccc', paddingTop: 16, display: 'flex', justifyContent: 'center', gap: 16 }}>
          {(['종일진료', '오전진료', '오후진료'] as ScheduleType[]).map((type) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 22, height: 22,
                  backgroundColor: scheduleColors[type],
                  borderRadius: 5, boxShadow: '0 0 8px rgba(0,0,0,0.12)'
                }}
              />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 일정 + 등록 폼 */}
      <div
        style={{
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 24,
          backgroundColor: 'white',
          boxShadow: '0 0 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>
          {selectedDateStr ? `${selectedDateStr} 진료 일정` : '날짜를 선택해주세요'}
        </div>

        {/* 일정 출력 */}
        <div style={{ minHeight: 150, marginBottom: 24 }}>
          {selectedDateStr ? (
            selectedSchedules.length > 0 ? (
              selectedSchedules.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderBottom: '1px solid #eee',
                    fontSize: 15,
                  }}
                >
                  <div>
                    <strong
                      style={{ cursor: 'pointer', color: '#1E90FF' }}
                      onClick={() => navigate(`/patient/${encodeURIComponent(item.name)}`)}
                      title={`${item.name} 상세 페이지로 이동`}
                    >
                      {item.name}
                    </strong>{' '}
                    ({item.time}) | {item.purpose}
                  </div>
                  <div
                    style={{
                      backgroundColor:
                        item.status === '신청중'
                          ? '#FFD54F'
                          : item.status === '대기중'
                          ? '#4FC3F7'
                          : item.status === '답변완료'
                          ? '#81C784'
                          : '#ccc',
                      padding: '4px 12px',
                      borderRadius: 14,
                      fontSize: 13,
                      fontWeight: 'bold',
                    }}
                  >
                    {item.status}
                  </div>
                </div>
              ))
            ) : (
              <p>선택한 날짜에 예약된 일정이 없습니다.</p>
            )
          ) : (
            <p>날짜를 선택해주세요.</p>
          )}
        </div>

        {/* 진료 가능일 등록 폼 */}
        <div style={{ borderTop: '1px solid #ccc', paddingTop: 16 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 12 }}>진료 가능 일 등록</div>

          <label style={{ display: 'block', marginBottom: 6 }}>
            날짜 선택
            <input
              type="date"
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              style={{ marginLeft: 12, padding: 6, fontSize: 14 }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 6 }}>
            시간 선택
            <input
              type="time"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              style={{ marginLeft: 12, padding: 6, fontSize: 14 }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 12 }}>
            진료 유형
            <select
              value={availableType}
              onChange={(e) => setAvailableType(e.target.value as ScheduleType)}
              style={{ marginLeft: 12, padding: 6, fontSize: 14 }}
            >
              <option value="종일진료">종일진료</option>
              <option value="오전진료">오전진료</option>
              <option value="오후진료">오후진료</option>
            </select>
          </label>

          <button
            onClick={handleRegisterAvailable}
            style={{
              width: '100%',
              padding: 10,
              backgroundColor: '#4A90E2',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            진료 가능 일 등록
          </button>
        </div>
      </div>
    </div>
  );
}







