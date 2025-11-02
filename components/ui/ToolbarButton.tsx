import * as React from 'react';

type Variant = 'ghost'|'outline'|'brand'|'warn';
export default function ToolbarButton(
  {children, variant='ghost', onClick}:{children:React.ReactNode, variant?:Variant, onClick?:React.MouseEventHandler}
){
  const cls = variant==='brand'?'btn btn-brand':variant==='warn'?'btn btn-warn':variant==='outline'?'btn btn-outline':'btn btn-ghost';
  return <button className={cls} onClick={onClick}>{children}</button>;
}
