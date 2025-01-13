export type SignKey = string;

export type SignInfo = {
  title: string;
  description?: string;
  versions?: string[];
  skip?: string[];
};

export type Sign = {
  [signKey: SignKey]: SignInfo;
};
