export const GetFlightTime = async (
  departure: string,
  arrival: string
): Promise<number> => {
  const flithTimeReq = `{"token":null,"icaos":["${departure}","${arrival}"],"deptDate":"2021-9-19","aircraftType":2,"windType":2,"runwayMinimumFT":0,"aircraftID":0}`;
  const flightTimeRes = await fetch(
    'https://airplanemanager.com/flightcalculator',
    {
      method: 'POST',
      body: flithTimeReq,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    }
  );
  const flightTimeObj = await flightTimeRes.json();
  const flightTime = flightTimeObj.flightTime * 60;
  return flightTime;
};
