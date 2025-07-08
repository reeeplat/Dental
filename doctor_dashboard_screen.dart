import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'patient_detail_screen.dart';
import 'TreatmentCalendar.dart';

/// ▶︎ 진료 요청 한 건 모델
class DiagnosisRequestModel {
  final int id;
  final int userId;
  final String name;
  final String submittedAt;
  final String symptomDetail;
  final String status;
  final String requestType;

  DiagnosisRequestModel({
    required this.id,
    required this.userId,
    required this.name,
    required this.submittedAt,
    required this.symptomDetail,
    required this.status,
    required this.requestType,
  });

  factory DiagnosisRequestModel.fromJson(Map<String, dynamic> j) {
    return DiagnosisRequestModel(
      id: j['request_id'] is int ? j['request_id'] : int.tryParse('${j['request_id']}') ?? 0,
      userId: j['user_id'] is int ? j['user_id'] : int.tryParse('${j['user_id']}') ?? 0,
      name: j['user_name'] ?? '이름 없음',
      submittedAt: j['submitted_at'] ?? '',
      symptomDetail: j['symptom_detail'] ?? '',
      status: j['status'] ?? '알 수 없음',
      requestType: j['request_type'] ?? '',
    );
  }
}

class DoctorDashboardScreen extends StatefulWidget {
  const DoctorDashboardScreen({super.key});

  @override
  State<DoctorDashboardScreen> createState() => _DoctorDashboardScreenState();
}

class _DoctorDashboardScreenState extends State<DoctorDashboardScreen> {
  static const String apiBase = 'http://192.168.0.135:5000';

  int _selectedIndex = 0;
  late Future<List<DiagnosisRequestModel>> _futureRequests;

  @override
  void initState() {
    super.initState();
    _futureRequests = _fetchRequests();
  }

  /* ───────── API 호출 (디버깅 로그 포함) ───────── */
  Future<List<DiagnosisRequestModel>> _fetchRequests() async {
    try {
      final uri = Uri.parse('$apiBase/dashboard/requests');
      final res = await http.get(uri);

      debugPrint('[🌐] 상태코드: ${res.statusCode}');
      debugPrint('[🌐] 응답본문 : ${res.body}');

      if (res.statusCode != 200) {
        throw Exception('요청 실패: ${res.statusCode}');
      }

      final List jsonList = jsonDecode(res.body);
      debugPrint('[🌐] 파싱된 항목 수: ${jsonList.length}');
      return jsonList.map((e) => DiagnosisRequestModel.fromJson(e)).toList();
    } catch (e) {
      debugPrint('[❌] _fetchRequests 오류: $e');
      rethrow;
    }
  }

  /* ───────── 색상 헬퍼 ───────── */
  Color _badgeColor(String status) {
    switch (status) {
      case '진료중':
        return Colors.orange.shade100;
      case '대기중':
        return Colors.blue.shade100;
      case '답변완료':
        return Colors.green.shade100;
      default:
        return Colors.grey.shade300;
    }
  }

  void _navigateToPatient(BuildContext context, int userId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PatientDetailScreen(patientId: userId.toString()),
      ),
    );
  }

  /* ───────── UI ───────── */
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TOOTH AI 진료 대시보드'),
        backgroundColor: const Color(0xFF2d5ca8),
      ),
      body: _selectedIndex == 0
          ? FutureBuilder<List<DiagnosisRequestModel>>(
              future: _futureRequests,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(
                    child: Text('⚠️ ${snapshot.error}', textAlign: TextAlign.center),
                  );
                }

                final requests = snapshot.data ?? [];
                if (requests.isEmpty) {
                  return const Center(child: Text('요청이 없습니다.'));
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    setState(() => _futureRequests = _fetchRequests());
                    await _futureRequests;
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: requests.length,
                    itemBuilder: (context, index) {
                      final req = requests[index];

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          title: Text(req.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 4),
                              Text('${req.submittedAt}  |  ${req.symptomDetail}'),
                              const SizedBox(height: 4),
                              Text('요청 유형: ${req.requestType}'),
                            ],
                          ),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: _badgeColor(req.status),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(req.status, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          ),
                          onTap: () => _navigateToPatient(context, req.userId),
                        ),
                      );
                    },
                  ),
                );
              },
            )
          : const TreatmentCalendarScreen(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (idx) => setState(() => _selectedIndex = idx),
        selectedItemColor: const Color(0xFF2d5ca8),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.medical_services), label: '진료 목록'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: '캘린더'),
        ],
      ),
    );
  }
} 