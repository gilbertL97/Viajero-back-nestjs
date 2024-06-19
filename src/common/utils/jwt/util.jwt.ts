export const jwtDecode = function (t: string) {
  const base64Payload = t.split('.')[1];
  const payloadBuffer = Buffer.from(base64Payload, 'base64');
  const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
  return updatedJwtPayload;
};

export function extract_user_data(name: string, token: string) {
  const user_data = jwtDecode(token).payload;
  return { [name]: user_data.sub, ...user_data };
}
