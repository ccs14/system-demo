const ts = () => new Date().toISOString();

const DEBUG_ON = process.env.APP_DEBUG === "1";

export const info = (...a) => console.log(ts(), "[INFO]", ...a);
export const warn = (...a) => console.warn(ts(), "[WARN]", ...a);
export const error = (...a) => console.error(ts(), "[ERROR]", ...a);

export const debug = DEBUG_ON
  ? (...a) => console.log(ts(), "[DEBUG]", ...a)
  : () => {};
