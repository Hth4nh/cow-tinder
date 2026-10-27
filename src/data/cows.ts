export type CowBreed =
  | 'Wagyu Nhật Bản'
  | 'Holstein Mộc Châu'
  | 'Highland Đà Lạt'
  | 'Jersey Ba Vì'
  | 'Bò Tơ Củ Chi'
  | 'Red Angus Mang Yang'
  | 'Brahman An Giang'
  | 'Sindhi Ninh Thuận';

export type MatchPurpose =
  | 'Phối giống VIP'
  | 'Bạn đồng cỏ'
  | 'Hẹn hò lãng mạn'
  | 'Thi Hoa Hậu Bò';

export interface CowStats {
  weightKg: number;
  milkLitersPerDay?: number;
  marblingScore: number; // 1 - 12
  calmness: number; // 0 - 100
  pastureStamina: number; // 0 - 100
  mooPitchHz: number;
}

export interface CowPrompt {
  question: string;
  answer: string;
}

export interface CowProfile {
  id: string;
  name: string;
  earTag: string;
  ageMonths: number;
  ageLabel: string;
  gender: 'Bò Cái' | 'Bò Đực';
  breed: CowBreed;
  region: string;
  distanceKm: number;
  verified: boolean;
  awardBadge: string;
  purpose: MatchPurpose;
  favoriteGrass: string;
  bio: string;
  zodiac: string;
  likesBack: boolean; // whether swiping right triggers an instant Match
  stats: CowStats;
  badges: string[];
  prompts: CowPrompt[];
  images: string[];
  accentColor: string;
  coatColors: {
    primary: string;
    secondary: string;
    spots: string;
    horn: string;
    muzzle: string;
    bgFrom: string;
    bgTo: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'cow';
  text: string;
  timestamp: string;
  giftTag?: string;
}

export interface MatchConversation {
  cowId: string;
  matchedAt: string;
  isSuperMoo?: boolean;
  unreadCount: number;
  messages: ChatMessage[];
}

function createCowSceneSvg(options: {
  name: string;
  subtitle: string;
  scene: 'meadow' | 'sunset' | 'barn';
  primary: string;
  secondary: string;
  spots: string;
  horn: string;
  muzzle: string;
  bgFrom: string;
  bgTo: string;
  fluffy?: boolean;
  flowerCrown?: boolean;
  goldenBell?: boolean;
}): string {
  const {
    name,
    subtitle,
    scene,
    primary,
    secondary,
    spots,
    horn,
    muzzle,
    bgFrom,
    bgTo,
    fluffy = false,
    flowerCrown = false,
    goldenBell = true,
  } = options;

  const skyGradient =
    scene === 'meadow'
      ? `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${bgFrom}"/><stop offset="100%" stop-color="${bgTo}"/></linearGradient>`
      : scene === 'sunset'
        ? `<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f97316"/><stop offset="50%" stop-color="#ec4899"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>`
        : `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#334155"/></linearGradient>`;

  const sunOrMoon =
    scene === 'meadow'
      ? `<circle cx="480" cy="110" r="46" fill="#fde047" opacity="0.85"/><circle cx="480" cy="110" r="64" fill="#fde047" opacity="0.22"/>`
      : scene === 'sunset'
        ? `<circle cx="120" cy="130" r="58" fill="#fef08a" opacity="0.75"/><circle cx="120" cy="130" r="85" fill="#fb923c" opacity="0.28"/>`
        : `<circle cx="470" cy="100" r="32" fill="#f8fafc" opacity="0.9"/><circle cx="110" cy="80" r="3" fill="#fde047"/><circle cx="220" cy="60" r="2.5" fill="#fde047"/><circle cx="360" cy="75" r="3" fill="#fde047"/>`;

  const hillsColor1 = scene === 'barn' ? '#14532d' : '#22c55e';
  const hillsColor2 = scene === 'barn' ? '#166534' : '#16a34a';
  const poseTilt = scene === 'meadow' ? 0 : scene === 'sunset' ? -4 : 4;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <defs>
      ${skyGradient}
      <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${hillsColor1}"/>
        <stop offset="100%" stop-color="${hillsColor2}"/>
      </linearGradient>
      <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.28"/>
      </filter>
    </defs>

    <!-- Sky -->
    <rect width="600" height="750" fill="url(#sky)"/>
    ${sunOrMoon}

    <!-- Clouds -->
    <g fill="#ffffff" opacity="${scene === 'barn' ? '0.12' : '0.55'}">
      <rect x="65" y="95" width="110" height="32" rx="16"/>
      <circle cx="95" cy="92" r="22"/>
      <circle cx="130" cy="88" r="26"/>
      <rect x="370" y="155" width="120" height="28" rx="14"/>
      <circle cx="405" cy="152" r="20"/>
      <circle cx="445" cy="148" r="24"/>
    </g>

    <!-- Rolling Pasture Hills -->
    <path d="M-40 520 Q160 430 350 490 T640 460 L640 750 L-40 750 Z" fill="url(#hill1)" opacity="0.85"/>
    <path d="M-40 565 Q220 490 430 545 T640 530 L640 750 L-40 750 Z" fill="${hillsColor2}"/>

    <!-- Pasture Flowers & Grass Blades -->
    <g stroke="#4ade80" stroke-width="3" stroke-linecap="round" opacity="0.65">
      <path d="M80 610 l-8 -18 M86 612 l2 -22 M92 610 l9 -16"/>
      <path d="M510 595 l-8 -18 M516 597 l2 -22 M522 595 l9 -16"/>
      <path d="M150 675 l-6 -14 M156 675 l4 -18"/>
      <path d="M460 665 l-6 -14 M466 665 l4 -18"/>
    </g>
    <circle cx="88" cy="585" r="5" fill="#f43f5e"/>
    <circle cx="518" cy="570" r="5" fill="#facc15"/>
    <circle cx="464" cy="644" r="4.5" fill="#f472b6"/>

    <!-- Main Cow Portrait Character -->
    <g transform="translate(300, 390) rotate(${poseTilt})" filter="url(#softShadow)">
      <!-- Body / Shoulders -->
      <path d="M-135 230 C-135 90 -90 55 0 55 C90 55 135 90 135 230 Z" fill="${primary}"/>
      <!-- Decorative Spots on Body -->
      <ellipse cx="-65" cy="145" rx="42" ry="30" fill="${spots}" transform="rotate(-15 -65 145)"/>
      <ellipse cx="62" cy="165" rx="36" ry="26" fill="${spots}" transform="rotate(20 62 165)"/>
      <circle cx="10" cy="115" r="22" fill="${spots}"/>

      <!-- Golden Pasture Collar & Cowbell -->
      ${
        goldenBell
          ? `<path d="M-88 82 Q0 124 88 82" fill="none" stroke="#dc2626" stroke-width="14" stroke-linecap="round"/>
             <circle cx="0" cy="118" r="22" fill="#facc15" stroke="#ca8a04" stroke-width="4"/>
             <circle cx="0" cy="127" r="6" fill="#854d0e"/>`
          : ''
      }

      <!-- Ears -->
      <g transform="translate(-115, -75) rotate(-22)">
        <ellipse cx="0" cy="0" rx="46" ry="24" fill="${primary}"/>
        <ellipse cx="4" cy="2" rx="30" ry="13" fill="#fda4af" opacity="0.75"/>
        <!-- Ear Tag -->
        <rect x="-18" y="12" width="28" height="34" rx="6" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>
        <circle cx="-4" cy="18" r="3" fill="#713f12"/>
      </g>
      <g transform="translate(115, -75) rotate(22)">
        <ellipse cx="0" cy="0" rx="46" ry="24" fill="${primary}"/>
        <ellipse cx="-4" cy="2" rx="30" ry="13" fill="#fda4af" opacity="0.75"/>
      </g>

      <!-- Horns -->
      <path d="M-75 -115 Q-125 -175 -85 -205 Q-55 -175 -45 -125 Z" fill="${horn}" stroke="#d6d3d1" stroke-width="2"/>
      <path d="M75 -115 Q125 -175 85 -205 Q55 -175 45 -125 Z" fill="${horn}" stroke="#d6d3d1" stroke-width="2"/>

      <!-- Head Base -->
      <rect x="-102" y="-135" width="204" height="205" rx="88" fill="${primary}"/>

      <!-- Head Patch / Spot -->
      <path d="M-95 -65 C-35 -125 25 -135 82 -85 C95 -35 55 15 -15 -10 C-65 -25 -95 -35 -95 -65 Z" fill="${secondary}" opacity="0.9"/>

      <!-- Fluffy Bangs (for Highland / Fluffy breeds) -->
      ${
        fluffy
          ? `<path d="M-85 -110 Q-55 -155 -20 -115 Q0 -160 25 -115 Q60 -155 85 -110 Q55 -60 0 -75 Q-55 -60 -85 -110 Z" fill="${spots}"/>`
          : `<path d="M-30 -132 Q0 -162 28 -132 Q12 -112 -30 -132 Z" fill="${spots}"/>`
      }

      <!-- Flower Crown -->
      ${
        flowerCrown
          ? `<g transform="translate(0, -132)">
               <circle cx="-42" cy="6" r="14" fill="#f43f5e"/>
               <circle cx="-42" cy="6" r="5" fill="#fde047"/>
               <circle cx="0" cy="-2" r="16" fill="#fb7185"/>
               <circle cx="0" cy="-2" r="6" fill="#fde047"/>
               <circle cx="42" cy="6" r="14" fill="#f43f5e"/>
               <circle cx="42" cy="6" r="5" fill="#fde047"/>
             </g>`
          : ''
      }

      <!-- Expressive Eyes -->
      <g transform="translate(-46, -42)">
        <circle cx="0" cy="0" r="16" fill="#1c1917"/>
        <circle cx="-5" cy="-5" r="6" fill="#ffffff"/>
        <circle cx="5" cy="4" r="2.5" fill="#ffffff"/>
      </g>
      <g transform="translate(46, -42)">
        <circle cx="0" cy="0" r="16" fill="#1c1917"/>
        <circle cx="-5" cy="-5" r="6" fill="#ffffff"/>
        <circle cx="5" cy="4" r="2.5" fill="#ffffff"/>
      </g>

      <!-- Rosy Cheeks -->
      <ellipse cx="-72" cy="-12" rx="16" ry="10" fill="#fb7185" opacity="0.45"/>
      <ellipse cx="72" cy="-12" rx="16" ry="10" fill="#fb7185" opacity="0.45"/>

      <!-- Big Cute Muzzle / Snout -->
      <rect x="-86" y="-8" width="172" height="96" rx="48" fill="${muzzle}"/>
      <!-- Nostrils -->
      <ellipse cx="-34" cy="30" rx="13" ry="18" fill="#881337" opacity="0.7" transform="rotate(-12 -34 30)"/>
      <ellipse cx="34" cy="30" rx="13" ry="18" fill="#881337" opacity="0.7" transform="rotate(12 34 30)"/>
      <!-- Happy Smile & Grass Blade in Mouth -->
      <path d="M-26 58 Q0 76 26 58" fill="none" stroke="#881337" stroke-width="5" stroke-linecap="round"/>
      <path d="M18 63 Q68 55 105 25" fill="none" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="105" cy="25" rx="12" ry="6" fill="#22c55e" transform="rotate(-25 105 25)"/>
    </g>

    <!-- Scene Caption Pill at Top Right -->
    <g transform="translate(36, 36)">
      <rect x="0" y="0" width="220" height="36" rx="18" fill="#000000" opacity="0.38"/>
      <text x="18" y="23" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700">${name} • ${subtitle}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildCowGallery(
  name: string,
  coat: CowProfile['coatColors'],
  opts?: { fluffy?: boolean; flowerCrown?: boolean },
): string[] {
  return [
    createCowSceneSvg({
      name,
      subtitle: 'Đồng cỏ sớm mai',
      scene: 'meadow',
      ...coat,
      ...opts,
    }),
    createCowSceneSvg({
      name,
      subtitle: 'Hoàng hôn lãng mạn',
      scene: 'sunset',
      ...coat,
      ...opts,
    }),
    createCowSceneSvg({
      name,
      subtitle: 'Đêm sao trang trại',
      scene: 'barn',
      ...coat,
      ...opts,
    }),
  ];
}

const RAW_COWS: CowProfile[] = [
  {
    id: 'cow-sakura-wagyu',
    name: 'Sakura Kobe',
    earTag: 'VN-WGY-889',
    ageMonths: 26,
    ageLabel: '2.2 tuổi',
    gender: 'Bò Cái',
    breed: 'Wagyu Nhật Bản',
    region: 'Đà Lạt, Lâm Đồng',
    distanceKm: 3,
    verified: true,
    awardBadge: 'Hoa Hậu Vân Mỡ A5 2026',
    purpose: 'Hẹn hò lãng mạn',
    favoriteGrass: 'Cỏ lúa mạch non & Bắp ủ bia tươi',
    bio: 'Sinh ra ở Kobe, lớn lên giữa đồi thông Đà Lạt. Thích nghe nhạc giao hưởng Mozart mỗi chiều và được massage bằng chổi mềm. Tìm anh bò điềm đạm cùng ngắm sương mù.',
    zodiac: 'Kim Ngưu Tinh Tế',
    likesBack: true,
    stats: {
      weightKg: 620,
      milkLitersPerDay: 24,
      marblingScore: 12,
      calmness: 98,
      pastureStamina: 89,
      mooPitchHz: 142,
    },
    badges: ['Vân mỡ BMS 12', 'Nghe nhạc cổ điển', 'Sổ phả hệ 5 đời', 'Đã tiêm chủng đủ'],
    prompts: [
      {
        question: 'Buổi hẹn hò đầu tiên lý tưởng trên đồng cỏ?',
        answer: 'Cùng nhau nhai cỏ linh lăng ủ sương bên hồ Tuyền Lâm rồi nghe tiếng chuông gió.',
      },
      {
        question: 'Điểm yếu không thể cưỡng lại của em?',
        answer: 'Một anh bò có giọng Mooo trầm ấm dưới 130Hz và chiếc sừng bóng mượt.',
      },
    ],
    accentColor: 'rose',
    coatColors: {
      primary: '#292524',
      secondary: '#44403c',
      spots: '#1c1917',
      horn: '#fef3c7',
      muzzle: '#fda4af',
      bgFrom: '#fbcfe8',
      bgTo: '#fde68a',
    },
    images: [],
  },
  {
    id: 'cow-bella-mocchau',
    name: 'Bella Mộc Châu',
    earTag: 'VN-HLS-102',
    ageMonths: 30,
    ageLabel: '2.5 tuổi',
    gender: 'Bò Cái',
    breed: 'Holstein Mộc Châu',
    region: 'Thảo nguyên Mộc Châu, Sơn La',
    distanceKm: 8,
    verified: true,
    awardBadge: 'Nữ Hoàng Sữa Tươi 42L/Ngày',
    purpose: 'Bạn đồng cỏ',
    favoriteGrass: 'Cỏ voi xanh mướt & Hoa cải trắng',
    bio: 'Cô gái Hà Lan chính hiệu giữa cao nguyên Mộc Châu! Sáng dậy sớm cho sữa chuẩn organic, chiều thích chạy bộ quanh đồi chè trái tim. Năng lượng tích cực 200%!',
    zodiac: 'Nhân Mã Tự Do',
    likesBack: true,
    stats: {
      weightKg: 580,
      milkLitersPerDay: 42,
      marblingScore: 8,
      calmness: 92,
      pastureStamina: 96,
      mooPitchHz: 155,
    },
    badges: ['42 Lít sữa/ngày', 'Gen thuần chủng Hà Lan', 'Yêu vận động', 'Đạt chuẩn GlobalG.A.P'],
    prompts: [
      {
        question: 'Cách nhanh nhất để làm quen với mình?',
        answer: 'Tặng mình một bó cỏ Mombasa tươi rói vừa cắt lúc 5 giờ sáng!',
      },
      {
        question: 'Sở thích kỳ lạ lúc nửa đêm?',
        answer: 'Đếm các đốm đen trên lưng xem hôm nay có xếp thành hình chòm sao không.',
      },
    ],
    accentColor: 'amber',
    coatColors: {
      primary: '#fafaf9',
      secondary: '#1c1917',
      spots: '#292524',
      horn: '#fde68a',
      muzzle: '#fecdd3',
      bgFrom: '#bae6fd',
      bgTo: '#bbf7d0',
    },
    images: [],
  },
  {
    id: 'cow-hamish-highland',
    name: 'Hamish Tóc Xù',
    earTag: 'VN-HLD-404',
    ageMonths: 34,
    ageLabel: '2.8 tuổi',
    gender: 'Bò Đực',
    breed: 'Highland Đà Lạt',
    region: 'Đồi Đa Phú, Đà Lạt',
    distanceKm: 5,
    verified: true,
    awardBadge: 'Nam Vương Tóc Mái Lãng Tử',
    purpose: 'Thi Hoa Hậu Bò',
    favoriteGrass: 'Cỏ dại ôn đới & Táo đỏ giòn',
    bio: 'Chàng trai Scotland với mái tóc cam bồng bềnh che nửa ánh nhìn nhưng không che được trái tim ấm áp. Không sợ lạnh, chỉ sợ ăn cỏ một mình.',
    zodiac: 'Sư Tử Bồng Bềnh',
    likesBack: true,
    stats: {
      weightKg: 740,
      marblingScore: 10,
      calmness: 95,
      pastureStamina: 94,
      mooPitchHz: 118,
    },
    badges: ['Lông xù 2 lớp', 'Giọng Moo trầm ấm', 'Sừng cong quý tộc', 'Thích chụp ảnh film'],
    prompts: [
      {
        question: 'Bí quyết chăm sóc bộ lông mượt của anh?',
        answer: 'Gió sương Đà Lạt tự nhiên 100% cộng thêm 15 phút chải chuốt trước giờ ra đồng.',
      },
      {
        question: 'Mẫu bò lý tưởng trong mắt Hamish?',
        answer: 'Vui vẻ, thích đi dạo dưới mưa phùn và không chê tóc mái anh che mất mắt.',
      },
    ],
    accentColor: 'orange',
    coatColors: {
      primary: '#d97706',
      secondary: '#b45309',
      spots: '#92400e',
      horn: '#fef3c7',
      muzzle: '#fed7aa',
      bgFrom: '#fde68a',
      bgTo: '#fed7aa',
    },
    images: [],
  },
  {
    id: 'cow-mat-ong-bavi',
    name: 'Mật Ong Ba Vì',
    earTag: 'VN-JRS-209',
    ageMonths: 24,
    ageLabel: '2.0 tuổi',
    gender: 'Bò Cái',
    breed: 'Jersey Ba Vì',
    region: 'Vườn Quốc Gia Ba Vì, Hà Nội',
    distanceKm: 12,
    verified: true,
    awardBadge: 'Đôi Mắt Nai Vàng Ngơ Ngác',
    purpose: 'Phối giống VIP',
    favoriteGrass: 'Cỏ Pangola & Mía đường mật',
    bio: 'Nhỏ nhắn, lông vàng óng ánh như mật ong rừng và đôi mắt to tròn có hàng mi cong vút. Sữa của em có hàm lượng bơ kem cao nhất trang trại Ba Vì!',
    zodiac: 'Thiên Bình Ngọt Ngào',
    likesBack: false,
    stats: {
      weightKg: 450,
      milkLitersPerDay: 32,
      marblingScore: 9,
      calmness: 99,
      pastureStamina: 88,
      mooPitchHz: 168,
    },
    badges: ['Độ béo sữa 5.5%', 'Mắt to lông mi dài', 'Tính tình hiền dịu', 'Huyết thống Đảo Jersey'],
    prompts: [
      {
        question: 'Điều làm em tự hào nhất ở trang trại?',
        answer: 'Mỗi mẻ phô mai làm từ sữa của em đều thơm nức mùi bơ hạt dẻ.',
      },
      {
        question: 'Kế hoạch cuối tuần hoàn hảo?',
        answer: 'Nằm tắm nắng dưới gốc thông cổ thụ và nghe tiếng chim hót.',
      },
    ],
    accentColor: 'yellow',
    coatColors: {
      primary: '#eab308',
      secondary: '#ca8a04',
      spots: '#a16207',
      horn: '#fef9c3',
      muzzle: '#fde047',
      bgFrom: '#fef08a',
      bgTo: '#bbf7d0',
    },
    images: [],
  },
  {
    id: 'cow-titan-brahman',
    name: 'Titan Cơ Bắp',
    earTag: 'VN-BRM-777',
    ageMonths: 38,
    ageLabel: '3.1 tuổi',
    gender: 'Bò Đực',
    breed: 'Brahman An Giang',
    region: 'Thất Sơn, An Giang',
    distanceKm: 19,
    verified: true,
    awardBadge: 'Quán Quân Thể Hình Đồng Cỏ',
    purpose: 'Phối giống VIP',
    favoriteGrass: 'Cỏ Guinea giàu đạm & Khoáng chất',
    bio: 'Vai u thịt bắp, bướu lưng kiêu hãnh và đôi tai dài phong độ. Chịu nắng giỏi số 1 miền Tây, luôn sẵn sàng che bóng mát cho nàng bò nào đi cạnh.',
    zodiac: 'Bạch Dương Mạnh Mẽ',
    likesBack: true,
    stats: {
      weightKg: 920,
      marblingScore: 9,
      calmness: 90,
      pastureStamina: 100,
      mooPitchHz: 105,
    },
    badges: ['920kg Cơ bắp chuẩn', 'Đề kháng siêu hạng', 'Gen F1 Mỹ - Úc', 'Ga-lăng số 1 đàn'],
    prompts: [
      {
        question: 'Thói quen tập luyện mỗi ngày?',
        answer: 'Đi bộ 10 vòng quanh cánh đồng lúa Tịnh Biên và kéo xe cỏ giúp bác nông dân.',
      },
      {
        question: 'Đừng nhìn vẻ ngoài đô con mà lầm vì...',
        answer: 'Mình cực kỳ thích được gãi nhẹ dưới cằm và nghe nhạc Bolero.',
      },
    ],
    accentColor: 'emerald',
    coatColors: {
      primary: '#d6d3d1',
      secondary: '#a8a29e',
      spots: '#78716c',
      horn: '#f5f5f4',
      muzzle: '#fda4af',
      bgFrom: '#99f6e4',
      bgTo: '#fde68a',
    },
    images: [],
  },
  {
    id: 'cow-ruby-angus',
    name: 'Ruby Hồng Ngọc',
    earTag: 'VN-ANG-512',
    ageMonths: 28,
    ageLabel: '2.3 tuổi',
    gender: 'Bò Cái',
    breed: 'Red Angus Mang Yang',
    region: 'Cao nguyên Mang Yang, Gia Lai',
    distanceKm: 14,
    verified: true,
    awardBadge: 'Ngôi Sao Thảo Nguyên Đỏ',
    purpose: 'Hẹn hò lãng mạn',
    favoriteGrass: 'Cỏ Stylo & Ngô non',
    bio: 'Bộ lông đỏ rực như đất bazan Tây Nguyên lúc chiều tà. Không có sừng (polled tự nhiên) nên cực kỳ thân thiện khi cụng đầu làm quen!',
    zodiac: 'Song Tử Năng Động',
    likesBack: true,
    stats: {
      weightKg: 610,
      milkLitersPerDay: 26,
      marblingScore: 11,
      calmness: 94,
      pastureStamina: 95,
      mooPitchHz: 148,
    },
    badges: ['Không sừng tự nhiên', 'Lông đỏ ánh đồng', 'Vân mỡ chuẩn USDA Prime', 'Thích chạy thảo nguyên'],
    prompts: [
      {
        question: 'Tại sao hẹn hò với bò Red Angus là tuyệt nhất?',
        answer: 'Không bao giờ lo bị húc nhầm vì tụi mình bẩm sinh không có sừng!',
      },
      {
        question: 'Món tráng miệng yêu thích sau bữa cỏ chính?',
        answer: 'Một tảng đá liếm muối khoáng hồng Himalaya mát lạnh.',
      },
    ],
    accentColor: 'red',
    coatColors: {
      primary: '#9a3412',
      secondary: '#7c2d12',
      spots: '#431407',
      horn: '#9a3412',
      muzzle: '#fdba74',
      bgFrom: '#fecdd3',
      bgTo: '#fed7aa',
    },
    images: [],
  },
  {
    id: 'cow-lua-cuchi',
    name: 'Lụa Củ Chi',
    earTag: 'VN-BCC-305',
    ageMonths: 21,
    ageLabel: '1.8 tuổi',
    gender: 'Bò Cái',
    breed: 'Bò Tơ Củ Chi',
    region: 'Nông trường Củ Chi, TP.HCM',
    distanceKm: 6,
    verified: true,
    awardBadge: 'Gương Mặt Thân Thiện Miền Đông',
    purpose: 'Bạn đồng cỏ',
    favoriteGrass: 'Cỏ mật & Đọt mía non Củ Chi',
    bio: 'Trẻ trung, duyên dáng và rành hết mọi ngóc ngách đồng cỏ xanh mát ven sông Sài Gòn. Thích tám chuyện bằng tiếng Mooo nhịp điệu vui tươi cùng hội chị em.',
    zodiac: 'Xử Nữ Chu Đáo',
    likesBack: true,
    stats: {
      weightKg: 420,
      milkLitersPerDay: 22,
      marblingScore: 8,
      calmness: 96,
      pastureStamina: 92,
      mooPitchHz: 162,
    },
    badges: ['Da bóng mượt', 'Cực kỳ hòa đồng', 'Sành ăn cỏ ngọt', 'Gen bản địa tuyển chọn'],
    prompts: [
      {
        question: 'Địa điểm tụ tập cuối tuần yêu thích?',
        answer: 'Bãi cỏ non ven sông Sài Gòn lúc chiều mát, vừa ăn cỏ vừa ngắm thuyền qua lại.',
      },
      {
        question: 'Câu cửa miệng của Lụa?',
        answer: '"Cỏ tươi không đợi bò chậm chân — Moooo!"',
      },
    ],
    accentColor: 'amber',
    coatColors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      spots: '#b45309',
      horn: '#fef3c7',
      muzzle: '#fde68a',
      bgFrom: '#fef3c7',
      bgTo: '#a7f3d0',
    },
    images: [],
  },
  {
    id: 'cow-surya-sindhi',
    name: 'Surya Nắng Vàng',
    earTag: 'VN-SND-618',
    ageMonths: 32,
    ageLabel: '2.6 tuổi',
    gender: 'Bò Đực',
    breed: 'Sindhi Ninh Thuận',
    region: 'Đồng cỏ An Hòa, Ninh Thuận',
    distanceKm: 15,
    verified: true,
    awardBadge: 'Chiến Binh Thảo Nguyên Nắng Gió',
    purpose: 'Phối giống VIP',
    favoriteGrass: 'Cỏ Mulato II & Xương rồng không gai',
    bio: 'Màu lông đỏ sẫm quý phái, sức bền vô địch giữa thảo nguyên đầy nắng và gió biển. Trầm tính, chung thủy và luôn nhường phần cỏ non nhất cho nửa kia.',
    zodiac: 'Ma Kết Điềm Đạm',
    likesBack: false,
    stats: {
      weightKg: 540,
      marblingScore: 8,
      calmness: 97,
      pastureStamina: 99,
      mooPitchHz: 124,
    },
    badges: ['Chịu nhiệt đỉnh cao', 'Huyết thống Red Sindhi', 'Sức bền 99/100', 'Điềm tĩnh & Ấm áp'],
    prompts: [
      {
        question: 'Khoảnh khắc lãng mạn nhất ở Ninh Thuận?',
        answer: 'Đi bộ về chuồng dưới ánh hoàng hôn tím bên những trụ điện gió khổng lồ.',
      },
      {
        question: 'Cam kết khi ghép đôi?',
        answer: 'Luôn đứng chắn gió thảo nguyên cho em yên tâm nhai lại.',
      },
    ],
    accentColor: 'rose',
    coatColors: {
      primary: '#b91c1c',
      secondary: '#991b1b',
      spots: '#7f1d1d',
      horn: '#fde68a',
      muzzle: '#fca5a5',
      bgFrom: '#fed7aa',
      bgTo: '#fde047',
    },
    images: [],
  },
];

export const INITIAL_COWS: CowProfile[] = RAW_COWS.map((cow) => ({
  ...cow,
  images: buildCowGallery(cow.name, cow.coatColors, {
    fluffy: cow.breed === 'Highland Đà Lạt',
    flowerCrown: cow.gender === 'Bò Cái',
  }),
}));

export const INITIAL_CONVERSATIONS: MatchConversation[] = [
  {
    cowId: 'cow-sakura-wagyu',
    matchedAt: '10 phút trước',
    isSuperMoo: true,
    unreadCount: 2,
    messages: [
      {
        id: 'msg-1',
        sender: 'cow',
        text: 'Moooo~ Chào anh! Em thấy anh vừa thả Siêu Sao cho em trên đồi thông Đà Lạt phải không? 🌸🐄',
        timestamp: '14:50',
      },
      {
        id: 'msg-2',
        sender: 'cow',
        text: 'Chiều nay trang trại em mới mở kiện cỏ linh lăng ủ mật thơm lắm, anh qua ăn chung không?',
        timestamp: '14:52',
      },
    ],
  },
  {
    cowId: 'cow-bella-mocchau',
    matchedAt: '2 giờ trước',
    isSuperMoo: false,
    unreadCount: 1,
    messages: [
      {
        id: 'msg-3',
        sender: 'me',
        text: 'Chào Bella! Đốm lưng hình trái tim của bạn ấn tượng quá!',
        timestamp: '12:30',
      },
      {
        id: 'msg-4',
        sender: 'cow',
        text: 'Cảm ơn đằng ấy nha! Sáng nay mình vừa đạt kỷ lục 42 lít sữa tươi xong, đang đi dạo quanh đồi chè nè! 🌿🥛',
        timestamp: '12:34',
      },
    ],
  },
];

export const COW_AUTO_REPLIES: string[] = [
  'Moooo~ Nghe hợp lý quá! Để mình rủ bác chủ trại mở cổng đồng cỏ phía Đông nha! 🌾🐄',
  'Haha đằng ấy vui tính ghê! Tặng bạn một bó cỏ linh lăng tươi rói mới cắt sáng nay nè! 🍀✨',
  'Mooo! Giọng kêu của bạn đúng tần số 128Hz mà mình tìm kiếm bấy lâu nay luôn á! 🔔💛',
  'Chiều nay 4h30 nhớ qua bãi cỏ cạnh hồ nước nha, mình giữ chỗ bóng mát đẹp nhất cho bạn rồi!',
  'Ước gì cuối tuần này tụi mình được xếp chung đội đi thi Hoa Hậu & Nam Vương Đồng Cỏ 2026! 🏆🐄',
];

export const ICEBREAKER_SUGGESTIONS: string[] = [
  'Moooo! Đồng cỏ nhà bạn hôm nay cỏ có ngọt không? 🌿',
  'Gửi tặng bạn 1 bó Cỏ Linh Lăng Thượng Hạng làm quen nhé! 🍀',
  'Mình có sổ phả hệ 5 đời chuẩn VIP, chiều nay đi dạo đồi thông không? 🔔',
  'Chuông cổ của bạn kêu leng keng hay quá, cho mình làm quen nha! ✨',
];
