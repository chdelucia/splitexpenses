
export function convertStringToMap(data:string): Map<any, any> {
  let obj = JSON.parse(data);
  let map = new Map(Object.entries(obj));
  return map;
}

export function convertMaptoString(map: Map<string, any>): string{
  let obj = Object.fromEntries(map);
  let jsonString = JSON.stringify(obj);
  return jsonString;
}

export function calcNextID(data: Map<any, any>): string{
    let lastId = Array.from(data.keys()).pop() || '0';
    let nextId = parseInt(lastId) + 1;
    return nextId.toString();
  }
  
export function round2decimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
  