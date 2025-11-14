export const ok = (res: any, data: any) => res.json({ success: true, data });

export const error = (res: any, message = "Server error", code = 500) =>
  res.status(code).json({ success: false, message });
