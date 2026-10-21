import { World, MathProblem, StudentRecord } from '../types';

export const WORLDS_DATA: World[] = [
  {
    id: 'smart-garden',
    title: 'Vườn rau thông minh',
    subtitle: 'Nông nghiệp số & Hình học luống rau An Hiệp',
    iconName: 'Sprout',
    themeColor: 'from-emerald-700 to-green-800',
    accentColor: '#15803d',
    tagline: 'Mỗi mét vuông rau sạch – Một phép tính thông minh!',
    description: 'Khám phá cách tính diện tích luống rau, tỉ lệ phân bón hữu cơ vi sinh và định mức nước tưới chính xác trên đất đỏ bazan Lâm Đồng.',
    localHighlight: 'Thủ phủ rau xà lách, ớt chuông, cà chua bi tại xã An Hiệp (huyện Đức Trọng) & Đơn Dương.',
    problemCount: 4,
  },
  {
    id: 'village-market',
    title: 'Phiên chợ quê em',
    subtitle: 'Toán học kinh doanh & Nông sản cao nguyên',
    iconName: 'ShoppingBag',
    themeColor: 'from-amber-600 to-yellow-700',
    accentColor: '#d97706',
    tagline: 'Cân đong chuẩn xác – Tính toán lãi lỗ tự tin!',
    description: 'Vận dụng tỉ số phần trăm, giá vốn, giá bán, chiết khấu mùa vụ và bài toán cân đối thu chi của bà con nông dân tại chợ đầu mối rau hoa.',
    localHighlight: 'Chợ đầu mối nông sản Liên Nghĩa (Đức Trọng) và Chợ nông sản Đà Lạt.',
    problemCount: 3,
  },
  {
    id: 'greenhouse',
    title: 'Nhà kính quê em',
    subtitle: 'Hình học không gian & Nhà màng công nghệ cao',
    iconName: 'Warehouse',
    themeColor: 'from-teal-700 to-emerald-800',
    accentColor: '#0f766e',
    tagline: 'Khung vòm vững chãi – Che chở mầm xanh Lâm Đồng!',
    description: 'Vận dụng hình học trực quan, chu vi khung thép, diện tích phủ màng polyethylene chống sương muối và thể tích đối lưu nhiệt nhà màng.',
    localHighlight: 'Làng hoa Thái Phiên, Vạn Thành, Đa Quý và vùng trồng dâu tây Lạc Dương.',
    problemCount: 3,
  },
  {
    id: 'water-conservation',
    title: 'Giữ nguồn nước xanh',
    subtitle: 'Lưu lượng dòng chảy & Bảo tồn nguồn nước Đa Nhim',
    iconName: 'Droplets',
    themeColor: 'from-cyan-700 to-blue-800',
    accentColor: '#0284c7',
    tagline: 'Từng giọt nước quý – Nuôi dưỡng sự sống quê mình!',
    description: 'Giải các bài toán thực tiễn về lưu lượng tưới nhỏ giọt, thể tích bể chứa nước mưa và tính toán tỉ lệ tiết kiệm nước ngầm vào mùa khô.',
    localHighlight: 'Lưu vực sông Đa Nhim, hồ Suối Vàng và mạng lưới thủy lợi An Hiệp.',
    problemCount: 4,
  },
];

// Bài toán mẫu khởi đầu theo đúng đặc tả của đề bài
export const INITIAL_PROBLEMS: MathProblem[] = [
  {
    id: 'prob-water-garden-1',
    worldId: 'smart-garden',
    title: 'Tiết kiệm nước tưới vườn rau',
    grade: 'Lớp 6',
    topic: 'Hình học trực quan & Số học thực tế (Diện tích & Tỉ số %)',
    difficulty: 'Vận dụng',
    isSimulated: true, // "Mô phỏng" phục vụ học tập
    dataSource: 'Mô hình thực nghiệm Trường TH và THCS An Hiệp, Lâm Đồng',
    recordDate: '2026-10-21',
    author: 'Lê Thị Hằng',
    status: 'published',
    story: `Gia đình bạn Mai ở xã An Hiệp (huyện Đức Trọng, tỉnh Lâm Đồng) trồng một vườn rau xà lách thương phẩm. Vườn rau có dạng hình chữ nhật với chiều dài 12m và chiều rộng 8m. 
Để ứng phó với mùa khô Tây Nguyên và bảo tồn nguồn nước ngầm quý giá, gia đình Mai đang cân nhắc chuyển đổi giữa hai phương án tưới:
- Phương án A (Tưới phun mưa truyền thống): Tiêu thụ 5 lít nước trên mỗi mét vuông (5 lít/m²/ngày).
- Phương án B (Tưới nhỏ giọt công nghệ cao): Tiêu thụ 3,5 lít nước trên mỗi mét vuông (3,5 lít/m²/ngày).
Em hãy cùng bạn Mai tính toán hiệu quả tiết kiệm nước giữa hai phương án này nhé!`,
    variables: [
      { name: 'Chiều dài vườn rau', symbol: 'a', value: 12, unit: 'm', description: 'Kích thước chiều dài luống trồng' },
      { name: 'Chiều rộng vườn rau', symbol: 'b', value: 8, unit: 'm', description: 'Kích thước chiều rộng luống trồng' },
      { name: 'Định mức tưới Phương án A', symbol: 'q_A', value: 5, unit: 'lít/m²/ngày', description: 'Tưới phun mưa thủ công' },
      { name: 'Định mức tưới Phương án B', symbol: 'q_B', value: 3.5, unit: 'lít/m²/ngày', description: 'Tưới nhỏ giọt thông minh' },
    ],
    subQuestions: [
      {
        id: 'sq-1',
        title: 'Bước 1: Tính diện tích mảnh vườn',
        questionText: 'Tính diện tích mảnh vườn rau hình chữ nhật của gia đình bạn Mai (m²).',
        type: 'numeric',
        correctAnswer: 96,
        unit: 'm²',
        tolerance: 0.05,
        hints: {
          basic: 'Diện tích hình chữ nhật bằng tích của chiều dài và chiều rộng: S = a × b.',
          applied: 'Chiều dài là 12m, chiều rộng là 8m. Ta thực hiện phép tính: 12 × 8.',
          challenge: 'Nếu bạn Mai muốn tăng diện tích thêm 25% để trồng thêm dâu tây, diện tích mới sẽ là bao nhiêu m²?',
        },
        misconceptions: {
          '40': 'Em đang tính chu vi của mảnh vườn rồi! Chu vi = (12 + 8) × 2 = 40m. Đề bài hỏi diện tích (S = dài × rộng) nhé!',
          '20': 'Em mới cộng chiều dài và chiều rộng (12 + 8 = 20m), hãy nhân hai kích thước này để được diện tích nhé!',
        },
        explanation: 'Diện tích vườn rau hình chữ nhật là: S = 12 × 8 = 96 (m²).',
      },
      {
        id: 'sq-2',
        title: 'Bước 2: So sánh lượng nước tưới mỗi ngày',
        questionText: 'Theo Phương án A, mỗi ngày vườn rau cần 480 lít nước. Còn theo Phương án B (tưới nhỏ giọt), lượng nước cần tưới mỗi ngày là bao nhiêu lít?',
        type: 'numeric',
        correctAnswer: 336,
        unit: 'lít/ngày',
        tolerance: 0.1,
        hints: {
          basic: 'Lấy diện tích vườn (đã tính ở Bước 1 là 96 m²) nhân với định mức nước của Phương án B (3,5 lít/m²/ngày).',
          applied: 'Thực hiện phép nhân số thập phân: 96 × 3,5.',
          challenge: 'Em có nhận xét gì về chênh lệch lượng nước tưới giữa hai phương pháp đối với đất đỏ bazan?',
        },
        misconceptions: {
          '480': '480 lít là lượng nước của Phương án A (96 × 5). Câu hỏi đang hỏi Phương án B (định mức 3,5 lít/m²) em nhé!',
          '28': 'Hình như em lấy chu vi 40m × 3,5 hoặc phép tính chưa đúng. Hãy lấy diện tích 96 × 3,5 nhé!',
        },
        explanation: 'Lượng nước tưới theo Phương án B trong một ngày là: 96 × 3,5 = 336 (lít/ngày). (Phương án A là 96 × 5 = 480 lít/ngày).',
      },
      {
        id: 'sq-3',
        title: 'Bước 3: Lượng nước tiết kiệm mỗi ngày & tỉ số %',
        questionText: 'Mỗi ngày, Phương án B giúp gia đình Mai tiết kiệm được bao nhiêu lít nước so với Phương án A?',
        type: 'numeric',
        correctAnswer: 144,
        unit: 'lít/ngày',
        tolerance: 0.1,
        hints: {
          basic: 'Lấy lượng nước Phương án A trừ đi lượng nước Phương án B.',
          applied: 'Thực hiện phép tính trừ: 480 - 336 (hoặc lấy 96 × (5 - 3,5)).',
          challenge: 'Tỉ số phần trăm tiết kiệm được: (144 / 480) × 100% = 30%. Tiết kiệm gần 1/3 lượng nước tưới!',
        },
        misconceptions: {
          '30': '30 là tỉ số phần trăm (30%). Câu hỏi này hỏi số lít nước tiết kiệm cụ thể mỗi ngày (lấy 480 - 336) nhé!',
          '114': 'Em kiểm tra lại phép trừ 480 - 336 xem có nhầm ở hàng chục không nhé!',
        },
        explanation: 'Mỗi ngày Phương án B tiết kiệm được: 480 - 336 = 144 (lít/ngày). Tỉ số phần trăm tiết kiệm là: (144 / 480) × 100% = 30%.',
      },
      {
        id: 'sq-4',
        title: 'Bước 4: Tổng lượng nước bảo tồn sau 7 ngày',
        questionText: 'Sau đúng một tuần lễ (7 ngày), hệ thống tưới nhỏ giọt đã tiết kiệm được tổng cộng bao nhiêu lít nước sạch?',
        type: 'numeric',
        correctAnswer: 1008,
        unit: 'lít',
        tolerance: 0.5,
        hints: {
          basic: 'Lấy số lít nước tiết kiệm được trong một ngày nhân với 7 ngày.',
          applied: 'Thực hiện phép nhân: 144 × 7.',
          challenge: '1.008 lít nước này tương đương hơn 1 mét khối (1,008 m³) nước ngầm được giữ lại cho lòng đất quê hương.',
        },
        misconceptions: {
          '144': '144 lít mới là lượng nước tiết kiệm trong 1 ngày thôi, em nhớ nhân với 7 ngày của cả tuần nhé!',
          '720': 'Em kiểm tra lại phép nhân 144 × 7 nhé!',
        },
        explanation: 'Sau 7 ngày, tổng lượng nước sạch tiết kiệm được là: 144 × 7 = 1.008 (lít). (Tương đương 1,008 m³ nước sạch).',
      },
    ],
    realLifeTask: 'Quan sát vườn rau hoặc chậu cây cảnh ở nhà em. Thử đo kích thước và ước lượng nếu dùng bình tưới nhỏ giọt tận dụng từ chai nhựa tái chế thì mỗi tuần em sẽ tiết kiệm được bao nhiêu lít nước.',
  },
  {
    id: 'prob-market-1',
    worldId: 'village-market',
    title: 'Nông sản phiên chợ Liên Nghĩa',
    grade: 'Lớp 6',
    topic: 'Số học & Tỉ số phần trăm (Lãi - Lỗ, Chiết khấu)',
    difficulty: 'Vận dụng',
    isSimulated: true,
    dataSource: 'Khảo sát giá nông sản tại Chợ Liên Nghĩa - Đức Trọng',
    recordDate: '2026-10-15',
    author: 'Lê Thị Hằng',
    status: 'published',
    story: `Bác Ba ở xã An Hiệp thu hoạch được 200 kg cà chua bi sạch mang ra chợ Liên Nghĩa bán. Chi phí phân bón và công chăm sóc tính bình quân là 12.000 đồng/kg. 
Buổi sáng, bác bán được 140 kg với giá 20.000 đồng/kg.
Buổi chiều, để bán hết sớm trước cơn mưa cao nguyên, bác giảm giá 25% so với giá buổi sáng cho 60 kg còn lại.`,
    variables: [
      { name: 'Tổng khối lượng cà chua', symbol: 'm', value: 200, unit: 'kg' },
      { name: 'Giá vốn', symbol: 'c', value: 12000, unit: 'đồng/kg' },
      { name: 'Giá bán sáng', symbol: 'p_1', value: 20000, unit: 'đồng/kg' },
      { name: 'Mức giảm giá chiều', symbol: 'd', value: 25, unit: '%' },
    ],
    subQuestions: [
      {
        id: 'sq-m1',
        title: 'Bước 1: Tính giá bán buổi chiều',
        questionText: 'Giá bán 1 kg cà chua vào buổi chiều sau khi giảm 25% là bao nhiêu đồng?',
        type: 'numeric',
        correctAnswer: 15000,
        unit: 'đồng',
        tolerance: 10,
        hints: {
          basic: 'Số tiền giảm giá = 20.000 × 25%. Giá mới = Giá cũ - Số tiền giảm.',
          applied: '20.000 × 0.25 = 5.000 đồng. Giá chiều: 20.000 - 5.000 = 15.000 đồng.',
          challenge: 'Cách tính nhanh: Giá mới bằng 75% giá cũ (20.000 × 0.75 = 15.000 đồng).',
        },
        explanation: 'Số tiền giảm: 20.000 × 25% = 5.000 đồng. Giá bán buổi chiều là: 20.000 - 5.000 = 15.000 đồng/kg.',
      },
      {
        id: 'sq-m2',
        title: 'Bước 2: Tổng doanh thu bán hàng',
        questionText: 'Tổng số tiền bác Ba thu được sau khi bán hết 200 kg cà chua là bao nhiêu đồng?',
        type: 'numeric',
        correctAnswer: 3700000,
        unit: 'đồng',
        tolerance: 100,
        hints: {
          basic: 'Tính tiền bán buổi sáng (140 kg) cộng với tiền bán buổi chiều (60 kg).',
          applied: 'Sáng: 140 × 20.000 = 2.800.000 đồng. Chiều: 60 × 15.000 = 900.000 đồng.',
          challenge: 'Tổng doanh thu = 2.800.000 + 900.000 = 3.700.000 đồng.',
        },
        explanation: 'Tiền thu buổi sáng: 140 × 20.000 = 2.800.000 đồng. Tiền thu buổi chiều: 60 × 15.000 = 900.000 đồng. Tổng doanh thu: 3.700.000 đồng.',
      },
    ],
    realLifeTask: 'Cùng mẹ đi chợ và ghi lại giá một mặt hàng rau củ lúc sáng sớm và lúc chiều muộn để nhận xét về quy luật cung cầu.',
  },
  {
    id: 'prob-greenhouse-1',
    worldId: 'greenhouse',
    title: 'Phủ màng nilon nhà kính trồng Dâu Tây',
    grade: 'Lớp 7',
    topic: 'Hình học trực quan - Diện tích xung quanh hình lăng trụ',
    difficulty: 'Vận dụng cao',
    isSimulated: true,
    dataSource: 'Mô hình nhà kính nông nghiệp công nghệ cao Lạc Dương, Lâm Đồng',
    recordDate: '2026-10-18',
    author: 'Lê Thị Hằng',
    status: 'published',
    story: `Hợp tác xã nông nghiệp công nghệ cao xây dựng một nhà kính mái vòm hình bán nguyệt để trồng dâu tây giống Nhật Bản. Nhà kính có chiều dài 20m, chiều rộng mặt đất là 6m (đường kính của vòm bán nguyệt d = 6m, bán kính R = 3m).
Để chống sương muối và giữ ẩm, người ta cần phủ màng mỏng nilon lên toàn bộ mái vòm cong (không tính 2 đầu hồi).
Lấy số π ≈ 3,14.`,
    variables: [
      { name: 'Chiều dài nhà kính', symbol: 'L', value: 20, unit: 'm' },
      { name: 'Bán kính vòm bán nguyệt', symbol: 'R', value: 3, unit: 'm' },
      { name: 'Số Pi', symbol: 'π', value: 3.14, unit: '' },
    ],
    subQuestions: [
      {
        id: 'sq-g1',
        title: 'Bước 1: Độ dài đường cong mái vòm',
        questionText: 'Tính chiều dài cung tròn của mái vòm bán nguyệt (tính từ mép đất bên này sang mép đất bên kia) theo mét.',
        type: 'numeric',
        correctAnswer: 9.42,
        unit: 'm',
        tolerance: 0.1,
        hints: {
          basic: 'Chu vi cả đường tròn là C = 2 × π × R. Cung bán nguyệt bằng một nửa chu vi: Cung = π × R.',
          applied: 'Lấy 3,14 × 3 = 9,42m.',
          challenge: 'Mái vòm dạng cong giúp phân tán lực gió và thoát nước mưa tốt hơn mái phẳng thế nào?',
        },
        explanation: 'Chiều dài cung mái vòm bán nguyệt là: l = 3,14 × 3 = 9,42 (m).',
      },
      {
        id: 'sq-g2',
        title: 'Bước 2: Diện tích màng nilon phủ mái',
        questionText: 'Tính diện tích màng nilon cần dùng để phủ kín toàn bộ phần mái vòm cong dài 20m (m²).',
        type: 'numeric',
        correctAnswer: 188.4,
        unit: 'm²',
        tolerance: 0.5,
        hints: {
          basic: 'Trải phẳng mặt cong ta được một hình chữ nhật có kích thước bằng chiều dài cung (9,42m) nhân với chiều dài nhà kính (20m).',
          applied: 'Thực hiện phép tính: 9,42 × 20.',
          challenge: 'Nếu mua dự phòng thêm 10% diện tích để làm mép chôn đất, cần mua bao nhiêu m² màng nilon?',
        },
        explanation: 'Diện tích màng phủ mái vòm là: 9,42 × 20 = 188,4 (m²).',
      },
    ],
    realLifeTask: 'Quan sát các nhà kính trồng rau hoa tại quê em, tìm hiểu xem khung vòm làm bằng sắt tròn hay thép hộp và người ta giữ mép nilon bằng cách nào.',
  },
];

// Khởi tạo 47 mã học sinh ẩn danh (HS01 đến HS47)
// Đảm bảo tuân thủ tuyệt đối an toàn dữ liệu trẻ em: không thu thập họ tên đầy đủ, CCCD, địa chỉ
export function generate47Students(): StudentRecord[] {
  const students: StudentRecord[] = [];

  const errorPool = [
    'Nhầm chu vi thành diện tích',
    'Tính sai tỉ số % tiết kiệm',
    'Quên nhân 7 ngày trong tuần',
    'Nhầm dấu phẩy thập phân khi nhân 3,5',
    'Chưa đổi đúng đơn vị lít sang m³',
    'Tính nhầm giá bán sau chiết khấu',
  ];

  for (let i = 1; i <= 47; i++) {
    const id = `HS${i.toString().padStart(2, '0')}`;
    let group: StudentRecord['group'];
    let preTest: number;
    let postTest: number;
    let completed: number;
    let attempts: number;

    if (i <= 15) {
      // Nhóm 1: Cần củng cố (15 em)
      group = 'Cần củng cố';
      preTest = +(4.0 + Math.random() * 1.5).toFixed(1); // 4.0 - 5.5
      postTest = +(6.5 + Math.random() * 1.2).toFixed(1); // 6.5 - 7.7 (tiến bộ vượt bậc)
      completed = Math.floor(2 + Math.random() * 2);
      attempts = Math.floor(4 + Math.random() * 3);
    } else if (i <= 37) {
      // Nhóm 2: Vận dụng (22 em)
      group = 'Vận dụng';
      preTest = +(5.8 + Math.random() * 1.4).toFixed(1); // 5.8 - 7.2
      postTest = +(7.8 + Math.random() * 1.2).toFixed(1); // 7.8 - 9.0
      completed = Math.floor(3 + Math.random() * 2);
      attempts = Math.floor(2 + Math.random() * 2);
    } else {
      // Nhóm 3: Phát triển năng khiếu (10 em)
      group = 'Phát triển năng khiếu';
      preTest = +(7.5 + Math.random() * 1.2).toFixed(1); // 7.5 - 8.7
      postTest = +(9.0 + Math.random() * 1.0).toFixed(1); // 9.0 - 10.0
      completed = Math.floor(4 + Math.random() * 2);
      attempts = Math.floor(1 + Math.random() * 2);
    }

    const error1 = errorPool[(i * 3) % errorPool.length];
    const error2 = errorPool[(i * 7) % errorPool.length];
    const commonErrors = Array.from(new Set([error1, error2]));

    students.push({
      id,
      group,
      preTestScore: Math.min(10, preTest),
      postTestScore: Math.min(10, postTest),
      completedProblems: completed,
      totalAttempts: attempts,
      commonErrors,
      lastActive: i % 2 === 0 ? 'Vừa xong' : '1 giờ trước',
      assignedTasks: [
        'Bài mẫu: Tiết kiệm nước tưới vườn rau',
        group === 'Phát triển năng khiếu'
          ? 'Bài thử thách: Phủ màng nilon nhà kính'
          : 'Bài luyện tập: Nông sản phiên chợ Liên Nghĩa',
      ],
    });
  }

  return students;
}
