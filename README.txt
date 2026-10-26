CITI FIELD SECURITY PATROL - LOCAL PILOT

1. Upload all files in this folder to a free HTTPS static host (for example GitHub Pages or Netlify). Keep the files together.
2. Open the hosted HTTPS URL in Safari on the assigned iPad. Use Share > Add to Home Screen.
3. Start a new patrol for each guard and shift. Tap each check at the actual location. The timestamp locks immediately.
4. Use Resume to continue an unfinished patrol. Export CSV to open in Excel.
5. Pilot data is stored ONLY in this iPad's browser/app storage. It does NOT sync to a central server, another device, or a management account. Export regularly and back up CSV files. Do not clear browser data or remove the web app without first exporting.
6. Offline use works only AFTER the web app and service worker have successfully loaded online at least once. Verify by turning off Wi-Fi and reopening the Home Screen app. Storage can be evicted by iOS and is not a guaranteed disaster-recovery backup.
7. Offline timestamps come from the iPad clock, not a trusted server. A clock change can affect them. No tamper-proof audit or supervisor-only access is implemented in this pilot.
8. This pilot is NOT approved for operational security use until exact patrol location labels, field behavior, offline persistence, accessibility, retention policy, device settings, and authorization have been validated.
9. The Mobile Patrol paper form uses Yes/No checks, not four time columns. This pilot includes four timestamped check buttons as requested, plus a gate/door condition selector. Confirm the desired mobile workflow before production.
10. For production, add central authentication, server-side immutable event storage, audit trails, device-independent sync, offline event queues, management permissions, and robust backups.
