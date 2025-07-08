import 'package:flutter/material.dart';

class TreatmentCalendarScreen extends StatefulWidget {
  const TreatmentCalendarScreen({super.key});

  @override
  State<TreatmentCalendarScreen> createState() => _TreatmentCalendarScreenState();
}

class _TreatmentCalendarScreenState extends State<TreatmentCalendarScreen> {
  final int year = 2025;
  int month = 7;
  int? selectedDay;

  final Map<String, List<Map<String, String>>> detailedSchedules = {
    '2025-07-02': [
      {
        'name': '홍길동',
        'time': '09:30 - 10:00',
        'purpose': '정기 검진',
        'status': '신청중',
      },
    ],
    '2025-07-09': [
      {
        'name': '김철수',
        'time': '10:30 - 11:00',
        'purpose': '충치 치료',
        'status': '대기중',
      },
      {
        'name': '이영희',
        'time': '13:30 - 14:00',
        'purpose': '임플란트 상담',
        'status': '답변완료',
      },
    ],
    '2025-07-15': [
      {
        'name': '박예은',
        'time': '11:00 - 11:30',
        'purpose': '사랑니 치료',
        'status': '신청중',
      },
    ],
  };

  final Map<int, String> daySchedules = {
    2: '종일진료',
    5: '종일진료',
    9: '오전진료',
    15: '오후진료',
    18: '오전진료',
    20: '오후진료',
    25: '오후진료',
  };

  final Map<String, Color> scheduleColors = {
    '종일진료': Color(0xFF4A90E2),
    '오전진료': Color(0xFF7ED321),
    '오후진료': Color(0xFFD0021B),
  };

  String? get selectedDateStr => selectedDay != null
      ? '$year-${month.toString().padLeft(2, '0')}-${selectedDay.toString().padLeft(2, '0')}'
      : null;

  void prevMonth() {
    setState(() {
      if (month == 1) {
        month = 12;
      } else {
        month--;
      }
      selectedDay = null;
    });
  }

  void nextMonth() {
    setState(() {
      if (month == 12) {
        month = 1;
      } else {
        month++;
      }
      selectedDay = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    final firstWeekday = DateTime(year, month, 1).weekday % 7;
    final lastDate = DateTime(year, month + 1, 0).day;
    final blanks = List.generate(firstWeekday, (_) => null);
    final days = List.generate(lastDate, (i) => i + 1);
    final schedules = selectedDateStr != null
        ? detailedSchedules[selectedDateStr!] ?? []
        : [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('진료 캘린더'),
        backgroundColor: const Color(0xFF2d5ca8),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🔘 월 선택
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(onPressed: prevMonth, icon: const Icon(Icons.chevron_left)),
                Text(
                  '$year년 ${month.toString().padLeft(2, '0')}월',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                IconButton(onPressed: nextMonth, icon: const Icon(Icons.chevron_right)),
              ],
            ),
            const SizedBox(height: 10),

            // 요일
            GridView.count(
              crossAxisCount: 7,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: weekdays
                  .map((d) => Center(
                        child: Text(d, style: const TextStyle(fontWeight: FontWeight.bold)),
                      ))
                  .toList(),
            ),

            // 날짜들
            GridView.count(
              crossAxisCount: 7,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                ...blanks.map((_) => const SizedBox()),
                ...days.map((day) {
                  final type = daySchedules[day];
                  final isSelected = selectedDay == day;
                  final bgColor = isSelected
                      ? Colors.black
                      : scheduleColors[type] ?? Colors.transparent;
                  final textColor = isSelected
                      ? Colors.white
                      : scheduleColors.containsKey(type)
                          ? Colors.white
                          : Colors.black;
                  return GestureDetector(
                    onTap: () => setState(() => selectedDay = day),
                    child: Container(
                      margin: const EdgeInsets.all(4),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: bgColor,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Center(
                        child: Text(
                          day.toString().padLeft(2, '0'),
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                      ),
                    ),
                  );
                }),
              ],
            ),
            const SizedBox(height: 12),

            // 색상 범례
            Wrap(
              spacing: 12,
              children: scheduleColors.entries
                  .map((entry) => Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 14,
                            height: 14,
                            decoration: BoxDecoration(
                              color: entry.value,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(entry.key, style: const TextStyle(fontSize: 12)),
                        ],
                      ))
                  .toList(),
            ),
            const SizedBox(height: 20),

            // 예약 상세
            Text(
              selectedDateStr != null ? '$selectedDateStr 진료 일정' : '날짜를 선택해주세요',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            if (selectedDateStr == null)
              const Text('날짜를 탭하여 일정을 확인하세요.')
            else if (schedules.isEmpty)
              const Text('예약된 일정이 없습니다.')
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: schedules.length,
                itemBuilder: (context, index) {
                  final item = schedules[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      title: Text('${item['name']} (${item['time']})'),
                      subtitle: Text(item['purpose'] ?? ''),
                      trailing: Text(item['status'] ?? ''),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
