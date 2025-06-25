-- 공지사항 테이블 생성
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT '일반공지',
  is_important BOOLEAN DEFAULT FALSE,
  author VARCHAR(100) NOT NULL DEFAULT '관리자',
  status VARCHAR(20) DEFAULT 'active',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 업데이트 시간 자동 갱신을 위한 함수 및 트리거 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notices_updated_at 
  BEFORE UPDATE ON notices 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 예시 데이터 삽입
INSERT INTO notices (title, content, category, is_important, author, created_at) VALUES 
(
  '2024년 설 연휴 운영시간 변경 안내',
  '안녕하세요. 아쿠아리움 파크입니다.

설 연휴 기간 중 운영시간이 다음과 같이 변경됩니다:

• 2월 9일(금) ~ 2월 12일(월): 오전 9시 ~ 오후 8시
• 2월 13일(화) 정상 운영: 오전 9시 ~ 오후 10시

방문 전 운영시간을 꼭 확인해주시기 바랍니다.
감사합니다.',
  '운영안내',
  TRUE,
  '관리자',
  '2024-02-05 10:00:00+09'
),
(
  '신규 해양생물 전시 시작',
  '새로운 해양생물들을 만나보세요!

이번에 새롭게 들어온 해양생물들:
• 산호초존: 다양한 산호 종류 20여 종
• 열대어존: 신규 열대어 15종
• 특별전시관: 해파리 전시

더욱 풍성해진 전시를 즐겨보시기 바랍니다.',
  '이벤트',
  FALSE,
  '전시팀',
  '2024-01-20 14:30:00+09'
),
(
  '시설 점검으로 인한 일부 구역 출입 제한',
  '안전점검으로 인한 일부 구역 출입 제한 안내

점검 기간: 2024년 1월 16일(화) ~ 1월 18일(목)
제한 구역: 2층 터치풀 구역

• 해당 기간 중 터치풀 체험이 불가합니다
• 다른 모든 구역은 정상 운영됩니다
• 불편을 드려 죄송합니다

문의사항은 고객센터로 연락 부탁드립니다.',
  '긴급공지',
  TRUE,
  '시설관리팀',
  '2024-01-15 09:00:00+09'
),
(
  '가이드 투어 프로그램 확대 운영',
  '가이드 투어 프로그램이 확대 운영됩니다!

기존 운영시간:
• 평일: 오후 2시, 4시
• 주말: 오전 11시, 오후 2시, 4시

확대 운영시간 (2024년 1월 15일부터):
• 평일: 오전 11시, 오후 2시, 4시, 6시
• 주말: 오전 10시, 11시, 오후 2시, 4시, 6시

더 많은 시간대에 전문 가이드와 함께 하는 알찬 투어를 경험해보세요!',
  '프로그램',
  FALSE,
  '교육팀',
  '2024-01-10 11:00:00+09'
),
(
  '겨울 특별 이벤트 - 펭귄 먹이주기 체험',
  '추운 겨울, 따뜻한 실내에서 즐기는 특별한 체험!

🐧 펭귄 먹이주기 체험
• 기간: 2024년 1월 1일 ~ 2월 29일
• 시간: 매일 오후 3시 30분
• 참가비: 5,000원 (입장권 별도)
• 선착순 20명

펭귄들과 가까이서 만나는 특별한 기회를 놓치지 마세요!
현장 접수만 가능하며, 안전을 위해 어린이는 보호자 동반 필수입니다.',
  '이벤트',
  FALSE,
  '이벤트팀',
  '2024-01-05 16:00:00+09'
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_notices_status ON notices(status);
CREATE INDEX idx_notices_category ON notices(category);
CREATE INDEX idx_notices_is_important ON notices(is_important);
CREATE INDEX idx_notices_created_at ON notices(created_at DESC); 