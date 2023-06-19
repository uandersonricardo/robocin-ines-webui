import React from "react";

import CInput from "./CInput";

export interface CParamProps {
  param: Parameter;
}

const componentMapper: Record<string, React.FC<CParamProps>> = {
  Input: CInput,
};

const CParam: React.FC<CParamProps> = ({ param }) => {
  const Component = componentMapper[param.type] || (() => <></>);

  return <Component param={param} />;
};

export default CParam;
