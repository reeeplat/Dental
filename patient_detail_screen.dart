import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DiagnosisRequestModel {
  final int id;
  final int userId;
  final String name;
  final String submittedAt;
  final String symptomDetail;
  final String status;
  final String requestType;

  DiagnosisRequestModel.fromJson(Map<String, dynamic> j)
      : id = j['request_id'],
        userId = j['user_id'],
        name = j['user_name'],
        submittedAt = j['submitted_at'],
        symptomDetail = j['symptom_detail'],
        status = j['status'],
        requestType = j['request_type'];
}

class PatientDetailScreen extends StatefulWidget {
  final String patientId;

  const PatientDetailScreen({super.key, required this.patientId});

  @override
  State<PatientDetailScreen> createState() => _PatientDetailScreenState();
}

class _PatientDetailScreenState extends State<PatientDetailScreen> {
  int currentIndex = 0;
  late List<Map<String, dynamic>> images;
  Uint8List? imageData;

  final patient = {
    'id': 'JN7FD168962ZSD6F46',
    'name': '홍길동',
    'gender': '남성',
    'age': 35,
    'tooth': '00번',
    'date': '2025/06/26'
  };

  static const String apiBase = 'http://10.0.2.2:5000';
  late Future<List<DiagnosisRequestModel>> futureRequests;

  @override
  void initState() {
    super.initState();
    images = [
      {'direction': 'front', 'data': null},
      {'direction': 'left', 'data': null},
      {'direction': 'right', 'data': null},
    ];
    futureRequests = _fetchRequests();
  }

  Future<List<DiagnosisRequestModel>> _fetchRequests() async {
    final uri = Uri.parse('$apiBase/dashboard/requests');
    final res = await http.get(uri);

    print('응답코드: ${res.statusCode}');
    print('응답본문: ${res.body}');

    if (res.statusCode != 200) {
      throw Exception('요청 목록을 불러오지 못했습니다 (${res.statusCode})');
    }

    final List jsonList = jsonDecode(res.body);
    print('파싱된 리스트 길이: ${jsonList.length}');

    return jsonList.map((e) => DiagnosisRequestModel.fromJson(e)).toList();
  }

  void handlePrev() {
    setState(() {
      currentIndex = currentIndex == 0 ? images.length - 1 : currentIndex - 1;
    });
  }

  void handleNext() {
    setState(() {
      currentIndex = currentIndex == images.length - 1 ? 0 : currentIndex + 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    final currentImage = images[currentIndex];

    return Scaffold(
      appBar: AppBar(
        title: const Text('환자 상세 정보'),
        backgroundColor: const Color(0xFF2d5ca8),
        leading: BackButton(onPressed: () => Navigator.of(context).pop()),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('환자 구강 이미지', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Container(
              height: 240,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade400),
                borderRadius: BorderRadius.circular(12),
                color: Colors.white,
              ),
              child: Center(
                child: imageData == null
                    ? const Text('📷', style: TextStyle(fontSize: 48))
                    : Image.memory(imageData!),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(onPressed: handlePrev, icon: const Icon(Icons.arrow_left)),
                Text(currentImage['direction']),
                IconButton(onPressed: handleNext, icon: const Icon(Icons.arrow_right)),
              ],
            ),
            const SizedBox(height: 20),
            const Text('AI 진단 결과', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Container(
              height: 100,
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: FutureBuilder<List<DiagnosisRequestModel>>(
                future: futureRequests,
                builder: (context, snapshot) {
                  if (snapshot.connectionState != ConnectionState.done) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (snapshot.hasError) {
                    return Center(child: Text('⚠️ ${snapshot.error}'));
                  }
                  if (snapshot.data == null || snapshot.data!.isEmpty) {
                    return const Center(child: Text('AI 예측 결과 없음'));
                  }

                  final matched = snapshot.data!
                      .firstWhere((e) => e.userId.toString() == widget.patientId, orElse: () => DiagnosisRequestModel.fromJson({
                        'request_id': 0,
                        'user_id': 0,
                        'user_name': 'N/A',
                        'submitted_at': 'N/A',
                        'symptom_detail': 'N/A',
                        'status': 'N/A',
                        'request_type': 'N/A',
                      }));

                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('상태: ${matched.status}'),
                      Text('유형: ${matched.requestType}'),
                      Text('증상: ${matched.symptomDetail}'),
                    ],
                  );
                },
              ),
            ),
            const SizedBox(height: 24),
            const Text('환자 정보', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('👤 ${patient['name']}', style: const TextStyle(fontWeight: FontWeight.bold)),
            Text('환자 ID: ${patient['id']}'),
            Text('성별: ${patient['gender']}'),
            Text('나이: ${patient['age']}'),
            Text('발치부: ${patient['tooth']}'),
            Text('방문일: ${patient['date']}'),
            const SizedBox(height: 24),
            const Text('의사 진단 및 수정', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                ElevatedButton(onPressed: () {}, child: const Text('표시')),
                ElevatedButton(onPressed: () {}, child: const Text('수정')),
                ElevatedButton(onPressed: () {}, child: const Text('확대')),
                ElevatedButton(onPressed: () {}, child: const Text('측정')),
                ElevatedButton(onPressed: () {}, child: const Text('초기화')),
              ],
            ),
            const SizedBox(height: 16),
            const TextField(
              maxLines: 4,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: '진단 내용을 입력하세요',
              ),
            ),
            const SizedBox(height: 12),
            const TextField(
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: '치료 계획 입력',
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                OutlinedButton(onPressed: () {}, child: const Text('초기화')),
                const SizedBox(width: 12),
                ElevatedButton(onPressed: () {}, child: const Text('저장하기')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
