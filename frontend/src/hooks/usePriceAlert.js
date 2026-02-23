import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'btc4fire_price_alerts';

function loadAlerts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAlerts(alerts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export function usePriceAlert(currentPrice) {
  const [alerts, setAlerts] = useState(loadAlerts);
  const firedRef = useRef(new Set());

  const addAlert = useCallback(async (targetPrice, direction) => {
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    const alert = { id: Date.now(), targetPrice: Number(targetPrice), direction };
    setAlerts(prev => {
      const next = [...prev, alert];
      saveAlerts(next);
      return next;
    });
  }, []);

  const removeAlert = useCallback((id) => {
    firedRef.current.delete(id);
    setAlerts(prev => {
      const next = prev.filter(a => a.id !== id);
      saveAlerts(next);
      return next;
    });
  }, []);

  // Check alerts whenever price updates
  useEffect(() => {
    if (!currentPrice || Notification.permission !== 'granted') return;
    alerts.forEach(alert => {
      if (firedRef.current.has(alert.id)) return;
      const triggered =
        (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.direction === 'below' && currentPrice <= alert.targetPrice);
      if (triggered) {
        firedRef.current.add(alert.id);
        new Notification('BTC4Fire Price Alert', {
          body: `BTC hit $${currentPrice.toLocaleString()} — your ${alert.direction} $${alert.targetPrice.toLocaleString()} alert triggered!`,
          icon: '/favicon.ico',
        });
      }
    });
  }, [currentPrice, alerts]);

  return { alerts, addAlert, removeAlert };
}
