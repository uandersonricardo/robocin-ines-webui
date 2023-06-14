type Module = {
  name: string;
  parameters: Parameter[];
};

type Parameter = {
  name: string;
  description: string;
  type: string;
  value: string;
  details: {
    [key: string]: string;
  }
};
