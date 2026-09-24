import { AppLanguage } from '../types/user.types';

export interface Translations {
  nav: {
    home: string;
    explore: string;
    search: string;
    favorites: string;
    profile: string;
    admin: string;
  };
  home: {
    searchPlaceholder: string;
    featured: string;
    trending: string;
    new: string;
    forYou: string;
    collections: string;
    popularWeek: string;
    nightSelection: string;
    topRated: string;
    viewAll: string;
  };
  viewer: {
    applyWallpaper: string;
    previewPhone: string;
    download: string;
    share: string;
    favorite: string;
    favorited: string;
    details: string;
    resolution: string;
    ratio: string;
    views: string;
    downloads: string;
    category: string;
    license: string;
    prompt: string;
    tags: string;
    palette: string;
  };
  applyModal: {
    title: string;
    subtitle: string;
    homeScreen: string;
    lockScreen: string;
    bothScreens: string;
    cancel: string;
    applying: string;
    success: string;
  };
  preview: {
    title: string;
    lockScreen: string;
    homeScreen: string;
    swipeHint: string;
  };
  favorites: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    exploreButton: string;
  };
  downloads: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    clearHistory: string;
  };
  profile: {
    title: string;
    guestUser: string;
    signInPrompt: string;
    googleSignIn: string;
    emailSignIn: string;
    logout: string;
    settings: string;
    theme: string;
    language: string;
    downloadQuality: string;
    dataSaver: string;
    amoledBlack: string;
    clearCache: string;
    privacy: string;
    terms: string;
    about: string;
    version: string;
    premiumBannerTitle: string;
    premiumBannerSub: string;
    upgradeButton: string;
    manageSubscription: string;
  };
}

export const I18N_DICTIONARIES: Record<AppLanguage, Translations> = {
  es: {
    nav: {
      home: 'Inicio',
      explore: 'Explorar',
      search: 'Buscar',
      favorites: 'Favoritos',
      profile: 'Perfil',
      admin: 'Admin',
    },
    home: {
      searchPlaceholder: 'Buscar wallpapers, personajes, anime...',
      featured: 'Destacado',
      trending: '🔥 Tendencias',
      new: '✨ Nuevos',
      forYou: '🌸 Para ti',
      collections: '🎨 Colecciones temáticas',
      popularWeek: '⚡ Popular esta semana',
      nightSelection: '🌙 Selección nocturna & AMOLED',
      topRated: '⭐ Mejor valorados',
      viewAll: 'Ver todo',
    },
    viewer: {
      applyWallpaper: 'APLICAR FONDO',
      previewPhone: 'Vista previa teléfono',
      download: 'Descargar 4K',
      share: 'Compartir',
      favorite: 'Favorito',
      favorited: 'Guardado',
      details: 'Especificaciones',
      resolution: 'Resolución',
      ratio: 'Proporción',
      views: 'Vistas',
      downloads: 'Descargas',
      category: 'Categoría',
      license: 'Licencia original',
      prompt: 'Prompt de creación',
      tags: 'Etiquetas',
      palette: 'Paleta de colores',
    },
    applyModal: {
      title: 'Aplicar Wallpaper',
      subtitle: 'Elige dónde deseas establecer este fondo anime:',
      homeScreen: 'Pantalla de Inicio',
      lockScreen: 'Pantalla de Bloqueo',
      bothScreens: 'Ambas Pantallas',
      cancel: 'Cancelar',
      applying: 'Preparando fondo en alta calidad...',
      success: '¡Fondo descargado y preparado!',
    },
    preview: {
      title: 'Simulador de Smartphone',
      lockScreen: 'Bloqueo',
      homeScreen: 'Inicio',
      swipeHint: 'Desliza o alterna para comparar',
    },
    favorites: {
      title: 'Mis Favoritos',
      emptyTitle: 'Tu colección todavía está vacía',
      emptySubtitle: 'Toca el corazón en cualquier fondo para guardarlo aquí y sincronizarlo.',
      exploreButton: 'Explorar wallpapers',
    },
    downloads: {
      title: 'Historial de Descargas',
      emptyTitle: 'Sin descargas recientes',
      emptySubtitle: 'Los fondos que descargues estarán guardados aquí para acceso rápido.',
      clearHistory: 'Limpiar historial',
    },
    profile: {
      title: 'Mi Cuenta',
      guestUser: 'Modo Invitado',
      signInPrompt: 'Inicia sesión para sincronizar tus favoritos en todos tus dispositivos.',
      googleSignIn: 'Continuar con Google',
      emailSignIn: 'Acceder con Email',
      logout: 'Cerrar sesión',
      settings: 'Configuración de la App',
      theme: 'Tema visual',
      language: 'Idioma / Language',
      downloadQuality: 'Calidad de descarga predeterminada',
      dataSaver: 'Ahorro de datos móviles',
      amoledBlack: 'Negros puros AMOLED',
      clearCache: 'Limpiar caché local',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      about: 'Acerca de Yūgen',
      version: 'Versión',
      premiumBannerTitle: 'YŪGEN PASS PREMIUM',
      premiumBannerSub: 'Descargas 4K ilimitadas, cero publicidad y acceso anticipado.',
      upgradeButton: 'Obtener Premium',
      manageSubscription: 'Gestionar suscripción',
    },
  },
  en: {
    nav: {
      home: 'Home',
      explore: 'Explore',
      search: 'Search',
      favorites: 'Favorites',
      profile: 'Profile',
      admin: 'Admin',
    },
    home: {
      searchPlaceholder: 'Search wallpapers, styles, anime aesthetic...',
      featured: 'Featured',
      trending: '🔥 Trending',
      new: '✨ Just Added',
      forYou: '🌸 For You',
      collections: '🎨 Curated Collections',
      popularWeek: '⚡ Popular This Week',
      nightSelection: '🌙 Night & AMOLED Picks',
      topRated: '⭐ Top Rated',
      viewAll: 'See all',
    },
    viewer: {
      applyWallpaper: 'APPLY WALLPAPER',
      previewPhone: 'Phone Preview',
      download: 'Download 4K',
      share: 'Share',
      favorite: 'Favorite',
      favorited: 'Saved',
      details: 'Specifications',
      resolution: 'Resolution',
      ratio: 'Aspect Ratio',
      views: 'Views',
      downloads: 'Downloads',
      category: 'Category',
      license: 'License',
      prompt: 'Creation Prompt',
      tags: 'Tags',
      palette: 'Color Palette',
    },
    applyModal: {
      title: 'Set Wallpaper',
      subtitle: 'Select where to apply this anime artwork:',
      homeScreen: 'Home Screen',
      lockScreen: 'Lock Screen',
      bothScreens: 'Both Screens',
      cancel: 'Cancel',
      applying: 'Optimizing high-res image...',
      success: 'Wallpaper saved successfully!',
    },
    preview: {
      title: 'Phone Simulator',
      lockScreen: 'Lock Screen',
      homeScreen: 'Home Screen',
      swipeHint: 'Toggle between screens to check clock & icon fit',
    },
    favorites: {
      title: 'My Favorites',
      emptyTitle: 'Your collection is empty',
      emptySubtitle: 'Tap the heart on any wallpaper to save it here and keep it synced.',
      exploreButton: 'Explore Wallpapers',
    },
    downloads: {
      title: 'Download History',
      emptyTitle: 'No downloads yet',
      emptySubtitle: 'All wallpapers you download will appear here for fast retrieval.',
      clearHistory: 'Clear History',
    },
    profile: {
      title: 'My Profile',
      guestUser: 'Guest Traveler',
      signInPrompt: 'Sign in to sync your favorite anime wallpapers across all devices.',
      googleSignIn: 'Continue with Google',
      emailSignIn: 'Sign in with Email',
      logout: 'Sign Out',
      settings: 'App Settings',
      theme: 'Theme',
      language: 'Language',
      downloadQuality: 'Default Download Quality',
      dataSaver: 'Data Saver',
      amoledBlack: 'Pure AMOLED Black',
      clearCache: 'Clear Local Cache',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      about: 'About Yūgen',
      version: 'Version',
      premiumBannerTitle: 'YŪGEN PASS PREMIUM',
      premiumBannerSub: 'Unlimited 4K downloads, 100% ad-free experience & early drops.',
      upgradeButton: 'Upgrade to Premium',
      manageSubscription: 'Manage Subscription',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      explore: '探索',
      search: '検索',
      favorites: 'お気に入り',
      profile: 'マイページ',
      admin: '管理',
    },
    home: {
      searchPlaceholder: '壁紙、キャラクター、世界観を検索...',
      featured: '注目',
      trending: '🔥 トレンド',
      new: '✨ 新着',
      forYou: '🌸 あなたへのおすすめ',
      collections: '🎨 特集コレクション',
      popularWeek: '⚡ 今週の人気作',
      nightSelection: '🌙 夜景・AMOLED特選',
      topRated: '⭐ 高評価作品',
      viewAll: 'すべて見る',
    },
    viewer: {
      applyWallpaper: '壁紙に設定する',
      previewPhone: 'スマホプレビュー',
      download: '4Kダウンロード',
      share: '共有',
      favorite: 'お気に入り',
      favorited: '保存済み',
      details: '詳細仕様',
      resolution: '解像度',
      ratio: '比率',
      views: '閲覧数',
      downloads: 'ダウンロード',
      category: 'カテゴリー',
      license: 'ライセンス',
      prompt: '生成プロンプト',
      tags: 'タグ',
      palette: 'カラーパレット',
    },
    applyModal: {
      title: '壁紙を設定',
      subtitle: '壁紙を適用する画面を選択してください:',
      homeScreen: 'ホーム画面',
      lockScreen: 'ロック画面',
      bothScreens: '両方の画面',
      cancel: 'キャンセル',
      applying: '高画質画像を準備中...',
      success: '壁紙の保存が完了しました！',
    },
    preview: {
      title: 'スマホ画面シミュレーター',
      lockScreen: 'ロック画面',
      homeScreen: 'ホーム画面',
      swipeHint: '時計やアイコンの重なりを確認',
    },
    favorites: {
      title: 'お気に入りの壁紙',
      emptyTitle: 'まだお気に入りがありません',
      emptySubtitle: '壁紙のハートをタップしてここに保存しましょう。',
      exploreButton: '壁紙を探す',
    },
    downloads: {
      title: 'ダウンロード履歴',
      emptyTitle: 'ダウンロード履歴はありません',
      emptySubtitle: '保存した壁紙がここに記録されます。',
      clearHistory: '履歴をクリア',
    },
    profile: {
      title: 'アカウント設定',
      guestUser: 'ゲストユーザー',
      signInPrompt: 'ログインするとお気に入りをデバイス間で同期できます。',
      googleSignIn: 'Googleでログイン',
      emailSignIn: 'メールでログイン',
      logout: 'ログアウト',
      settings: 'アプリ設定',
      theme: '外観テーマ',
      language: '言語 (Language)',
      downloadQuality: '標準ダウンロード画質',
      dataSaver: 'データ通信節約',
      amoledBlack: 'AMOLED純黒モード',
      clearCache: 'キャッシュを削除',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      about: 'Yūgenについて',
      version: 'バージョン',
      premiumBannerTitle: 'YŪGEN PASS PREMIUM',
      premiumBannerSub: '4K無制限ダウンロード、完全広告非表示、先行公開。',
      upgradeButton: 'プレミアムに加入',
      manageSubscription: '定期購入を管理',
    },
  },
  ko: {
    nav: {
      home: '홈',
      explore: '탐색',
      search: '검색',
      favorites: '즐겨찾기',
      profile: '프로필',
      admin: '관리자',
    },
    home: {
      searchPlaceholder: '애니 배경화면, 테마 검색...',
      featured: '추천',
      trending: '🔥 인기 급상승',
      new: '✨ 최신 등록',
      forYou: '🌸 맞춤 추천',
      collections: '🎨 테마 컬렉션',
      popularWeek: '⚡ 이번 주 인기',
      nightSelection: '🌙 야간 & AMOLED 선별',
      topRated: '⭐ 최고 평점',
      viewAll: '전체보기',
    },
    viewer: {
      applyWallpaper: '배경화면 적용',
      previewPhone: '스마트폰 미리보기',
      download: '4K 다운로드',
      share: '공유',
      favorite: '즐겨찾기',
      favorited: '저장됨',
      details: '상세 정보',
      resolution: '해상도',
      ratio: '비율',
      views: '조회수',
      downloads: '다운로드',
      category: '카테고리',
      license: '라이선스',
      prompt: '생성 프롬프트',
      tags: '태그',
      palette: '컬러 팔레트',
    },
    applyModal: {
      title: '배경화면 설정',
      subtitle: '적용할 화면을 선택하세요:',
      homeScreen: '홈 화면',
      lockScreen: '잠금 화면',
      bothScreens: '둘 다 적용',
      cancel: '취소',
      applying: '고화질 이미지 준비 중...',
      success: '성공적으로 저장되었습니다!',
    },
    preview: {
      title: '폰 시뮬레이터',
      lockScreen: '잠금 화면',
      homeScreen: '홈 화면',
      swipeHint: '화면을 전환하여 시계와 아이콘 위치를 확인하세요',
    },
    favorites: {
      title: '내 즐겨찾기',
      emptyTitle: '즐겨찾기가 비어 있습니다',
      emptySubtitle: '하트를 눌러 좋아하는 배경화면을 저장하세요.',
      exploreButton: '배경화면 탐색',
    },
    downloads: {
      title: '다운로드 기록',
      emptyTitle: '다운로드한 배경화면이 없습니다',
      emptySubtitle: '다운로드한 모든 배경화면이 여기에 표시됩니다.',
      clearHistory: '기록 지우기',
    },
    profile: {
      title: '내 프로필',
      guestUser: '게스트',
      signInPrompt: '로그인하여 모든 기기에서 즐겨찾기를 동기화하세요.',
      googleSignIn: 'Google로 계속하기',
      emailSignIn: '이메일로 로그인',
      logout: '로그아웃',
      settings: '앱 설정',
      theme: '테마',
      language: '언어',
      downloadQuality: '다운로드 화질',
      dataSaver: '데이터 절약 모드',
      amoledBlack: '순수 AMOLED 블랙',
      clearCache: '캐시 삭제',
      privacy: '개인정보처리방침',
      terms: '이용약관',
      about: 'Yūgen 정보',
      version: '버전',
      premiumBannerTitle: 'YŪGEN PASS PREMIUM',
      premiumBannerSub: '무제한 4K 다운로드, 광고 없는 환경.',
      upgradeButton: '프리미엄 구독',
      manageSubscription: '구독 관리',
    },
  },
  pt: {
    nav: {
      home: 'Início',
      explore: 'Explorar',
      search: 'Buscar',
      favorites: 'Favoritos',
      profile: 'Perfil',
      admin: 'Admin',
    },
    home: {
      searchPlaceholder: 'Buscar papéis de parede anime...',
      featured: 'Destaque',
      trending: '🔥 Tendências',
      new: '✨ Recentes',
      forYou: '🌸 Para Você',
      collections: '🎨 Coleções Temáticas',
      popularWeek: '⚡ Mais Populares da Semana',
      nightSelection: '🌙 Seleção Noturna & AMOLED',
      topRated: '⭐ Mais Bem Avaliados',
      viewAll: 'Ver todos',
    },
    viewer: {
      applyWallpaper: 'APLICAR PAPEL DE PAREDE',
      previewPhone: 'Visualização no Smartphone',
      download: 'Baixar em 4K',
      share: 'Compartilhar',
      favorite: 'Favorito',
      favorited: 'Salvo',
      details: 'Especificações',
      resolution: 'Resolução',
      ratio: 'Proporção',
      views: 'Visualizações',
      downloads: 'Downloads',
      category: 'Categoria',
      license: 'Licença Original',
      prompt: 'Prompt de Criação',
      tags: 'Tags',
      palette: 'Paleta de Cores',
    },
    applyModal: {
      title: 'Definir Papel de Parede',
      subtitle: 'Escolha onde deseja aplicar esta arte anime:',
      homeScreen: 'Tela Inicial',
      lockScreen: 'Tela de Bloqueio',
      bothScreens: 'Ambas as Telas',
      cancel: 'Cancelar',
      applying: 'Preparando imagem em alta qualidade...',
      success: 'Papel de parede salvo com sucesso!',
    },
    preview: {
      title: 'Simulador de Smartphone',
      lockScreen: 'Tela de Bloqueio',
      homeScreen: 'Tela Inicial',
      swipeHint: 'Alterne entre as telas para conferir o relógio',
    },
    favorites: {
      title: 'Meus Favoritos',
      emptyTitle: 'Sua coleção ainda está vazia',
      emptySubtitle: 'Toque no coração em qualquer papel de parede para salvá-lo aqui.',
      exploreButton: 'Explorar papéis de parede',
    },
    downloads: {
      title: 'Histórico de Downloads',
      emptyTitle: 'Sem downloads recentes',
      emptySubtitle: 'Os papéis de parede baixados aparecerão aqui.',
      clearHistory: 'Limpar histórico',
    },
    profile: {
      title: 'Minha Conta',
      guestUser: 'Modo Convidado',
      signInPrompt: 'Faça login para sincronizar seus favoritos em qualquer aparelho.',
      googleSignIn: 'Continuar com Google',
      emailSignIn: 'Entrar com E-mail',
      logout: 'Sair da conta',
      settings: 'Configurações do App',
      theme: 'Tema visual',
      language: 'Idioma',
      downloadQuality: 'Qualidade padrão de download',
      dataSaver: 'Economia de dados',
      amoledBlack: 'Pretos puros AMOLED',
      clearCache: 'Limpar cache local',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Serviço',
      about: 'Sobre o Yūgen',
      version: 'Versão',
      premiumBannerTitle: 'YŪGEN PASS PREMIUM',
      premiumBannerSub: 'Downloads 4K ilimitados, sem anúncios e lançamentos antecipados.',
      upgradeButton: 'Obter Premium',
      manageSubscription: 'Gerenciar assinatura',
    },
  },
};
