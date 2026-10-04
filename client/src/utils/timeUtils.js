/**
 * Utilities for calculating flight duration taking timezones and daylight saving time into account.
 */

export function getUtcDateForLocal(dateStr, timeStr, timeZone) {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hour, min] = timeStr.split(":").map(Number);
  if ([y, m, d, hour, min].some(isNaN)) return null;

  let guessUtcMs = Date.UTC(y, m - 1, d, hour, min, 0);
  if (!timeZone) return new Date(guessUtcMs);

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false
    });

    // 2 iterations of refinement to handle DST boundaries and non-UTC offsets accurately
    for (let i = 0; i < 2; i++) {
      const parts = formatter.formatToParts(new Date(guessUtcMs));
      const p = {};
      for (const part of parts) {
        p[part.type] = part.value;
      }
      const tzHour = p.hour === "24" ? 0 : parseInt(p.hour, 10);
      const tzDateMs = Date.UTC(
        parseInt(p.year, 10),
        parseInt(p.month, 10) - 1,
        parseInt(p.day, 10),
        tzHour,
        parseInt(p.minute, 10),
        parseInt(p.second, 10)
      );
      const offsetMs = tzDateMs - guessUtcMs;
      guessUtcMs = Date.UTC(y, m - 1, d, hour, min, 0) - offsetMs;
    }
    return new Date(guessUtcMs);
  } catch (e) {
    return new Date(Date.UTC(y, m - 1, d, hour, min, 0));
  }
}

export function getTimezoneOffsetLabel(date, timeZone) {
  if (!timeZone || !date) return "";
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset"
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart ? tzPart.value : "";
  } catch {
    return "";
  }
}

export function calculateFlightDuration(depDate, depTime, depTz, arrDate, arrTime, arrTz) {
  if (!depDate || !depTime || !arrDate || !arrTime) return null;

  const depUtc = getUtcDateForLocal(depDate, depTime, depTz);
  const arrUtc = getUtcDateForLocal(arrDate, arrTime, arrTz);
  if (!depUtc || !arrUtc) return null;

  const diffMinutes = Math.round((arrUtc.getTime() - depUtc.getTime()) / 60000);
  const depOffset = getTimezoneOffsetLabel(depUtc, depTz);
  const arrOffset = getTimezoneOffsetLabel(arrUtc, arrTz);

  if (diffMinutes < 0) {
    return {
      isNegative: true,
      diffMinutes,
      depTz: depTz || null,
      arrTz: arrTz || null,
      depOffset,
      arrOffset
    };
  }

  const h = Math.floor(diffMinutes / 60);
  const m = diffMinutes % 60;
  const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  return {
    formatted,
    diffMinutes,
    hours: h,
    minutes: m,
    depTz: depTz || null,
    arrTz: arrTz || null,
    depOffset,
    arrOffset
  };
}
