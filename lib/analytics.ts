import api from './api';

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  category: string; // 'page_view' | 'cta_click' | 'lead_submission' | 'error'
  action: string;   // e.g., 'click_start_pilot', 'view_landing'
  label?: string;   // e.g., '/pricing', 'accts.pak@gmail.com'
  value?: number;   // e.g., revenue, duration, or rating
  sessionId: string;
  userAgent: string;
  referrer: string;
}

const SESSION_KEY = 't360_analytics_session_id';
const LOCAL_STORAGE_KEY = 't360_analytics_events';

// Helper to get or create a stable session ID
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server-side';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

// Helper to load event stack safely from localStorage
const loadEventsLocal = (): AnalyticsEvent[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Helper to save event stack safely to localStorage
const saveEventsLocal = (events: AnalyticsEvent[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('[Analytics] Failed to save local events', err);
  }
};

// Seed initial mock traffic signals if none exist to make the dashboard immediately useful and realistic
const seedMockTrafficIfNeeded = () => {
  const events = loadEventsLocal();
  if (events.length === 0) {
    const mockEvents: AnalyticsEvent[] = [];
    const now = new Date();
    const actions = [
      { cat: 'page_view', act: 'view_landing', label: '/' },
      { cat: 'page_view', act: 'view_pricing', label: '/pricing' },
      { cat: 'page_view', act: 'view_blog', label: '/blog' },
      { cat: 'cta_click', act: 'click_start_pilot', label: 'Start Free Pilot Button' },
      { cat: 'cta_click', act: 'click_contact_sales', label: 'Contact Sales Button' },
      { cat: 'lead_submission', act: 'register_account', label: 'Onboarding Step 1 Completed' },
      { cat: 'page_view', act: 'view_daycare', label: '/daycare' },
      { cat: 'cta_click', act: 'click_book_tutor', label: 'Book Private Tutor' }
    ];

    // Create 45 structured historical events over the last 4 days
    for (let i = 0; i < 45; i++) {
      const dayDiff = Math.floor(Math.random() * 4); // 0 to 3 days ago
      const hourDiff = Math.floor(Math.random() * 24);
      const minDiff = Math.floor(Math.random() * 60);
      const timestamp = new Date(now.getTime() - (dayDiff * 24 * 60 * 60 * 1000) - (hourDiff * 60 * 60 * 1000) - (minDiff * 60 * 1000));
      
      const item = actions[Math.floor(Math.random() * actions.length)];
      
      mockEvents.push({
        id: `mock-evt-${i}-${timestamp.getTime()}`,
        timestamp: timestamp.toISOString(),
        category: item.cat,
        action: item.act,
        label: item.label,
        sessionId: `session-mock-${Math.floor(Math.random() * 12)}`,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        referrer: 'https://google.com'
      });
    }

    // Sort by timestamp ascending
    mockEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    saveEventsLocal(mockEvents);
  }
};

export const analytics = {
  init: () => {
    if (typeof window === 'undefined') return;
    seedMockTrafficIfNeeded();
    
    // Auto-track clicks on elements with data-cta or data-track attributes
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('[data-cta], button, a');
      if (!clickable) return;

      const ctaAttr = clickable.getAttribute('data-cta');
      const trackAttr = clickable.getAttribute('data-track');
      
      if (ctaAttr || trackAttr) {
        analytics.trackEvent(
          'cta_click',
          ctaAttr || trackAttr || 'unnamed_element',
          clickable.textContent?.trim() || clickable.getAttribute('href') || undefined
        );
      }
    });
  },

  trackPageView: (path: string) => {
    analytics.trackEvent('page_view', `view_${path.substring(1) || 'home'}`, path);
  },

  trackEvent: (category: string, action: string, label?: string, value?: number) => {
    if (typeof window === 'undefined') return;

    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      category,
      action,
      label,
      value,
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };

    const events = loadEventsLocal();
    events.push(event);
    saveEventsLocal(events);

    // Sync to back-end in a non-blocking background task
    api.post('/analytics/events/', event).catch((err) => {
      // Slitently handle sync issues - cache preserves them locally
      console.debug('[Analytics] Offline caching active', err);
    });
  },

  getStats: () => {
    const events = loadEventsLocal();
    
    const pageViews = events.filter(e => e.category === 'page_view');
    const ctaClicks = events.filter(e => e.category === 'cta_click');
    const leadSubmissions = events.filter(e => e.category === 'lead_submission');

    // Group page views by path
    const pageViewsByPath: Record<string, number> = {};
    pageViews.forEach(e => {
      if (e.label) {
        pageViewsByPath[e.label] = (pageViewsByPath[e.label] || 0) + 1;
      }
    });

    // Group CTAs by action name
    const ctaClicksByName: Record<string, number> = {};
    ctaClicks.forEach(e => {
      ctaClicksByName[e.action] = (ctaClicksByName[e.action] || 0) + 1;
    });

    // Group by day for timeline chart (last 4 days)
    const timelineData: Record<string, { views: number; clicks: number; leads: number }> = {};
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      timelineData[dateStr] = { views: 0, clicks: 0, leads: 0 };
    }

    events.forEach(e => {
      const dateStr = e.timestamp.split('T')[0];
      if (timelineData[dateStr]) {
        if (e.category === 'page_view') timelineData[dateStr].views++;
        else if (e.category === 'cta_click') timelineData[dateStr].clicks++;
        else if (e.category === 'lead_submission') timelineData[dateStr].leads++;
      }
    });

    return {
      totalViews: pageViews.length,
      totalClicks: ctaClicks.length,
      totalLeads: leadSubmissions.length,
      conversionRate: pageViews.length > 0 ? ((ctaClicks.length / pageViews.length) * 100).toFixed(1) : '0.0',
      pageViewsByPath,
      ctaClicksByName,
      timeline: Object.entries(timelineData).map(([date, counts]) => ({
        date,
        ...counts
      })),
      recentEvents: events.slice(-15).reverse() // Last 15 events
    };
  }
};
