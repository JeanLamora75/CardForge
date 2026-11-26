/** Pure presentation projection; never authorizes or dispatches an attack. */
export function grimAttackProgress(powers:readonly number[],resistance:number) {
  const power=powers.reduce((sum,value)=>sum+value,0);
  return {power,resistance,percent:Math.min(100,Math.max(0,100*power/resistance)),ready:powers.length===2&&power>=resistance};
}
