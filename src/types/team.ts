// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Team = {
  id: string;
  name: string;
  abbreviation: string;
  logo: string;
  primaryColor?: string;
  alternateColor?: string;
  location: string;
  record?: string;
  seed?: string;

  wins?: string;
  losses?: string;
  ties?: string;
  conference?: string;
  division?: string;
  home?: string;
  road?: string;
  vsconf?: string;
  vsdiv?: string;
  pointsfor?: string;
  pointsagainst?: string;
  differential?: string;
  streak?: string;
  winpercent?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
