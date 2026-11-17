// 사이트 콘텐츠 데이터. React(초기 렌더)와 Hono API(server/app.ts)가 함께 사용합니다.
// 수치와 일정은 시안 단계의 대략치이므로 공개 전에 확인이 필요합니다.

export type Tone = 'sci' | 'nat' | 'clay'

export interface Place {
  id: string
  name: string
  tag: string
  tone: Tone
  icon: 'tower' | 'atom' | 'tree' | 'lake' | 'trail' | 'spa'
  description: string
  location: string
}

export interface Dish {
  kind: string
  name: string
  description: string
}

export interface Festival {
  month: number
  name: string
  tone: Tone
}

export interface District {
  id: string
  name: string
  keyword: string
  description: string
  spots: string[]
}

export interface KtxRoute {
  from: string
  minutes: number
}

export const facts = [
  { value: '540', unit: '㎢', label: '시 면적 (약)' },
  { value: '144', unit: '만 명', label: '인구 (약)' },
  { value: '5', unit: '개 구', label: '동구 · 중구 · 서구 · 유성구 · 대덕구' },
  { value: '1993', unit: '년', label: '대전 엑스포 개최' },
]

export const ktxRoutes: KtxRoute[] = [
  { from: '서울', minutes: 60 },
  { from: '동대구', minutes: 50 },
  { from: '부산', minutes: 100 },
]

export const places: Place[] = [
  { id: 'expo', name: '엑스포과학공원 · 한빛탑', tag: '과학', tone: 'sci', icon: 'tower', description: '1993 대전 엑스포의 상징. 밤에는 갑천변 음악분수와 함께 빛납니다.', location: '유성구 도룡동' },
  { id: 'science-museum', name: '국립중앙과학관', tag: '과학', tone: 'sci', icon: 'atom', description: '자연사부터 우주까지, 아이와 함께 하루를 보내기 좋은 전시관.', location: '유성구 구성동' },
  { id: 'arboretum', name: '한밭수목원', tag: '자연', tone: 'nat', icon: 'tree', description: '도심 한가운데 있는 대규모 인공 수목원. 열대식물원과 습지원이 이어집니다.', location: '서구 만년동' },
  { id: 'daecheong', name: '대청호 오백리길', tag: '자연', tone: 'nat', icon: 'lake', description: '호수를 따라 이어지는 순환 둘레길. 노을 질 무렵 걷기 좋습니다.', location: '동구 · 대덕구' },
  { id: 'gyejoksan', name: '계족산 황톳길', tag: '걷기', tone: 'clay', icon: 'trail', description: '맨발로 걷는 붉은 황톳길. 숲 그늘 아래 십여 km가 이어집니다.', location: '대덕구 장동' },
  { id: 'yuseong-spa', name: '유성온천', tag: '휴식', tone: 'clay', icon: 'spa', description: '도심 속 온천 거리와 무료 족욕장. 여행 마지막 코스로 추천합니다.', location: '유성구 봉명동' },
]

export const dishes: Dish[] = [
  { kind: '빵', name: '튀김소보로', description: '대전을 대표하는 빵집의 간판 메뉴. 은행동 본점 앞 줄은 대전의 아침 풍경입니다.' },
  { kind: '면', name: '칼국수', description: '밀가루 배급 시절부터 이어진 칼국수 도시. 사골, 멸치, 얼큰이까지 골라 먹습니다.' },
  { kind: '밥', name: '두부두루치기', description: '매콤한 양념에 두부를 졸여 면사리와 비벼 먹는 대전식 별미입니다.' },
]

export const festivals: Festival[] = [
  { month: 4, name: '대청호 벚꽃길', tone: 'nat' },
  { month: 5, name: '유성온천문화축제', tone: 'clay' },
  { month: 5, name: '계족산 맨발축제', tone: 'clay' },
  { month: 8, name: '대전 0시 축제', tone: 'sci' },
  { month: 10, name: '사이언스 페스티벌', tone: 'sci' },
  { month: 10, name: '칼국수 축제', tone: 'clay' },
  { month: 11, name: '한밭수목원 단풍', tone: 'nat' },
]

export const districts: District[] = [
  { id: 'yuseong', name: '유성구', keyword: '과학 · 온천', description: '대덕연구개발특구와 KAIST가 있는 과학의 중심. 하루 끝엔 온천으로 마무리합니다.', spots: ['엑스포과학공원', '국립중앙과학관', '유성온천 족욕장', 'KAIST 캠퍼스', '갑천 자전거길'] },
  { id: 'jung', name: '중구', keyword: '원도심', description: '옛 충남도청과 은행동 골목이 있는 원도심. 빵집과 칼국수집이 모여 있습니다.', spots: ['대전근현대사전시관', '은행동 으능정이거리', '보문산 전망대', '대전 오월드', '중앙로 지하상가'] },
  { id: 'seo', name: '서구', keyword: '행정 · 공원', description: '정부대전청사와 공원이 모인 신도심. 넓은 녹지 사이로 산책하기 좋습니다.', spots: ['한밭수목원', '대전시립미술관', '이응노미술관', '장태산 자연휴양림', '둔산 먹자골목'] },
  { id: 'dong', name: '동구', keyword: '대전역 · 호수', description: 'KTX 대전역이 있는 관문. 동쪽으로 가면 대청호 물길이 시작됩니다.', spots: ['대전역 소제동', '대청호 오백리길', '식장산 전망대', '대동하늘공원', '중앙시장'] },
  { id: 'daedeok', name: '대덕구', keyword: '산 · 산업', description: '계족산 황톳길과 대청댐이 있는 동네. 숲과 물을 함께 누립니다.', spots: ['계족산 황톳길', '대청댐 물문화관', '장동 산림욕장', '동춘당', '로하스 캠핑장'] },
]
