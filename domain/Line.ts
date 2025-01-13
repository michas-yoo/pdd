export type LineKey = string;

export type LineInfo = {
  description?: string;
};

export type Line = {
  [lineKey: LineKey]: LineInfo;
};
