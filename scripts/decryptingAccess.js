export default async function DecryptingAccess(encryptedAccess) {
  const fpPromise = FingerprintJS.load();
  const result = await fpPromise.then((fp) => fp.get());
  const { screenResolution, ...components } = result.components;

  const visitorId = FingerprintJS.hashComponents(components);

  let decryptedAccess;
  try {
    decryptedAccess = CryptoJS.AES.decrypt(encryptedAccess, visitorId).toString(
      CryptoJS.enc.Utf8
    );
  } catch (error) {
    if (error.toString() === "Error: Malformed UTF-8 data") {
      location.href = "/logout";
    }
  }

  if (!decryptedAccess) {
    location.href = "/logout";
    return;
  }

  return decryptedAccess;
}
