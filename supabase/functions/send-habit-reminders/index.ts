import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

function localParts(timeZone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23"
  }).formatToParts(now);
  const get = (type: string) => parts.find(p => p.type === type)?.value || "";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}`, day: weekdayMap[get("weekday")] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const cronSecret = Deno.env.get("HABIT_PUSH_CRON_SECRET") || "";
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const vapidPublic = Deno.env.get("VAPID_PUBLIC_KEY") || "";
  const vapidPrivate = Deno.env.get("VAPID_PRIVATE_KEY") || "";
  const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@example.com";
  if (!supabaseUrl || !serviceKey || !vapidPublic || !vapidPrivate) {
    return new Response(JSON.stringify({ error: "Missing server configuration" }), { status: 500, headers: corsHeaders });
  }

  const db = createClient(supabaseUrl, serviceKey);
  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);
  const { data: subscriptions, error: subError } = await db.from("push_subscriptions").select("id,user_id,subscription,timezone");
  if (subError) return new Response(JSON.stringify({ error: subError.message }), { status: 500, headers: corsHeaders });

  let sent = 0, removed = 0, errors = 0;
  const userIds = [...new Set((subscriptions || []).map((s: any) => s.user_id))];
  const appDataByUser = new Map<string, any>();
  if (userIds.length) {
    const { data, error } = await db.from("user_app_data").select("user_id,app_data").in("user_id", userIds);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    for (const row of data || []) appDataByUser.set(row.user_id, row.app_data || {});
  }

  for (const sub of subscriptions || []) {
    const tz = sub.timezone || "America/Sao_Paulo";
    let parts;
    try { parts = localParts(tz); } catch { errors++; continue; }
    const app = appDataByUser.get(sub.user_id) || {};
    const habits = Array.isArray(app.habits) ? app.habits : [];
    const completed = Array.isArray(app.checks?.[parts.date]) ? app.checks[parts.date] : [];
    for (const habit of habits) {
      if (!habit || habit.active === false || !habit.id || !habit.title) continue;
      if (!habit.reminderPeriod || habit.reminderPeriod === "off") continue;
      const days = Array.isArray(habit.days) ? habit.days : [0,1,2,3,4,5,6];
      if (!days.includes(parts.day) || completed.includes(habit.id)) continue;
      const target = habit.reminderPeriod === "custom"
        ? (habit.reminderTime || "08:00")
        : ({ morning: "08:00", afternoon: "14:00", evening: "19:00" } as Record<string,string>)[habit.reminderPeriod];
      if (target !== parts.time) continue;

      const { data: claim, error: claimError } = await db.from("push_notification_log")
        .insert({ subscription_id: sub.id, habit_id: String(habit.id), local_date: parts.date })
        .select("id").maybeSingle();
      if (claimError) {
        if (claimError.code === "23505") continue;
        errors++; continue;
      }
      try {
        await webpush.sendNotification(sub.subscription, JSON.stringify({
          title: "Está na hora de cuidar de você 🌿",
          body: String(habit.title).slice(0, 180),
          url: "/projeto-ativa/",
          tag: "ativa-habitus-" + String(habit.id)
        }));
        sent++;
      } catch (e) {
        await db.from("push_notification_log").delete().eq("id", claim?.id);
        const status = (e as any)?.statusCode;
        if (status === 404 || status === 410) {
          await db.from("push_subscriptions").delete().eq("id", sub.id);
          removed++;
        } else errors++;
      }
    }
  }
  return new Response(JSON.stringify({ ok: true, sent, removed, errors }), { headers: corsHeaders });
});
