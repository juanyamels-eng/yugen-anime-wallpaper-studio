/**
 * Privacy-respectful analytics service
 * Tracks aggregated actions without personally identifiable information
 */

export interface AnalyticsEvent {
  event: 'wallpaper_view' | 'wallpaper_download' | 'wallpaper_favorite' | 'wallpaper_share' | 'search' | 'collection_open' | 'wallpaper_apply';
  properties: Record<string, string | number | boolean | undefined>;
  timestamp: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  track(
    event: AnalyticsEvent['event'],
    properties: Record<string, string | number | boolean | undefined> = {}
  ): void {
    const record: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
    };
    this.events.push(record);

    // Keep memory bounded to last 200 events
    if (this.events.length > 200) {
      this.events.shift();
    }

    try {
      const stored = localStorage.getItem('yugen_analytics_history');
      const list = stored ? JSON.parse(stored) : [];
      list.push(record);
      if (list.length > 100) list.shift();
      localStorage.setItem('yugen_analytics_history', JSON.stringify(list));
    } catch {
      // silent
    }
  }

  getRecentEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getAggregatedStats(): { totalViews: number; totalDownloads: number; totalFavorites: number } {
    let views = 0;
    let downloads = 0;
    let favorites = 0;
    this.events.forEach((e) => {
      if (e.event === 'wallpaper_view') views++;
      if (e.event === 'wallpaper_download') downloads++;
      if (e.event === 'wallpaper_favorite') favorites++;
    });
    return { totalViews: views, totalDownloads: downloads, totalFavorites: favorites };
  }
}

export const analytics = new AnalyticsService();
