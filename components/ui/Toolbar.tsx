import * as React from 'react';

export default function Toolbar({children}:{children:React.ReactNode}){
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
