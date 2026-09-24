export interface MonetizationPlan {
  id: 'free' | 'monthly' | 'yearly' | 'lifetime';
  name: string;
  price: string;
  priceValue: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  popular?: boolean;
  savingsBadge?: string;
}

export const MONETIZATION_CONFIG = {
  enabled: true,
  admob: {
    appId: process.env.ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713', // Test AdMob ID
    bannerUnitId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialUnitId: 'ca-app-pub-3940256099942544/1033173712',
    rewardedUnitId: 'ca-app-pub-3940256099942544/5224354917',
  },
  plans: [
    {
      id: 'free',
      name: 'Gratuito',
      price: '$0',
      priceValue: 0,
      currency: 'USD',
      billingPeriod: 'Para siempre',
      features: [
        'Acceso a miles de wallpapers',
        'Descargas estándar en Full HD',
        'Favoritos sincronizados',
        'Anuncios discretos no invasivos',
      ],
    },
    {
      id: 'monthly',
      name: 'Yūgen Pass Mensual',
      price: '$2.99',
      priceValue: 2.99,
      currency: 'USD',
      billingPeriod: '/mes',
      features: [
        'Cero publicidad (Ad-Free total)',
        'Descargas ilimitadas en 4K Ultra HD & AMOLED',
        'Colecciones exclusivas para miembros',
        'Acceso anticipado a lanzamientos semanales',
      ],
    },
    {
      id: 'yearly',
      name: 'Yūgen Pass Anual',
      price: '$19.99',
      priceValue: 19.99,
      currency: 'USD',
      billingPeriod: '/año',
      popular: true,
      savingsBadge: 'Ahorra 45%',
      features: [
        'Todo lo incluido en el Pase Mensual',
        'Generador de fondos con IA prioritario',
        'Insignia de coleccionista en perfil',
        'Prioridad en solicitud de wallpapers temáticos',
      ],
    },
  ] as MonetizationPlan[],
};
